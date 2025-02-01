import React, { useState } from 'react';
import {
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogContent,
  Chip,
  Avatar
} from '@mui/material';
import { Button } from "keep-react";
import { UserSwitch } from 'phosphor-react';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import UndoIcon from '@mui/icons-material/Undo';
import CancelIcon from '@mui/icons-material/Cancel';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import { useAddress } from '../hooks/useAddress';
import { useAuth } from '../context/AuthContext';
import AddressForm from '../components/AddressForm';
import AddressList from '../components/AddressList';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton';
import ProfileEditSectionSkeleton from '../components/skeletons/ProfileEditSectionSkeleton';
import {AddressListSkeleton} from '../components/skeletons/AddressSkeleton';

const Profile = () => {
  const { 
    user: profile, 
    loading, 
    profileLoading,
    fetchProfile,
    profileError,
    sendVerificationEmail,
    deactivateAccount,
    logout,
    switchRole
  } = useAuth();

  const { 
    addresses, 
    addressLoading, 
    addressError,
    fetchAddresses,
    clearAddressMessages,
    clearAddressError
  } = useAddress();
  const [activeSection, setActiveSection] = useState('profile');
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isEmailLinkAvailable, setIsEmailLinkAvailable] = useState("");

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <PersonIcon /> },
    { id: 'addresses', label: 'Address Book', icon: <LocationOnIcon /> },
    { id: 'payment', label: 'My Payment Options', icon: <PaymentIcon /> },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBagIcon /> },
    { id: 'returns', label: 'My Returns', icon: <UndoIcon /> },
    { id: 'cancellations', label: 'My Cancellations', icon: <CancelIcon /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <FavoriteIcon /> },
  ];
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleProfileUpdate = async () => {
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleVerifyEmail = async (email) => {
    try {
      const result = await sendVerificationEmail(email);
      if (result.success) {
        setIsEmailLinkAvailable(result.data);
      }
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  };

  const handleEmailVerification = async () => {
    setTimeout(() => {
      setIsEmailLinkAvailable('');
      fetchProfile();
    }, 5000);
  };

  const handleSwitchRole = async (username) => {
    try {
      console.log(username);
      await switchRole(username);
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  const renderProfileForm = () => (
    <>
    {profileLoading ? 
      <ProfileEditSectionSkeleton />
    :
      <ProfileForm onProfileUpdate={handleProfileUpdate} />
    }
    </>
  );

  const renderAddressBook = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="text-l-primary dark:text-d-primary">
          My Addresses
        </Typography>
        <Button
          type="submit"
          variant="contained"
          className="bg-link hover:bg-link/80 dark:text-d-ctaText text-l-ctaText"
          onClick={() => setIsAddressFormOpen(true)}
        >
          <AddIcon />
          Add New Address
        </Button>
      </div>

      {addressLoading ? (
        <AddressListSkeleton />
      ) : addressError ? (
        <Typography color="error">{addressError}</Typography>
      ) : addresses.length === 0 ? (
        <Typography>No addresses found. Add your first address!</Typography>
      ) : (
        <AddressList />
      )}

      <Dialog 
        open={isAddressFormOpen} 
        onClose={() => setIsAddressFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <AddressForm
            onCancel={() => setIsAddressFormOpen(false)}
          />
        </DialogContent>
      </Dialog> 
    </div>
  );

  return (
    <>
    {loading ?
    <ProfileSkeleton />
    :
    <div className="container mx-auto px-4 py-8">      
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper className="p-4 bg-opacity-90 backdrop-blur-sm border dark:border-d-border text-l-ctaText bg-l-background dark:text-d-ctaText dark:bg-d-background">
            <div className="flex flex-col items-center">
              <Avatar
                alt={profile.first_name}
                src={`https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}`}
                className="w-48 h-48 mr-4 bg-transparent"
              />
              <div className="flex justify-between w-full">
                <div className='text-l-secondary dark:text-d-secondary'>
                Username:
                </div>
                <div>
                  {profile?.role?.active_role?.username}
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div className='text-l-secondary dark:text-d-secondary'>
                  Full Name:
                </div>
                <div>
                  {profile.first_name} {profile.last_name}
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div className='text-l-secondary dark:text-d-secondary'>
                  Email:
                </div>
                <div>
                  {profile.email}
                </div>
              </div>
              <div>
                <Chip
                  label={`Joined ${formatDate(profile.created_at)}`}
                  size="small"
                  variant="outlined"
                  className="text-l-ctaText mt-2 bg-l-background dark:text-d-ctaText dark:bg-d-background"
                />
                {profile?.role && profile.role?.active_role && profile.role?.active_role?.role ? (
                <Chip
                    label={profile.role?.active_role?.role}
                    color="info"
                    size="small"
                    variant='outlined'
                    className="ml-2 text-l-ctaText mt-2 bg-l-background dark:bg-d-background"
                  />
                ) : ""}
              </div>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper className="p-4 bg-opacity-90 backdrop-blur-sm border dark:border-d-border/80 text-l-ctaText bg-l-background dark:text-d-ctaText dark:bg-d-background/90 min-h-full">
            <Typography variant="h6" className="mb-4">
              Actions
            </Typography>
            <Divider className='dark:border-gray-600'/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full p-2">
              {!profile.is_verified && (
                <div className="mt-2 flex flex-col gap-2">
                  <Button
                    type="submit"
                    variant="contained"
                    className="bg-subtleAccent/60 hover:bg-subtleAccent/80 w-full"
                    onClick={() => handleVerifyEmail(profile.email)}
                    disabled={isEmailLinkAvailable ? true : false}
                  >
                    Verify Email
                  </Button>
                  {isEmailLinkAvailable && (
                    <Button
                      type="submit"
                      variant="contained"
                      className="bg-c-success hover:bg-c-success/80 dark:bg-c-success dark:hover:bg-c-success/80 w-full"
                      component="a"
                      href={isEmailLinkAvailable}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleEmailVerification()}
                    >
                      Click to Verify
                    </Button>
                  )}
                </div>
              )}
              {profile && profile?.role && profile?.role?.roles?.length > 1 ? (
                <>
                <Divider orientation="vertical" flexItem className='dark:border-gray-600' />
                <div key={profile?.role?.active_role?.role} className="mt-2 flex flex-wrap gap-2">
                  {profile && profile?.role && profile?.role?.roles?.length > 1 && profile?.role?.roles?.map((role) => { 
                    if (role?.role === profile?.role?.active_role?.role) {
                      return null;
                    }
                    return (
                      <Button
                        type="submit"
                        variant="contained"
                        className="bg-c-info/60 hover:bg-c-info/80 w-full"
                        onClick={() => handleSwitchRole(role?.username)}
                      >
                        <UserSwitch className='mr-1' size={20}/>
                        Switch to {role?.role}
                      </Button>
                    )
                  })}
                </div>
                </>
              ): (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    variant="contained"
                    className="bg-c-info/60 hover:bg-c-info/80 w-full"
                    onClick={() => handleSwitchRole(role?.username)}
                  >
                    <UserSwitch className='mr-1' size={20}/>
                    Req
                  </Button>
                </div> 
              )}
            </div>
          </ Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper className="p-4 bg-opacity-90 backdrop-blur-sm border dark:border-d-border/80 text-l-ctaText bg-l-background dark:text-d-ctaText dark:bg-d-background/90">
            <Typography variant="h6" className="mb-4">
              Manage My Account
            </Typography>
            <List>
              {menuItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    button
                    selected={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`rounded-lg ${
                      activeSection === item.id
                        ? 'bg-primary'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <ListItemIcon className={activeSection === item.id ? 'text-l-ctaText dark:text-d-ctaText' : 'dark:text-d-ctaText/50'}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} className='text-l-primary dark:text-d-primary' />
                  </ListItem>
                  <Divider className="my-2" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Paper className="p-6 bg-opacity-90 backdrop-blur-sm border dark:border-d-border/80 text-l-ctaText bg-l-background dark:text-d-ctaText dark:bg-d-background/90">
            {activeSection === 'profile' && renderProfileForm()}
            {activeSection === 'addresses' && renderAddressBook()}
            {/* Other sections will be implemented similarly */}
          </Paper>
        </Grid>
      </Grid>
    </div>
    }
    </>
  );
};

export default Profile;
