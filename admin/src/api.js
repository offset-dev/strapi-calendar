import axiosInstance from '../src/utils/axiosInstance';

const taskRequests = {
  getData: async (date) => {
    const data = await axiosInstance.get(`/calendar`, {
      params: {
        date
      }
    });
    return data;
  },
  getCollections: async () => {
    const data = await axiosInstance.get(`/calendar/settings/collections`);
    return data;
  },
  getSettings: async () => {
    const data = await axiosInstance.get(`/calendar/settings`);
    return data;
  },
  setSettings: async data => {
    return await axiosInstance.post(`/calendar/settings`, {
      body: data,
    });
  },
};
export default taskRequests;
