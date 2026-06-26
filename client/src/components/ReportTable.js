import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { headerRowSx, headerCellSx } from "../constants/tableStyles";

const ReportTable = ({ title, columns, rows, emptyMessage = "No data available" }) => (
  <>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
      {title}
    </Typography>
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow sx={headerRowSx}>
            {columns.map((col) => (
              <TableCell key={col.key} sx={headerCellSx} align={col.align || "left"}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <TableRow key={row.key || i}>
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align || "left"}>
                    {col.render ? col.render(row, i) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default ReportTable;
