import axiosInstance from './utils/axiosInstance';

const taskRequests = {
  getData: async (date) => {
    const data = await axiosInstance.get(`/calendar`, {
      params: {
        date,
      },
    });

    return data;
  },
  getCollections: async () => {
    const data = await axiosInstance.get(`/calendar/settings/collections`);

    return data;
  },
  getRelevantPlugins: async () => {
    const data = await axiosInstance.get(`/calendar/plugins`);

    return data;
  },
  getSettings: async () => {
    const data = await axiosInstance.get(`/calendar/settings`);

    return data;
  },
  setSettings: async (data) => {
    return axiosInstance.post(`/calendar/settings`, data);
  },
};
export default taskRequests;
