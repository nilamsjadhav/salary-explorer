import { Box, TablePagination } from "@mui/material";

const Pagination = ({ page, pageSize, totalRecords, onPageChange, onPageSizeChange }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <TablePagination
        component="div"
        count={totalRecords}
        page={page - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          onPageSizeChange(parseInt(e.target.value, 10));
          onPageChange(1);
        }}
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
    </Box>
  );
};

export default Pagination;
