import api from '../api/axios';

export const dashboardService = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getMemberDashboard: () => api.get('/dashboard/member'),
};
