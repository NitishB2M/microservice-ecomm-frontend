import { useState, useCallback, useEffect } from 'react';

const ADDRESS_API = 'http://localhost:8080/user/address';
const CARD_API = 'http://localhost:8080/user/card';
const USER_API = 'http://localhost:8080/user';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [user, setUser] = useState({});

  const checkTokenExistence = () => {
    const token = localStorage.getItem('token');
    if (token && token.length > 0) {
      return { token, isValid: true };
    }
    return { token: '', isValid: false };
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { token, isValid } = checkTokenExistence();
      if (!isValid) {
        setProfileError('Please login first');
        setLoading(false);
        return { success: false, error: 'No token found' };
      }
      const response = await fetch(`${USER_API}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        setUser(result.data);
        setProfileMessage(result.message);
      } else {
        setProfileError(result.error || 'Failed to fetch profile');
        setUser({});
      }
    } catch (error) {
      setProfileError('Failed to fetch profile');
    } finally {
      clearProfileMessages(0);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setProfileLoading(true);
    try {
      const { token, isValid } = checkTokenExistence();
      if (!isValid) {
        setProfileError('Please login first');
        return { success: false, error: 'No token found' };
      }
      const response = await fetch(`${USER_API}/profile/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      if (response.ok) {
        setProfileMessage('Profile updated successfully');
        return { success: true, data: result.data };
      } else {
        setProfileError(result.error || 'Failed to update profile');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setProfileError('Failed to update profile');
      return { success: false, error: 'Failed to update profile' };
    } finally {
      setTimeout(() => {
        setProfileLoading(false);
        clearProfileMessages(4);
      }, 1000);
    }
  }, []);


  const login = async (email, password, username) => {
    try {
      const response = await fetch(`${USER_API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      const result = await response.json();
      
      if (response.ok && result.data) {
        localStorage.setItem('token', result.data.token);
        setUser(result.data.user);
        return { success: true, message: result.message };
      } else {
        return { 
          success: false, 
          error: result.error,
          errorDetails: result.errorDetails || []
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error occurred',
        errorDetails: []
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${USER_API}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (response.ok && result.data) {
        localStorage.setItem('token', result.data.token);
        setUser(result.data.user);
        return { success: true, message: result.message };
      } else {
        return { 
          success: false, 
          error: result.error,
          errorDetails: result.errorDetails || []
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error occurred',
        errorDetails: []
      };
    }
  };

  const switchRole = async (username) => {
    setLoading(true);
    try {
      const { token, isValid } = checkTokenExistence();
      if (!isValid) {
        setProfileError('Please login first');
        setLoading(false);
        return { success: false, error: 'No token found' };
      }
      const response = await fetch(`${USER_API}/switch-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      
      if (response.ok && result.data) {
        localStorage.setItem('token', result.data.token);
        setUser(result.data.user);
        return { success: true, message: result.message };
      } else {
        return { 
          success: false, 
          error: result.error,
          errorDetails: result.errorDetails || []
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error occurred',
        errorDetails: []
      };
    } finally {
      setTimeout(() => {
        setLoading(false);
        clearProfileMessages(4);
      }, 3000);
    }
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(`${USER_API}/password/reset/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, message: result.message, resetLink: result.data.reset_password_link  };
      } else {
        return { 
          success: false, 
          error: result.error,
          errorDetails: result.errorDetails || []
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error occurred',
        errorDetails: []
      };
    } finally {
      setTimeout(() => {
        setLoading(false);
        clearProfileMessages(3);
      }, 1000);
    }
  };

  const resetPassword = async (password, token) => {
    setLoading(true);
    try {
      const response = await fetch(`${USER_API}/password/reset?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: password }),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, message: result.message};
      } else {
        return { 
          success: false, 
          error: result.error,
          errorDetails: result.errorDetails || []
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error occurred',
        errorDetails: []
      };
    } finally {
      setTimeout(() => {
        setLoading(false);
        clearProfileMessages(2);
      }, 1000);
    }
  };

  const sendVerificationEmail = useCallback( async (email) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${USER_API}/verify/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'email': email}),
      });

      const result = await response.json();
      
      if (response.ok) {
        // await fetchProfile();
        return { success: true, message: result.message, data: result.data };
      } else {
        return { 
          success: false, 
          error: result.error,
          errorDetails: result.errorDetails || []
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error occurred',
        errorDetails: []
      };
    }
  }, [fetchProfile]);

  const deactivateAccount = useCallback( async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${USER_API}/deactivate/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        logout();
        return { success: true, message: result.message };
      } else {
        return { 
          success: false, 
          error: result.error,
          errorDetails: result.errorDetails || []
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error occurred',
        errorDetails: []
      };
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const clearProfileMessages = useCallback((v) => {
    if (v) {
      setTimeout(() => {
        setProfileMessage('');
      }, v * 1000);
    } else {
      setProfileMessage('');
    }
  }, []);

  const clearProfileError = useCallback((v) => {
    if (v) {
      setTimeout(() => {
        setProfileError('');
      }, v * 1000);
    } else {
      setProfileError('');
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    clearProfileMessages(0);
  }, []);

  return {
    loading,
    profileError,
    profileMessage,
    setProfileError,
    setProfileMessage,
    profileLoading,
    user,
    setUser,
    fetchProfile,
    updateProfile,
    login,
    signup,
    requestPasswordReset,
    sendVerificationEmail,
    deactivateAccount,
    logout,
    clearProfileMessages,
    clearProfileError,
    switchRole,
    resetPassword
  };
};
