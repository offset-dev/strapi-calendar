import React from 'react';
import { Layouts, useFetchClient } from '@strapi/admin/strapi-admin';
import { Page } from '@strapi/strapi/admin';
import { Cog, Plus } from '@strapi/icons';
import tinyColor from 'tinycolor2';
import moment from 'moment';
import { EmptyStateLayout, LinkButton, Box, Loader } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { useTheme } from 'styled-components';

import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils/getTranslation';
import Illo from '../components/Calendar/Illo';
import { useSettings } from '../context/Settings';
import pluginPermissions from '../permissions';

const CalendarPage = () => {
  const theme = useTheme();
  const { get } = useFetchClient();

  const { settings, loading } = useSettings();
  const { formatMessage } = useIntl();

  if (loading) return <Loader />;
  if (!settings.collection) {
    return (
      <>
        <Layouts.Header
          title={formatMessage({ id: getTranslation('plugin.name'), defaultMessage: 'Calendar' })}
          subtitle={formatMessage({
            id: getTranslation('plugin.tagline'),
            defaultMessage: 'Visualize your events',
          })}
          as="h2"
        />
        <Layouts.Content>
          <EmptyStateLayout
            icon={<Illo />}
            content={formatMessage({
              id: getTranslation('view.calendar.state.empty.configure-settings.message'),
              defaultMessage: 'Please configure the settings before accessing the calendar',
            })}
            action={
              <LinkButton
                variant="primary"
                href={`/admin/settings/${PLUGIN_ID}`}
                startIcon={<Cog color={'white'} />}
              >
                {formatMessage({
                  id: getTranslation('view.calendar.state.empty.configure-settings.action'),
                  defaultMessage: 'Settings',
                })}
              </LinkButton>
            }
          />
        </Layouts.Content>
      </>
    );
  }

  const { monthView, weekView, workWeekView, dayView, defaultView, todayButton } = settings;

  // Define the views to be displayed
  let views = '';
  if (monthView) views += 'dayGridMonth,';
  if (weekView) views += 'timeGridWeek,';
  if (workWeekView) views += 'workWeek,';
  if (dayView) views += 'dayView,';
  views = views.slice(0, -1);

  // Define the buttons to be displayed
  let left = 'prev,next' + (todayButton ? ' today' : '');

  // Define initial view
  const initialView =
    defaultView === 'Month'
      ? 'dayGridMonth'
      : defaultView === 'Week'
        ? 'timeGridWeek'
        : defaultView === 'Work-Week'
          ? 'workWeek'
          : defaultView === 'Day'
            ? 'dayView'
            : 'dayGridMonth';

  const primaryAction = settings.createButton ? (
    <LinkButton
      startIcon={<Plus color={'white'} />}
      href={`/admin/content-manager/collection-types/${settings.collection}/create`}
    >
      {formatMessage(
        { id: getTranslation('view.calendar.action.create-entry'), defaultMessage: 'Create New' },
        { collection: settings.collection?.split('.')[1] }
      )}
    </LinkButton>
  ) : (
    <div />
  );

  // Override Styles
  const primaryColor = settings.primaryColor;
  const lightPrimaryColor = tinyColor(primaryColor).lighten().toString();

  const sty = `
    :root {
      --fc-page-bg-color: transparent;
      --fc-button-bg-color: ${primaryColor};
      --fc-button-active-bg-color: ${lightPrimaryColor};
      --fc-button-hover-bg-color: ${lightPrimaryColor};
      --fc-button-border-color: rgba(0, 0, 0, 0.2);
      --fc-button-active-border-color: rgba(0, 0, 0, 0.2);
    }

    .fc {
      font-size: 1.3em;
    }

    .fc-button, .fc-toolbar-title, .fc-col-header-cell-cushion {
      text-transform: capitalize !important;
    }

    .fc-toolbar-title {
      font-weight: bold !important;
    }

    .fc-button {
      padding: 0.6em 1.2em !important;
    }

    .fc-day-today {
      background-color: ${settings.primaryColor}22 !important;
    }

    .fc-timegrid-slots tr {
      height: 3.5em;
    }

    .fc-daygrid-day-frame {
      min-height: 10em !important;
    }

    .fc-daygrid-day-events a,
    .fc-daygrid-day-events a:hover,
    .fc-daygrid-day-events a:visited,
    .fc-daygrid-day-events a:active {
      color: ${theme.colors.neutral1000};
    }
  `;

  const fetchEvents = async (fetchInfo: any) => {
    try {
      /**
       * By using Content Manager, events are fetched directly from the content manager plugin,
       * ensuring that only content visible to the user is displayed on the calendar.
       */
      if (settings.contentManager) {
        const startFilter = `filters[$and][0][${settings.startField}][$gte]`;
        const endFilter = `filters[$and][1][${settings.endField}][$lte]`;

        const data = await get(`/content-manager/collection-types/${settings.collection}`, {
          params: {
            page: 1,
            pageSize: 1_000,
            status: settings.drafts ? undefined : 'published',
            [startFilter]: fetchInfo.startStr,
            [endFilter]: fetchInfo.endStr,
          },
        });

        return data.data.results.map((x: any) => ({
          id: x.documentId,
          title: settings.titleField ? x[settings.titleField] : settings.startField,
          start: x[settings.startField!],
          end: settings.endField
            ? x[settings.endField]
            : moment(x[settings.startField!]).add(settings.defaultDuration, 'minutes'),
          backgroundColor:
            settings.colorField && x[settings.colorField]
              ? x[settings.colorField]
              : settings.eventColor,
          borderColor:
            settings.colorField && x[settings.colorField]
              ? x[settings.colorField]
              : settings.eventColor,
          url: `/admin/content-manager/collection-types/${settings.collection}/${x.documentId}`,
        }));
      }

      // Else, fetch bypassing RBAC permissions
      const { data } = await get(`/${PLUGIN_ID}/`, {
        params: {
          start: fetchInfo.startStr,
          end: fetchInfo.endStr,
        },
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      return [];
    }
  };

  return (
    <Page.Protect permissions={pluginPermissions.accessCalendar}>
      <Layouts.Header
        title={formatMessage({ id: getTranslation('plugin.name'), defaultMessage: 'Calendar' })}
        subtitle={formatMessage({
          id: getTranslation('plugin.tagline'),
          defaultMessage: 'Visualize your events',
        })}
        as="h2"
        primaryAction={primaryAction}
      />
      <Layouts.Content>
        <Box
          background={'neutral0'}
          shadow="filterShadow"
          padding={[5, 8]}
          hasRadius
          style={{
            zIndex: 0,
            position: 'relative',
          }}
        >
          <style>{sty}</style>
          <FullCalendar
            events={fetchEvents}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView={initialView}
            slotMinTime={settings.startHour}
            slotMaxTime={settings.endHour}
            allDaySlot={false}
            views={{
              workWeek: {
                type: 'timeGrid',
                duration: { week: 1 },
                hiddenDays: [0, 6, 7],
                buttonText: formatMessage({
                  id: getTranslation('view.calendar.view.work-week'),
                  defaultMessage: 'Work Week',
                }),
              },
              dayView: {
                type: 'timeGrid',
                duration: { days: 1 },
                buttonText: formatMessage({
                  id: getTranslation('view.calendar.view.day'),
                  defaultMessage: 'Day View',
                }),
              },
            }}
            height={'auto'}
            locale={formatMessage({
              id: getTranslation('view.calendar.locale'),
              defaultMessage: 'en-US',
            })}
            headerToolbar={{
              left,
              center: 'title',
              right: views,
            }}
          />
        </Box>
      </Layouts.Content>
    </Page.Protect>
  );
};

export { CalendarPage };
