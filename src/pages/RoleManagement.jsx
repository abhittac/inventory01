import {
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatSnakeCase } from "../utils/formatSnakeCase";

const roles = [
  { id: 1, name: "Super Admin", permissions: "Full Access" },
  { id: 2, name: "Sales Manager", permissions: "Sales Module Access" },
  {
    id: 3,
    name: "Production Manager",
    permissions: "Production Module Access",
  },
  { id: 4, name: "Delivery Manager", permissions: "Delivery Module Access" },
];

export default function RoleManagement() {
  return (
    <Card>
      <Typography variant="h5" sx={{ p: 2 }}>
        Role Management
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Permissions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  {Array.isArray(role.permissions)
                    ? role.permissions.map(formatSnakeCase).join(", ")
                    : formatSnakeCase(role.permissions || "N/A")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
