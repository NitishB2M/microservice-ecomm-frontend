import React from 'react';
import { Card, Typography, Button, IconButton, Grid, TextField, Alert, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useAddress } from '../hooks/useAddress';
import { capitalizeFirstLetter } from '../commons/stringManipulation';
import { AddressListSkeleton } from './skeletons/AddressSkeleton';
import { useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import AddressForm from './AddressForm';

const AddressList = () => {
  const { addresses, addressLoading, setDefaultAddress, addressError, addressSuccess, clearAddressMessages, fetchAddresses } = useAddress();
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);

  if (addressLoading) {
    return <AddressListSkeleton />;
  }

  if (addresses.length === 0) {
    return <div>No addresses found.</div>;
  }

  const selectable = false;
  const selectedId = null;
  const onSelect = null;

  const handleAddressCallback = async (v) => {
    if (!v) { 
      setIsAddressFormOpen(false);
      return;
    }
    setIsAddressFormOpen(false);
    try {
      await fetchAddresses();
    } catch (error) {
      console.error('Error clearing address error:', error);
    }
  }

  const handleEdit = (address) => {
    // Handle edit logic here
    setIsAddressFormOpen(true);
    setInitialData(address);
  };

  const handleSetDefault =async (address) => {
    if (address.is_primary) return;
    await setDefaultAddress(address.address_id);
    setTimeout(() => {
      clearAddressMessages(3,3);
    }, 1000);
  };

  const handleDelete = () => {
    // Handle delete logic here
  };


  if (selectable) {
    return (
      <div className="space-y-4">
        {addresses.map((address) => (
          <Card 
            key={address.address_id}
            className={`p-4 relative hover:shadow-md transition-shadow ${
              address.is_primary ? 'border-2 border-primary' : ''
            }`}
            onClick={() => onSelect && onSelect(address.address_id)}
          >
            {/* Default Badge */}
            {address.is_primary && (
              <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">
                Default
              </div>
            )}

            {/* Selection Radio Button (for checkout) */}
            <div className="absolute top-4 right-4">
              {selectedId === address.address_id ? (
                <CheckCircleIcon className="text-primary" />
              ) : (
                <RadioButtonUncheckedIcon className="text-gray-400" />
              )}
            </div>

            <div className="space-y-2">
              <Typography variant="h6" className="text-gray-800">
                {address?.street}, {address?.area},
              </Typography>
              
              <Typography variant="body1" className="text-gray-600">
                {address?.phone_number}
              </Typography>
              
              <Typography variant="body1" className="text-gray-600">
                {address?.address_line1}
                {address?.address_line2 && `, ${address?.address_line2}`}
              </Typography>
              
              <Typography variant="body1" className="text-gray-600">
                {address?.city}, {address?.state}, {address?.postal_code}
              </Typography>
            </div>
          </Card>
        ))}        
      </div>      
    );
  }

  return (
    <div className="space-y-4 px-4 !py-2">
      {addressSuccess && <Alert severity="success">{addressSuccess}</Alert>}
      {addressError && <Alert severity="error">{addressError}</Alert>}
      <Grid container spacing={3}>
      {addresses.map((address) => (
        <Grid item xs={12} className={`hover:shadow-md transition-shadow border-l-4 bg-green ${address.is_primary ? 'border-green bg-opacity-20' : 'border-green border-opacity-20 bg-l-border bg-opacity-10'} !m-4 !mb-2 relative !py-2 rounded-tl rounded-bl `} key={address.address_id}>
          <div className="flex items-center justify-between py-2 pr-4">
            <Typography variant="h6" className="text-gray-800 font-semibold text-light-brd-green dark:text-white">
              {capitalizeFirstLetter(address.address_type)}
            </Typography>
            {/* Default Badge */}
            {address.is_primary && (
              <div className="border border-green text-green px-2 py-1 rounded text-sm">
                Default
              </div>
            )}
          </div>
          <Divider className='dark:border-gray-600'/>
          <div 
            className={`p-1 flex items-center justify-between pb-4 dark:text-white`}
            onClick={() => selectable && onSelect && onSelect(address.address_id)}
          >
            {/* Selection Radio Button (for checkout) */}
            {selectable && (
              <div className="absolute top-4 right-4">
                {selectedId === address.address_id ? (
                  <CheckCircleIcon className="text-primary" />
                ) : (
                  <RadioButtonUncheckedIcon className="text-gray-400" />
                )}
              </div>
            )}

            <div className="flex flex-col w-[35%]">
              <div className="flex items-center gap-4 justify-between">
                <Typography variant="h6" className="text-light-text-primary dark:text-white">
                  Street:
                </Typography>
                <Typography variant="body1" className="text-light-text-secondary dark:text-gray-400">
                  {address.street}, {address.area}
                </Typography>
              </div>
              <Divider className='dark:border-gray-600'/>
              <div className="flex items-center gap-4 justify-between">
                <Typography variant="h6" className="text-light-text-primary dark:text-white">
                  City:
                </Typography>
                <Typography variant="body1" className="text-light-text-secondary dark:text-gray-400">
                  {address.city}, {address.postal_code}
                </Typography>
              </div>
              <Divider className='dark:border-gray-600'/>
              <div className="flex items-center gap-4 justify-between">
                <Typography variant="h6" className="text-light-text-primary dark:text-white">
                  State:
                </Typography>
                <Typography variant="body1" className="text-light-text-secondary dark:text-gray-400">
                  {address.state}, {address.country}
                </Typography>
              </div>
              <Divider className='dark:border-gray-600'/>
              <div className="flex items-center gap-4 justify-between">
                <Typography variant="h6" className="text-light-text-primary dark:text-white">
                  Phone:
                </Typography>
                <Typography variant="body1" className="text-light-text-secondary dark:text-gray-400">
                  {address?.phone_number}
                </Typography>
              </div>
              <Divider className='dark:border-gray-600'/>
            </div>
              <div className="flex items-center gap-4 justify-between">

              {!selectable && (
                <div className="flex items-end justify-end flex-col gap-2 mt-4 mr-4">
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleEdit(address)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>

                  {!address.is_primary && (
                    <Button
                      variant="contained"
                      size="small"
                      color="info"
                      onClick={() => handleSetDefault(address)}
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Grid>
      ))}

      <Dialog 
        open={isAddressFormOpen} 
        onClose={() => setIsAddressFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <AddressForm
            initialData={initialData}
            onCancel={() => setIsAddressFormOpen(false)}
            onAddressCallback={handleAddressCallback}
          />
        </DialogContent>
      </Dialog>
      </Grid>
    </div>
  );
};

export default AddressList;
