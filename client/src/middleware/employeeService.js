import api from "./api";

const employeeService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();

    if (params.search) query.set("search", params.search);
    if (params.department) query.set("department", params.department);
    if (params.minSalary) query.set("minSalary", params.minSalary);
    if (params.maxSalary) query.set("maxSalary", params.maxSalary);
    if (params.fromDate) query.set("fromDate", params.fromDate);
    if (params.toDate) query.set("toDate", params.toDate);
    if (params.page) query.set("page", params.page);
    if (params.pageSize) query.set("pageSize", params.pageSize);

    const queryString = query.toString();
    const endpoint = `/api/employees${queryString ? `?${queryString}` : ""}`;

    return api.get(endpoint);
  },
};

export default employeeService;
