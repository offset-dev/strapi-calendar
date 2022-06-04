/*
 *
 * HomePage
 *
 */

import React, {memo, useState, useEffect} from "react";
import propTypes from "prop-types";

import {EmptyStateLayout} from "@strapi/design-system/EmptyStateLayout";
import {BaseHeaderLayout, ContentLayout} from "@strapi/design-system/Layout";
import {LinkButton} from "@strapi/design-system/LinkButton";
import {Box} from "@strapi/design-system/Box";
import {Loader} from "@strapi/design-system/Loader";
import {Link} from "@strapi/design-system/Link";
import {Icon} from "@strapi/design-system/Icon";
import {Typography} from "@strapi/design-system/Typography";
import {Flex} from "@strapi/design-system/Flex";
import {Button} from "@strapi/design-system/Button";
import {DatePicker} from "@strapi/design-system/DatePicker";
import {Select, Option} from "@strapi/design-system/Select";
import Calendar from "@strapi/icons/Calendar";
import {IconButton} from "@strapi/design-system/IconButton";
import {Cog, Plus, ChevronLeft, ChevronRight} from "@strapi/icons";
import moment from "moment";

import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";
import {ViewState} from "@devexpress/dx-react-scheduler";
import api from "../api";

function HomePage() {
  const [state, setState] = useState({
    date: moment().format("ll"),
    view: "Month",
  });
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [data, setData] = useState([]);

  const load = date => {
    setLoading(true);
    api.getData(date).then(r => {
      setData(r.data);
      setLoading(false);
    });
  };

  const initialLoad = () => {
    api.getData().then(r => {
      setData(r.data);
    });
    api.getSettings().then(r => {
      if (r.data) {
        setSettings(r.data);
        setState(s => ({...s, view: r.data.defaultView}));
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    initialLoad();
  }, []);

  if (loading) {
    return <>
      <BaseHeaderLayout title="Calendar" subtitle="Visualize your events" as="h2"/>
      <ContentLayout>
        <Box style={{
          display: "flex",
          minHeight: "75vh",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Loader>Loading...</Loader>
        </Box>
      </ContentLayout>
    </>;
  }

  if (!settings) {
    return <>
      <BaseHeaderLayout title="Calendar" subtitle="Visualize your events" as="h2"/>
      <ContentLayout>
        <EmptyStateLayout icon={<Icon color="primary700" width={30} height={30} as={Calendar}/>} content="Please configure the settings before accessing the calendar" action={
          <LinkButton variant="secondary" to="/settings/calendar" startIcon={<Cog/>}>
            Settings
          </LinkButton>
        }/>
      </ContentLayout>
    </>;
  }

  const {monthView, weekView, dayView} = settings;
  const multipleViews = monthView && weekView || monthView && dayView || weekView && dayView;
  const primaryAction = settings.createButton ? <LinkButton startIcon={<Plus />} to={`/content-manager/collectionType/${settings.collection}/create`}>Create an entry</LinkButton> : <div/>;

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
  `

return (
    <>
      <style>{sty}</style>
      <BaseHeaderLayout title="Calendar" subtitle="Visualize your events" as="h2" primaryAction={primaryAction} />
      <ContentLayout>
        {data.length === 0 && (
          <EmptyStateLayout icon={<Icon color="primary700" width={30} height={30} as={Calendar}/>} content={"There are no events loaded. \n\n Did you properly configure the plugin?"} action={
            <LinkButton variant="secondary" to="/settings/calendar" startIcon={<Cog/>}>
              Review Settings
            </LinkButton>
          }/>
        )}

        {data.length > 0 &&
          <Box id="schedule" background="neutral0" shadow="filterShadow" padding={[5, 8]} hasRadius>
            <Flex justifyContent="space-between" style={{marginBottom: 10}}>
              <Flex>
                <IconButton noBorder onClick={() => setState(s => ({...s, date: moment(s.date).subtract(1, s.view.toLowerCase()).format("ll")}))} icon={<ChevronLeft />} />
                <DatePicker selectedDateLabel={() => {
                }} name="date" aria-label="Select Date" value={state.date} onChange={e => setState(s => ({...s, date: moment(e).format("ll")}))}/>
                <IconButton noBorder onClick={() => setState(s => ({...s, date: moment(s.date).add(1, s.view.toLowerCase()).format("ll")}))} icon={<ChevronRight />} />
                <Box>
                  {settings.todayButton &&
                    <Button variant="secondary" size="L" onClick={() => setState(s => ({...s, date: moment().format("ll")}))}>Today</Button>
                  }
                </Box>
              </Flex>
              <Box style={{width: 220}}>
                {multipleViews &&
                  <Select aria-label="Select View" value={state.view} onChange={e => setState(s => ({...s, view: e}))}>
                    {settings.monthView && <Option value="Month">Month</Option>}
                    {settings.weekView && <Option value="Week">Week</Option>}
                    {settings.dayView && <Option value="Day">Day</Option>}
                  </Select>
                }
              </Box>
            </Flex>
            <Box style={{textAlign: "center", marginBottom: 20}}>
              {state.view === "Month" &&
                <Typography variant="alpha" textTransform="uppercase" style={{textAlign: "center"}}>{moment(state.date, "ll").format("MMMM")}</Typography>
              }
            </Box>
            <Scheduler data={data}>
              <ViewState onCurrentDateChange={load} currentDate={moment(state.date, "ll").format()} currentViewName={state.view}/>
              <MonthView/>
              <WeekView startDayHour={settings.startHour} endDayHour={settings.endHour}/>
              <DayView startDayHour={settings.startHour} endDayHour={settings.endHour}/>
              <Appointments appointmentComponent={Appointment} />
            </Scheduler>
          </Box>
        }
      </ContentLayout>
    </>
  );
}

function Appointment({children, style, ...restProps}) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettings().then(r => {
      if (r.data) {
        setSettings(r.data);
      }
    });
  }, []);

  const {id} = restProps.data;

  if (!settings) return null;

  return <Link to={`/content-manager/collectionType/${settings.collection}/${id}`}>
    <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: settings.eventColor,
          borderRadius: "8px",
        }}
    >
      {children}
    </Appointments.Appointment>
  </Link>;
}

Appointment.propTypes = {
  children: propTypes.node.isRequired,
  style: propTypes.object,
}

Appointment.defaultProps = {
  style: {}
}

export default memo(HomePage);
