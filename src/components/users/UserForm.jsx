import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { registrationTypes } from "../../constants/userTypes";
import {
  productionManagerBagTypes,
  operatorTypesByBag,
} from "../../constants/productionTypes";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const initialFormData = {
  fullName: "",
  email: "",
  mobileNumber: "",
  password: "",
  confirmPassword: "",
  registrationType: "",
  bagType: "",
  operatorType: "",
  status: "active", // Default status
};

export default function UserForm({ open, onClose, onSubmit, user = null }) {
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      console.log("Fetched user data:", user.data.fullName); // Debug the response
      const mappedData = {
        fullName: user.data.fullName || "",
        email: user.data.email || "",
        mobileNumber: user.data.mobileNumber || "",
        password: "",
        confirmPassword: "",
        registrationType: user.data.registrationType || "",
        bagType: user.data.bagType || "",
        operatorType: user.data.operatorType || "",
        status: user.data.status || "active", // Default to active if not provided
      };
      setFormData(mappedData);
    } else {
      setFormData(initialFormData);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "registrationType") {
        newData.bagType = ""; // Clear dependent fields
        newData.operatorType = "";
      }

      if (name === "bagType") {
        newData.operatorType = ""; // Clear dependent fields
      }

      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const dataToSubmit = { ...formData };
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
      delete dataToSubmit.confirmPassword;
    }

    onSubmit(dataToSubmit);
  };

  const showBagTypeField = formData.registrationType === "production";
  const showOperatorTypeField = showBagTypeField && formData.bagType;
  const operatorOptions = formData.bagType
    ? operatorTypesByBag[formData.bagType]
    : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            {!user && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Registration Type</InputLabel>
                <Select
                  label="Registration Type"
                  name="registrationType"
                  value={formData.registrationType}
                  onChange={handleChange}
                  required
                >
                  {registrationTypes.map((type, index) => (
                    <MenuItem key={index} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {showBagTypeField && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Bag Making Type</InputLabel>
                  <Select
                    label="Bag Making Type"
                    name="bagType"
                    value={formData.bagType}
                    onChange={handleChange}
                    required
                  >
                    {productionManagerBagTypes.map((type, index) => (
                      <MenuItem key={index} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {showOperatorTypeField && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Operator Type</InputLabel>
                  <Select
                    label="Operator Type"
                    name="operatorType"
                    value={formData.operatorType}
                    onChange={handleChange}
                    required
                  >
                    {operatorOptions.map((type, index) => (
                      <MenuItem key={index} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {user && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status </InputLabel>
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {user ? "Update" : "Add"} User
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
