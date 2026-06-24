import api from "./api";

const employeeService = {
  getAll: () => api.get("/api/employees"),
};

export default employeeService;
