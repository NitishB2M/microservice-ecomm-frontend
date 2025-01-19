import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Paper, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Envelope, Lock, User } from 'phosphor-react';
import { Label, Input, InputIcon, Button } from 'keep-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup, user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token || (user && Object.keys(user).length > 0)) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 5000);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.username || !formData.first_name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (formData.first_name.length < 2) {
      setError('First name must be at least 2 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await signup({
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-background">
      <Paper className="p-8 w-full max-w-md text-l-ctaText mt-2 !bg-l-boxBg/10 dark:text-d-ctaText dark:bg-d-boxBg">
        <Typography variant="h5" component="h1" className="text-center !mb-6 font-bold text-l-primary dark:text-d-primary">
          Create an Account
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="space-y-1">
            <Label htmlFor="username">Username*</Label>
            <div className="relative">
              <Input 
                id="username" 
                type="text" 
                name="username" 
                placeholder="Enter username" 
                className="ps-11 placeholder:text-l-primary/80" 
                onChange={handleChange} 
                value={formData.username}
              />
              <InputIcon>
                <User size={19} color="#AFBACA" />
              </InputIcon>
            </div>
          </fieldset>
          <div className="flex space-x-4">
            <fieldset className="space-y-1">
              <Label htmlFor="first_name">First Name*</Label>
              <div className="relative">
                <Input 
                  id="first_name" 
                  type="text" 
                  name="first_name" 
                  placeholder="Enter first name" 
                  className="ps-11 placeholder:text-l-primary/80" 
                  onChange={handleChange} 
                  value={formData.first_name}
                />
                <InputIcon>
                  <User size={19} color="#AFBACA" />
                </InputIcon>
              </div>
            </fieldset>

            <fieldset className="space-y-1">
              <Label htmlFor="last_name">Last Name</Label>
              <div className="relative">
                <Input 
                  id="last_name" 
                  type="text" 
                  name="last_name" 
                  placeholder="Enter last name" 
                  className="ps-11 placeholder:text-l-primary/80" 
                  onChange={handleChange} 
                  value={formData.last_name}
                />
                <InputIcon>
                  <User size={19} color="#AFBACA" />
                </InputIcon>
              </div>
            </fieldset>
          </div>

          <fieldset className="space-y-1">
            <Label htmlFor="email">Email*</Label>
            <div className="relative">
              <Input 
                id="email" 
                type="email" 
                name="email" 
                placeholder="Enter email" 
                className="ps-11 placeholder:text-l-primary/80" 
                onChange={handleChange} 
                value={formData.email}
              />
              <InputIcon>
                <Envelope size={19} color="#AFBACA" />
              </InputIcon>
            </div>
          </fieldset>

          <fieldset className="space-y-1">
            <Label htmlFor="password">Password*</Label>
            <div className="relative">
              <Input 
                id="password" 
                type="password" 
                name="password" 
                placeholder="Enter password" 
                className="ps-11 placeholder:text-l-primary/80" 
                onChange={handleChange} 
                value={formData.password}
              />
              <InputIcon>
                <Lock size={19} color="#AFBACA" />
              </InputIcon>
            </div>
          </fieldset>

          <fieldset className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password*</Label>
            <div className="relative">
              <Input 
                id="confirmPassword" 
                type="password" 
                name="confirmPassword" 
                placeholder="Confirm password" 
                className="ps-11 placeholder:text-l-primary/80" 
                onChange={handleChange} 
                value={formData.confirmPassword}
              />
              <InputIcon>
                <Lock size={19} color="#AFBACA" />
              </InputIcon>
            </div>
          </fieldset>

          <Button
            type="submit"
            variant="contained"
            className="bg-l-boxBg hover:bg-l-boxBg/80 dark:bg-d-boxBg dark:hover:bg-d-boxBg/80 w-full"
          >
            Signup
          </Button>
        </form>

        <Typography className="text-center !mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-c-info hover:text-c-info/80">
            Login
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Signup;
