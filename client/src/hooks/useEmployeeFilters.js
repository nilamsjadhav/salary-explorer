import { useState, useCallback } from "react";

const useEmployeeFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [currency, setCurrency] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleCurrencyChange = useCallback((value) => {
    setCurrency(value);
    setPage(1);
    if (value === "All") {
      setMinSalary("");
      setMaxSalary("");
    }
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handleFromDateChange = useCallback((value) => {
    setFromDate(value);
    setPage(1);
  }, []);

  const handleToDateChange = useCallback((value) => {
    setToDate(value);
    setPage(1);
  }, []);

  const handleMinSalaryChange = useCallback((value) => {
    setMinSalary(value);
    setPage(1);
  }, []);

  const handleMaxSalaryChange = useCallback((value) => {
    setMaxSalary(value);
    setPage(1);
  }, []);

  return {
    searchTerm,
    fromDate,
    toDate,
    minSalary,
    maxSalary,
    currency,
    page,
    pageSize,
    setPage,
    setPageSize,
    handleCurrencyChange,
    handleSearchChange,
    handleFromDateChange,
    handleToDateChange,
    handleMinSalaryChange,
    handleMaxSalaryChange,
  };
};

export default useEmployeeFilters;
