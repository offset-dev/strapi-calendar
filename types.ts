// Admin Types
export type SettingsType = {
  collection: null | string;
  startField: null | string;
  endField: null | string;
  titleField: null | string;
  colorField: null | string;
  defaultDuration: number;
  drafts: boolean;
  startHour: string;
  endHour: string;
  defaultView: string;
  monthView: boolean;
  weekView: boolean;
  workWeekView: boolean;
  dayView: boolean;
  todayButton: boolean;
  createButton: boolean;
  primaryColor: string;
  eventColor: string;
};

export type SettingsContextType = {
  settings: SettingsType;
  updateField: (setting: Partial<SettingsType>) => void;
  saveSettings: () => Promise<void>;
  loading: boolean;
  saving: boolean;
};

// Server Types
export type ExtensionType = {
  id: string;
  name: string;
  startFields: string[];
  endFields: string[];
  startHandler?: Function;
  endHandler?: Function;
};

export type ExtensionsMapType = Record<
  string,
  {
    name: string;
    startFields: string[];
    endFields: string[];
    startHandler?: Function;
    endHandler?: Function;
  }
>;
