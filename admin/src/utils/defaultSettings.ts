import { SettingsType } from '../../../types';

const defaultSettings: SettingsType = {
  collection: null,
  startField: null,
  endField: null,
  titleField: null,
  colorField: null,
  defaultDuration: 30,
  drafts: true,
  startHour: '0:00',
  endHour: '23:59',
  defaultView: 'Month',
  monthView: true,
  weekView: true,
  workWeekView: true,
  dayView: true,
  todayButton: true,
  createButton: true,
  primaryColor: '#4945ff',
  eventColor: '#4945ff',
};

export default defaultSettings;
