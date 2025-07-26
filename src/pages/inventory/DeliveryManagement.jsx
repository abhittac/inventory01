import { useState, useEffect } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  TablePagination,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import deliveryService from "../../services/deliveryService";
import { formatSnakeCase } from "../../utils/formatSnakeCase";
import { Edit } from "@mui/icons-material";

export default function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState({
    vehicleNo: "",
    driverName: "",
    driverContact: "",
    deliveryDate: "",
    status: "", // Added status field
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch deliveries from API
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await deliveryService.getDeliveries(); // API call to fetch deliveries
      console.log(response.data);
      setDeliveries(response.data || []);
    } catch (error) {
      toast.error("Error fetching deliveries: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries(); // Fetch deliveries on component mount
  }, []);

  const handleEdit = (delivery) => {
    if (!delivery) return;
    setSelectedDelivery(delivery); // Store the selected delivery
    setDeliveryDetails({
      _id: delivery._id || "", // Ensure the _id is stored in the state
      vehicleNo: delivery.vehicleNo || "",
      driverName: delivery.driverName || "",
      driverContact: delivery.driverContact || "",
      deliveryDate: delivery.deliveryDate || "",
      status: delivery.status || "", // Ensure the status is also set
    });
  };

  // Apply filters
  const filteredOrders = deliveries
    .filter((delivery) => {
      const customerName = delivery?.orderDetails?.customerName || "";
      const jobName = delivery?.orderDetails?.jobName || "";
      const mobileNumber = delivery?.orderDetails?.mobileNumber || "";
      const agent = delivery?.orderDetails?.agent || "";
      const orderId = delivery?.orderId?.toString() || "";
      return (
        customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orderId.includes(searchQuery) ||
        mobileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .filter((delivery) =>
      statusFilter ? delivery.status === statusFilter : true
    );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Add basic form validation here
    const { vehicleNo, driverName, driverContact, deliveryDate, status } =
      deliveryDetails;
    if (
      !vehicleNo ||
      !driverName ||
      !driverContact ||
      !deliveryDate ||
      !status
    ) {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { _id, ...updatedDetails } = deliveryDetails; // Destructure '_id' from the state

      console.log("Updated data without ID:", updatedDetails); // Log the updated details without the '_id'

      // Now pass the ID separately and exclude it from the payload
      await deliveryService.updateDelivery(_id, updatedDetails); // Pass _id as a URL parameter or as part of the request

      toast.success("Delivery details updated successfully");
      setSelectedDelivery(null);
      fetchDeliveries(); // Refetch deliveries after update
    } catch (error) {
      console.log("errors", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to updated";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Card>
        <Box sx={{ p: 3 }}>
          <div className="flex justify-between items-center p-4">
            <Typography variant="h6">Delivery Management</Typography>
            <div className="flex gap-3">
              {/* Search Box */}
              <TextField
                label="Search Orders"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                size="small"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_transit">In Transit</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </div>
          </div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: "150px",
                    }}
                  >
                    Order ID
                  </TableCell>
                  <TableCell>Agent Name</TableCell>
                  <TableCell
                    sx={{
                      width: "150px",
                    }}
                  >
                    Customer Name
                  </TableCell>
                  <TableCell>Job Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Mobile No.</TableCell>
                  <TableCell
                    sx={{
                      width: "150px",
                    }}
                  >
                    Delivery Date
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell sx={{ width: "50px" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((delivery) => (
                    <TableRow key={delivery._id}>
                      <TableCell>{formatSnakeCase(delivery.orderId)}</TableCell>
                      <TableCell>
                        {formatSnakeCase(delivery.orderDetails?.agent)}
                      </TableCell>
                      <TableCell>
                        {formatSnakeCase(delivery.orderDetails?.customerName)}
                      </TableCell>
                      <TableCell>
                        {formatSnakeCase(delivery.orderDetails?.jobName)}
                      </TableCell>
                      <TableCell>
                        {formatSnakeCase(delivery.orderDetails?.address)}
                      </TableCell>
                      <TableCell>
                        {formatSnakeCase(delivery.orderDetails?.mobileNumber)}
                      </TableCell>
                      <TableCell>
                        {delivery.deliveryDate
                          ? new Date(delivery.deliveryDate)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatSnakeCase(delivery.status || "unknown")}
                          color={
                            delivery.status === "delivered"
                              ? "success"
                              : delivery.status === "pending"
                              ? "warning"
                              : delivery.status === "in_transit"
                              ? "info"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          disabled={delivery.status === "delivered"}
                          onClick={() => handleEdit(delivery)}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      <Dialog
        open={!!selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
        aria-labelledby="update-delivery-dialog-title"
      >
        <DialogTitle id="update-delivery-dialog-title">
          Update Delivery Details
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Vehicle Number"
                name="vehicleNo"
                value={deliveryDetails.vehicleNo}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Driver Name"
                name="driverName"
                value={deliveryDetails.driverName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Driver Contact"
                name="driverContact"
                value={deliveryDetails.driverContact}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Delivery Date"
                name="deliveryDate"
                type="date"
                value={
                  deliveryDetails.deliveryDate
                    ? new Date(deliveryDetails.deliveryDate)
                        .toISOString()
                        .split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split("T")[0], // allow today and future
                }}
              />
            </Grid>

            {/* Status Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={deliveryDetails.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_transit">In Transit</MenuItem>
                  {/* <MenuItem value="delivered">Delivered</MenuItem> */}
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button onClick={() => setSelectedDelivery(null)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
