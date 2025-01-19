import { useState } from 'react';
import {
  Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  Grid, FormControlLabel, Switch, MenuItem,
  IconButton, Card, Alert, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import { useProfile } from '../hooks/useProfile';
import {Cancel} from "@mui/icons-material";

const ADDRESS_TYPES = ['home', 'work', 'other'];

const getAddressIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'home':
      return <HomeIcon className="text-primary" />;
    case 'work':
      return <BusinessIcon className="text-primary" />;
    default:
      return <OtherHousesIcon className="text-primary" />;
  }
};

const AddressManager = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    area: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_primary: false,
    address_type: 'home'
  });
  const { addressError, addressMessage, loading, clearMessages, addresses, addAddress, updateAddress, deleteAddress } = useProfile();

  const handleAddressChange = (field) => (event) => {
    const value = field === 'is_primary' ? event.target.checked : event.target.value;
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressDialog = (address = null) => {
    if (address) {
      setSelectedAddress(address);
      setAddressForm({
        street: address.street || '',
        area: address.area || '',
        city: address.city || '',
        state: address.state || '',
        postal_code: address.postal_code || '',
        country: address.country || '',
        is_primary: address.is_primary || false,
        address_type: address.address_type || 'home'
      });
    } else {
      setSelectedAddress(null);
      setAddressForm({
        street: '',
        area: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        is_primary: false,
        address_type: 'home'
      });
    }
    setShowDialog((prev) => !prev);
  };

  const handleSaveAddress = async () => {
    if (selectedAddress) {
      const result =  await updateAddress(selectedAddress.address_id, addressForm);
      if (result.success) {
        setTimeout(() => {
          clearMessages(0);
          setShowDialog(false);
        }, 1000);
      } else {
        setTimeout(() => {
          clearMessages(1);
        }, 1000);
      }
    } else {
      const result = await addAddress(addressForm);
      if (result.success) {
        setTimeout(() => {
          clearMessages(0);
          setShowDialog(false);
        }, 1000);
      } else {
        setTimeout(() => {
          clearMessages(1);
        }, 1000);
      }
    }
  };

  const handleDeleteAddress = async (addressId) => {
    await deleteAddress(addressId);
    setTimeout(() => {
      clearMessages(0);
      setShowDialog(false);
    }, 1000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="text-primary font-bold">
          My Addresses
        </Typography>
        {showDialog ?
          <Button
            variant="contained"
            startIcon={<Cancel />}
            onClick={() => handleAddressDialog(selectedAddress)}
            className="bg-primary hover:bg-primary-dark text-white"
            color="error"
          >
            Cancel
          </Button>
          :
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAddressDialog()}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            Add New Address
          </Button>
        }
      </div>

      <Grid container spacing={3}>
        {addresses.map((address) => (
          <Grid item xs={12} sm={6} key={address.id}>
            <Card className="p-4 bg-white bg-opacity-80 backdrop-blur-sm hover:shadow-lg transition-all">
              <div className="flex justify-between">
                <div className="flex items-start gap-3">
                  {getAddressIcon(address.address_type)}
                  <div>
                    <Typography variant="subtitle1" className="font-bold capitalize flex items-center gap-2">
                      {address.address_type}
                      {address.is_primary && (
                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                    </Typography>
                    <Typography variant="body2" className="mt-1">
                      {address.street}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {address.area}, {address.city}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {address.state}, {address.postal_code}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {address.country}
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <IconButton
                    size="small"
                    onClick={() => handleAddressDialog(address)}
                    className="text-primary hover:bg-primary hover:text-white"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      {showDialog &&
      <Box className="bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-md mt-6">
        <Typography variant="h6" className="text-primary mb-4">
          {selectedAddress ? 'Edit Address' : 'Add New Address'}
        </Typography>

        {/* Error and Success Messages */}
        {addressError && (
          <Alert severity="error" className="mb-4">
            {addressError}
          </Alert>
        )}
        {addressMessage && (
          <Alert severity="success" className="mb-4">
            {addressMessage}
          </Alert>
        )}

        {/* Address Form */}
        <Grid container spacing={2} className="pt-2">
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Address Type"
              value={addressForm.address_type}
              onChange={handleAddressChange('address_type')}
            >
              {ADDRESS_TYPES.map((type) => (
                <MenuItem key={type} value={type} className="capitalize">
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              value={addressForm.street}
              onChange={handleAddressChange('street')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Area/Locality"
              value={addressForm.area}
              onChange={handleAddressChange('area')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={addressForm.city}
              onChange={handleAddressChange('city')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              value={addressForm.state}
              onChange={handleAddressChange('state')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              value={addressForm.postal_code}
              onChange={handleAddressChange('postal_code')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              value={addressForm.country}
              onChange={handleAddressChange('country')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={addressForm.is_primary}
                  onChange={handleAddressChange('is_primary')}
                  color="primary"
                />
              }
              label="Set as Primary Address"
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box className="mt-4 flex justify-end gap-4">
          <Button
            onClick={() => setShowDialog(false)}
            className="text-gray-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAddress}
            variant="contained"
            className="bg-primary hover:bg-primary-dark text-white"
          >
            Save Address
          </Button>
        </Box>
      </Box>
      }

      {/*<Dialog*/}
      {/*  open={showDialog}*/}
      {/*  onClose={() => setShowDialog(false)}*/}
      {/*  maxWidth="sm"*/}
      {/*  fullWidth*/}
      {/*  PaperProps={{*/}
      {/*    className: "bg-white bg-opacity-90 backdrop-blur-md"*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <DialogTitle className="text-primary">*/}
      {/*    {selectedAddress ? 'Edit Address' : 'Add New Address'}*/}
      {/*  </DialogTitle>*/}
      {/*  <DialogContent>*/}
      {/*    {addressError && (*/}
      {/*      <Alert severity="error" className="mb-4">*/}
      {/*        {addressError}*/}
      {/*      </Alert>*/}
      {/*    )}*/}
      {/*    {addressMessage && (*/}
      {/*      <Alert severity="success" className="mb-4">*/}
      {/*        {addressMessage}*/}
      {/*      </Alert>*/}
      {/*    )}*/}
      {/*    <Grid container spacing={2} className="pt-2">*/}
      {/*      <Grid item xs={12}>*/}
      {/*        <TextField*/}
      {/*          select*/}
      {/*          fullWidth*/}
      {/*          label="Address Type"*/}
      {/*          value={addressForm.address_type}*/}
      {/*          onChange={handleAddressChange('address_type')}*/}
      {/*        >*/}
      {/*          {ADDRESS_TYPES.map((type) => (*/}
      {/*            <MenuItem key={type} value={type} className="capitalize">*/}
      {/*              {type}*/}
      {/*            </MenuItem>*/}
      {/*          ))}*/}
      {/*        </TextField>*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12}>*/}
      {/*        <TextField*/}
      {/*          fullWidth*/}
      {/*          label="Street Address"*/}
      {/*          value={addressForm.street}*/}
      {/*          onChange={handleAddressChange('street')}*/}
      {/*        />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12}>*/}
      {/*        <TextField*/}
      {/*          fullWidth*/}
      {/*          label="Area/Locality"*/}
      {/*          value={addressForm.area}*/}
      {/*          onChange={handleAddressChange('area')}*/}
      {/*        />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12} sm={6}>*/}
      {/*        <TextField*/}
      {/*          fullWidth*/}
      {/*          label="City"*/}
      {/*          value={addressForm.city}*/}
      {/*          onChange={handleAddressChange('city')}*/}
      {/*        />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12} sm={6}>*/}
      {/*        <TextField*/}
      {/*          fullWidth*/}
      {/*          label="State"*/}
      {/*          value={addressForm.state}*/}
      {/*          onChange={handleAddressChange('state')}*/}
      {/*        />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12} sm={6}>*/}
      {/*        <TextField*/}
      {/*          fullWidth*/}
      {/*          label="Postal Code"*/}
      {/*          value={addressForm.postal_code}*/}
      {/*          onChange={handleAddressChange('postal_code')}*/}
      {/*        />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12} sm={6}>*/}
      {/*        <TextField*/}
      {/*          fullWidth*/}
      {/*          label="Country"*/}
      {/*          value={addressForm.country}*/}
      {/*          onChange={handleAddressChange('country')}*/}
      {/*        />*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12}>*/}
      {/*        <FormControlLabel*/}
      {/*          control={*/}
      {/*            <Switch*/}
      {/*              checked={addressForm.is_primary}*/}
      {/*              onChange={handleAddressChange('is_primary')}*/}
      {/*              color="primary"*/}
      {/*            />*/}
      {/*          }*/}
      {/*          label="Set as Primary Address"*/}
      {/*        />*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </DialogContent>*/}
      {/*  <DialogActions>*/}
      {/*    <Button*/}
      {/*      onClick={() => setShowDialog(false)}*/}
      {/*      className="text-gray-500"*/}
      {/*    >*/}
      {/*      Cancel*/}
      {/*    </Button>*/}
      {/*    <Button*/}
      {/*      onClick={handleSaveAddress}*/}
      {/*      variant="contained"*/}
      {/*      className="bg-primary hover:bg-primary-dark text-white"*/}
      {/*    >*/}
      {/*      Save Address*/}
      {/*    </Button>*/}
      {/*  </DialogActions>*/}
      {/*</Dialog>*/}
    </div>
  );
};

export default AddressManager;
