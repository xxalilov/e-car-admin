import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Table2(props) {
  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none", overflowX: "auto" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {props.headers &&
              props.headers.map((head) => (
                <TableCell
                  key={head}
                  align="left"
                  style={{ color: "rgb(69,85,96)", fontWeight: "700" }}
                >
                  {head}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>{props.children}</TableBody>
      </Table>
    </TableContainer>
  );
}
