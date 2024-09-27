import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

import { CalendarPage } from './CalendarPage';
import { SettingsProvider } from '../context/Settings';

const App = () => {
  return (
    <SettingsProvider>
      <Routes>
        <Route index element={<CalendarPage />} />
        <Route path="*" element={<Page.Error />} />
      </Routes>
    </SettingsProvider>
  );
};

export { App };
