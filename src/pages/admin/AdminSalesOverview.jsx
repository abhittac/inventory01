import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Chip,
  TextField,
  IconButton,
  Box,
  MenuItem,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import OrderForm from "../../components/sales/orders/OrderForm";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";
import { Edit, Delete, Search } from "@mui/icons-material";
import { formatSnakeCase } from "../../utils/formatSnakeCase";
export default function AdminSalesOverview() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "all",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSales(filters);
      setOrders(response?.data || []);
    } catch (error) {
      toast.error("Error fetching sales data");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "", type: "all" });
  };

  const handleDelete = async (orderId) => {
    try {
      await adminService.deleteSalesOrder(orderId);
      toast.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Error deleting order");
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormOpen(false);
      await fetchOrders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminService.deleteSalesOrder(orderToDelete._id);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderToDelete._id)
      );
      toast.success("Order deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to delete order");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      cancelled: "info",
      completed: "success",
    };
    return colors[status] || "default";
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;
  const totalAmount = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  const filteredOrders = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <Search sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
          />
          <TextField
            select
            size="small"
            name="status"
            value={filters.type}
            onChange={handleFilterChange}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>

          <Button variant="outlined" onClick={handleResetFilters}>
            Reset
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Job Name</TableCell>
                <TableCell>Bag Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>No orders found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{formatSnakeCase(order.orderId)}</TableCell>
                    <TableCell>{formatSnakeCase(order.customerName)}</TableCell>
                    <TableCell>{formatSnakeCase(order.jobName)}</TableCell>
                    <TableCell>
                      {formatSnakeCase(order.bagDetails?.type)}
                    </TableCell>
                    <TableCell>{order.quantity ?? "0"}</TableCell>
                    <TableCell>
                      <Chip
                        label={formatSnakeCase(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(order)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setOrderToDelete(order);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <OrderForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          order={selectedOrder}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Order"
          content="Are you sure you want to delete this order? This action cannot be undone."
        />
      </Box>{" "}
    </Card>
  );
}
