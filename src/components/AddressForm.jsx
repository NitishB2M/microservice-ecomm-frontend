import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, FormHelperText, Alert } from '@mui/material';
import { useAddress } from '../hooks/useAddress';
import { CircularProgress } from '@mui/material';

const AddressForm = ({ initialData = null, onSubmit, onCancel, onAddressCallback, initialShowAdrSuccessMsg = true }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    street: '',
    area: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    address_type: 'home',
    other_address_type: '',
    is_primary: false
  });
  const {
    addressLoading,
    addressError,
    addressSuccess,
    addAddress,
    updateAddress,
    setAddressError,
    setAddressSuccess,
    clearAddressMessages
  } = useAddress(); 

  useEffect(() => {
    console.log(initialData);
    clearAddressMessages(0,0);
    if (initialData) {
      setFormData(initialData);
    }
    if(!onAddressCallback){
      onAddressCallback = (bool) => {};
    }
    setTimeout(() => {
      initialShowAdrSuccessMsg = true;
    }, 3000);
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Name is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.phone_number)) newErrors.phone_number = 'Invalid phone number';
    if (!formData.street) newErrors.street = 'Street is required';
    if (!formData.area) newErrors.area = 'Area is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.postal_code) newErrors.postal_code = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!/^\d{6}$/.test(formData.postal_code)) newErrors.postal_code = 'Invalid postal code';
    if (!formData.address_type) newErrors.address_type = 'Address type is required and must be one of "home", "work", "other"';
    if (formData.is_primary && !formData.full_name) newErrors.full_name = 'Name is required';
    if (formData.address_type === 'other') {
      if (!formData.other_address_type) newErrors.other_address_type = 'Other address type is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAddressTypeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      return;
    }
    if (onSubmit) onSubmit(true);
    e.preventDefault();
    if (validateForm()) {
      let result;
      if (initialData) {
        result = await updateAddress(initialData.address_id, formData);
      } else {
        result = await addAddress(formData);
      }
      if (result.success) {
        setTimeout(() => {
          onAddressCallback(true);
        }, 1500);
      } else {
        setTimeout(() => {
          onAddressCallback(false);
        }, 1500);
      }
    } 
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <Grid container spacing={2}>
        {addressError && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setAddressError('')}>{addressError}</Alert>
          </Grid>
        )}
        {initialShowAdrSuccessMsg && addressSuccess && (
          <Grid item xs={12}>
            <Alert severity="success" onClose={() => setAddressSuccess('')}>{addressSuccess}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant="h6" className="text-gray-800 mb-4">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            error={!!errors.full_name}
            helperText={errors.full_name}
            className="bg-white"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            error={!!errors.phone_number}
            helperText={errors.phone_number}
            className="bg-white"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            error={!!errors.street}
            helperText={errors.street}
            className="bg-white"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            error={!!errors.area}
            helperText={errors.area}
            className="bg-white"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            className="bg-white"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            error={!!errors.state}
            helperText={errors.state}
            className="bg-white"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            error={!!errors.postal_code}
            helperText={errors.postal_code}
            className="bg-white"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            error={!!errors.country}
            helperText={errors.country}
            className="bg-white"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.address_type}>
            <InputLabel>Address Type</InputLabel>
            <Select
              label="Address Type"
              name="address_type"
              value={formData.address_type || 'home'}
              onChange={handleAddressTypeChange}
            >
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <FormHelperText>{errors.address_type}</FormHelperText>
          </FormControl>
        </Grid>

        {formData.address_type === 'other' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Other Address Type"
              name="other_address_type"
              value={formData.other_address_type}
              onChange={handleChange}
              helperText="Please specify the address type"
              className="bg-white"
            />
          </Grid>
        )}

        {/* Is Default Checkbox */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_primary}
                onChange={handleCheckboxChange}
                name="is_primary"
              />
            }
            label="Is Default"
          />
        </Grid>

        <Grid item xs={12} className="flex justify-end gap-4 mt-4">
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="outlined"
              color="error"
              className="text-error border-error"
              disabled={addressLoading}
            >
              {initialData ? 'Cancel' : 'Close'}
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            className="bg-primary text-white hover:bg-opacity-90"
            disabled={addressLoading}
          >
            {addressLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              initialData ? 'Update Address' : 'Add New Address'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressForm;
