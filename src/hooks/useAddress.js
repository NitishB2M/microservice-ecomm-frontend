import { useState, useCallback, useEffect } from 'react';

const ADDRESS_API = 'http://localhost:8080/user/address';

export const useAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setAddressLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADDRESS_API}/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (response.ok) {
        setAddresses(result.data || []);
        setAddressSuccess(result.message || 'Successfully fetched addresses');
      } else {
        setAddressError(result.error || 'Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddressError('Error fetching addresses');
    } finally {
      setTimeout(() => {
        setAddressLoading(false);
        clearAddressMessages(2,2);
      }, 1000);
    }
  }, []);

  const addAddress = useCallback(async (addressData) => {
    setAddressLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADDRESS_API}/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });

      const result = await response.json();
      if (response.ok) {
        setAddressSuccess(result.message || 'Address added successfully');
        // await fetchAddresses();
        return { success: true, data: result.data };
      } else {
        setAddressError(result.error || 'Failed to add address');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setAddressError('Error adding address');
      return { success: false, error: 'Error adding address' };
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (addressId, addressData) => {
    setAddressLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADDRESS_API}/update/${addressId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });

      const result = await response.json();
      if (response.ok) {
        setAddressSuccess(result.message || 'Address updated successfully');
        // await fetchAddresses();
        return { success: true, data: result.data };
      } else {
        setAddressError(result.error || 'Failed to update address');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error updating address:', error);
      setAddressError('Error updating address');
      return { success: false, error: 'Error updating address' };
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId) => {
    setAddressLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADDRESS_API}/delete/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (response.ok) {
        setAddressSuccess(result.message || 'Address deleted successfully');
        await fetchAddresses();
        return { success: true };
      } else {
        setAddressError(result.error || 'Failed to delete address');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setAddressError('Error deleting address');
      return { success: false, error: 'Error deleting address' };
    } finally {
      setAddressLoading(false);
    }
  }, [fetchAddresses]);

  const setDefaultAddress = useCallback(async (addressId) => {
    setAddressLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADDRESS_API}/set-primary/${addressId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (response.ok) {
        setAddressSuccess(result.message || 'Default address updated');
        await fetchAddresses();
        return { success: true };
      } else {
        setAddressError(result.error || 'Failed to set default address');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      setAddressError('Error setting default address');
      return { success: false, error: 'Error setting default address' };
    } finally {
      setTimeout(() => {
        setAddressLoading(false);
        clearAddressMessages(3, 3);
      }, 1000);
    }
  }, [fetchAddresses]);

  const clearAddressMessages = useCallback((v, w) => {
    if (v) {
      setTimeout(() => {
        setAddressSuccess('');
      }, v * 1000);
    } else {
      setAddressSuccess('');
    }

    if (w) {
      setTimeout(() => {
        setAddressError('');
      }, w * 1000);
    } else {
      setAddressError('');
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    addressLoading,
    addressError,
    addressSuccess,
    setAddressError,
    setAddressSuccess,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearAddressMessages,
    fetchAddresses
  };
};
