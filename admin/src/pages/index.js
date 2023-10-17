/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { useIntl } from 'react-intl';
import validateColor from 'validate-color';

import {
  EmptyStateLayout,
  BaseHeaderLayout,
  ContentLayout,
  LinkButton,
  Box,
  Loader,
  Link,
  Typography,
  Flex,
  Button,
  DatePicker,
  Select,
  Option,
  IconButton,
} from '@strapi/design-system';
import { Cog, Plus, ChevronLeft, ChevronRight } from '@strapi/icons';
import moment from 'moment';

import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
import Illo from '../components/illo';
import api from '../api';
import getTrad from '../utils/getTrad';

function HomePage() {
  const [state, setState] = useState({
    date: moment().format('ll'),
    view: 'Month',
  });
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [data, setData] = useState([]);

  const { formatMessage, formatDate } = useIntl();

  const load = (date) => {
    api.getData(moment(date, 'll').toDate()).then((r) => {
      setData(r.data);
      setLoading(false);
    });
  };

  const initialLoad = () => {
    api.getData().then((r) => {
      setData(r.data);
    });
    api.getSettings().then((r) => {
      if (r.data) {
        setSettings(r.data);
        setState((s) => ({ ...s, view: r.data.defaultView }));
      }
      setLoading(false);
    });
  };

  React.useEffect(() => {
    load(state.date);
  }, [state.date]);

  useEffect(() => {
    initialLoad();
  }, []);

  if (loading) {
    return (
      <>
        <BaseHeaderLayout
          title={formatMessage({ id: getTrad('plugin.name') })}
          subtitle={formatMessage({ id: getTrad('plugin.tagline') })}
          as="h2"
        />
        <ContentLayout>
          <Flex justifyContent="center" alignItems="center" minHeight="75vh">
            <Loader>Loading...</Loader>
          </Flex>
        </ContentLayout>
      </>
    );
  }

  if (!settings) {
    return (
      <>
        <BaseHeaderLayout
          title={formatMessage({ id: getTrad('plugin.name') })}
          subtitle={formatMessage({ id: getTrad('plugin.tagline') })}
          as="h2"
        />
        <ContentLayout>
          <EmptyStateLayout
            icon={<Illo />}
            content={formatMessage({
              id: getTrad('view.calendar.state.empty.configure-settings.message'),
            })}
            action={
              <LinkButton variant="secondary" to="/settings/calendar" startIcon={<Cog />}>
                {formatMessage({
                  id: getTrad('view.calendar.state.empty.configure-settings.action'),
                })}
              </LinkButton>
            }
          />
        </ContentLayout>
      </>
    );
  }

  const { monthView, weekView, dayView } = settings;
  const multipleViews = (monthView && weekView) || (monthView && dayView) || (weekView && dayView);
  const primaryAction = settings.createButton ? (
    <LinkButton
      startIcon={<Plus />}
      to={`/content-manager/collectionType/${settings.collection}/create`}
    >
      {formatMessage(
        { id: getTrad('view.calendar.action.create-entry') },
        { collection: settings.collection.split('.')[1] }
      )}
    </LinkButton>
  ) : (
    <div />
  );

  const sty = `
    #schedule .Cell-highlightedText {
      color: ${settings.primaryColor} !important;
      border-color: ${settings.primaryColor} !important;
    }

    .Cell-today {
      background-color: ${settings.primaryColor} !important;
    }

    #schedule a,
    #schedule a > span {
      width: 100%;
      height: 100%;
    }
  `;

  return (
    <>
      <style>{sty}</style>
      <BaseHeaderLayout
        title={formatMessage({ id: getTrad('plugin.name') })}
        subtitle={formatMessage({ id: getTrad('plugin.tagline') })}
        as="h2"
        primaryAction={primaryAction}
      />
      <ContentLayout>
        <Box id="schedule" background="neutral0" shadow="filterShadow" padding={[5, 8]} hasRadius>
          <Flex justifyContent="space-between" marginBottom={10}>
            <Flex>
              <IconButton
                noBorder
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    date: moment(s.date).subtract(1, s.view.toLowerCase()).format('ll'),
                  }))
                }
                icon={<ChevronLeft />}
              />
              <Box paddingLeft={1} paddingRight={1}>
                <DatePicker
                  selectedDateLabel={() => {}}
                  name="date"
                  aria-label={formatMessage({
                    id: getTrad('view.calendar.action.select-date'),
                  })}
                  value={state.date}
                  onChange={(e) => setState((s) => ({ ...s, date: moment(e).format('ll') }))}
                />
              </Box>
              <IconButton
                noBorder
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    date: moment(s.date).add(1, s.view.toLowerCase()).format('ll'),
                  }))
                }
                icon={<ChevronRight />}
              />
              <Box>
                {settings.todayButton && (
                  <Button
                    variant="secondary"
                    size="L"
                    onClick={() => setState((s) => ({ ...s, date: moment().format('ll') }))}
                  >
                    {formatMessage({
                      id: getTrad('view.calendar.action.today'),
                    })}
                  </Button>
                )}
              </Box>
            </Flex>
            <Box width={220}>
              {multipleViews && (
                <Select
                  aria-label="Select View"
                  value={state.view}
                  onChange={(e) => setState((s) => ({ ...s, view: e }))}
                >
                  {settings.monthView && (
                    <Option value="Month">
                      {formatMessage({
                        id: getTrad('view.calendar.action.month'),
                      })}
                    </Option>
                  )}
                  {settings.weekView && (
                    <Option value="Week">
                      {formatMessage({
                        id: getTrad('view.calendar.action.week'),
                      })}
                    </Option>
                  )}
                  {settings.dayView && (
                    <Option value="Day">
                      {formatMessage({
                        id: getTrad('view.calendar.action.day'),
                      })}
                    </Option>
                  )}
                </Select>
              )}
            </Box>
          </Flex>
          <Box marginBottom={20}>
            {state.view === 'Month' && (
              <Typography variant="alpha" textTransform="uppercase" textAlign="center">
                {formatDate(state.date, { month: 'long' })}
              </Typography>
            )}
          </Box>
          <Scheduler
            data={data}
            locale={formatMessage({ id: getTrad('view.calendar.locale') })}
            firstDayOfWeek={
              formatMessage({
                id: getTrad('view.calendar.first-day-of-week'),
              }) || 0
            }
          >
            <ViewState
              onCurrentDateChange={load}
              currentDate={moment(state.date, 'll').format()}
              currentViewName={state.view}
            />
            <MonthView />
            <WeekView startDayHour={settings.startHour} endDayHour={settings.endHour} />
            <DayView startDayHour={settings.startHour} endDayHour={settings.endHour} />
            <Appointments appointmentComponent={Appointment} />
          </Scheduler>
        </Box>
      </ContentLayout>
    </>
  );
}

function Appointment({ children, style, ...restProps }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettings().then((r) => {
      if (r.data) {
        setSettings(r.data);
      }
    });
  }, []);

  const { id, color } = restProps.data;

  if (!settings) {
    return null;
  }

  return (
    <Link to={`/content-manager/collectionType/${settings.collection}/${id}`}>
      <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: validateColor(color) ? color : settings.eventColor,
          borderRadius: '4px',
        }}
      >
        {children}
      </Appointments.Appointment>
    </Link>
  );
}

Appointment.propTypes = {
  children: propTypes.node.isRequired,
  style: propTypes.object,
};

Appointment.defaultProps = {
  style: {},
};

export default memo(HomePage);
