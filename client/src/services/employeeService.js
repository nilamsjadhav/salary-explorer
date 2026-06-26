import api from "./api";
import { buildUrl } from "../utils/buildUrl";

const employeeService = {
  getAll: (params = {}) => {
    return api.get(buildUrl("/api/employees", {
      search: params.search,
      department: params.department,
      currency: params.currency,
      minSalary: params.minSalary,
      maxSalary: params.maxSalary,
      fromDate: params.fromDate,
      toDate: params.toDate,
      page: params.page,
      pageSize: params.pageSize,
    }));
  },

  getDashboard: (params = {}) => {
    return api.get(buildUrl("/api/dashboard", { currency: params.currency }));
  },

  getDepartments: () => api.get("/api/dashboard/departments"),

  getSalaryDistribution: (params = {}) => {
    return api.get(buildUrl("/api/dashboard/salary-distribution", { currency: params.currency }));
  },

  getReports: (params = {}) => {
    return api.get(buildUrl("/api/dashboard/reports", { country: params.country }));
  },
};

export default employeeService;
