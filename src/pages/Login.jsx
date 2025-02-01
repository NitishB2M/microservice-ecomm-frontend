import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Paper, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Envelope, Lock, User } from 'phosphor-react';
import { Label, Input, InputIcon, Button } from 'keep-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState({ message: '', details: [] });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { login, user, requestPasswordReset } = useAuth();

  useEffect(() => {
    if (user && Object.keys(user).length > 1) {
      navigate('/profile');
    } else {
      console.log('no token');
    }
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ message: '', details: [] });
    setSuccessMessage('');

    const result = await login(email, password, username);
    if (result.success) {
        setSuccessMessage(result.message);
        navigate('/profile');
    } else {
      setError({
        message: result.error,
        details: result.errorDetails || []
      });
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError({ message: '', details: [] });
    setSuccessMessage('');
    if (!email) {
      setError({ message: 'Please enter your email address', details: [] });
      return;
    } 

    const result = await requestPasswordReset(email);
    if (result.success) {
      setSuccessMessage(result.message);
      const link = result.resetLink;
      setResetDialogOpen(true);
      if (!link) {
        setError({
          message: 'Password reset link not found',
          details: []
        });
        return;
      }
      setTimeout(() => {
        setResetDialogOpen(false);
        window.open(link, '_blank');
      }, 3000);
    } else {
      setError({
        message: result.error,
        details: result.errorDetails || []
      });
    }
  };

  return (
    <>
      {
        user && Object.keys(user).length > 1 ? navigate('/profile') : (
          <div className="flex justify-center items-center min-h-[80vh] bg-background">
            {!resetDialogOpen ? (
              <Paper className="p-8 w-full max-w-md text-l-ctaText mt-2 !bg-l-boxBg/10 dark:text-d-ctaText dark:bg-d-boxBg">
                <Typography variant="h5" component="h1" className="text-center !mb-6 font-bold text-l-primary dark:text-d-primary">
                  Login to Your Account
                </Typography>

                {error.message && (
                  <Alert severity="error" className="mb-4">
                    {error.message}
                    {error.details.length > 0 && (
                      <ul className="mt-2 list-disc list-inside">
                        {error.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </Alert>
                )}

                {successMessage && (
                  <Alert severity="success" className="mb-4">
                    {successMessage}
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
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                      />
                      <InputIcon>
                        <User size={19} color="#AFBACA" />
                      </InputIcon>
                    </div>
                  </fieldset>
                  <fieldset className="space-y-1">
                    <Label htmlFor="email">Email*</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className="ps-11 placeholder:text-l-primary/80"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
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
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
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
                    Login
                  </Button>
                </form>

                <div className="mt-4 flex justify-between items-center">
                  <Button
                    onClick={() => setResetDialogOpen(true)}
                    className="text-c-info hover:text-c-info/80"
                  >
                    Forgot Password?
                  </Button>
                  <Link to="/signup" className="text-c-info hover:text-c-info/80">
                    Sign up
                  </Link>
                </div>
              </Paper>

            ) : (
              <Paper className="p-8 w-full max-w-md text-l-ctaText mt-2 !bg-l-boxBg/10 dark:text-d-ctaText dark:bg-d-boxBg">
                <Typography variant="h5" component="h1" className="text-center !mb-6 font-bold text-l-primary dark:text-d-primary">
                  Reset Password
                </Typography>

                {error.message && (
                  <Alert severity="error" className="mb-4">
                    {error.message}
                    {error.details.length > 0 && (
                      <ul className="mt-2 list-disc list-inside">
                        {error.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </Alert>
                )}
                {successMessage && (
                  <Alert severity="success" className="mb-4">
                    {successMessage}
                  </Alert>
                )}
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <fieldset className="space-y-1">
                    <Label htmlFor="username">Username*</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        className="ps-11 placeholder:text-l-primary/80"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                      />
                      <InputIcon>
                        <User size={19} color="#AFBACA" />
                      </InputIcon>
                    </div>
                  </fieldset>
                  <fieldset className="space-y-1">
                    <Label htmlFor="email">Email*</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className="ps-11 placeholder:text-l-primary/80"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                      <InputIcon>
                        <Envelope size={19} color="#AFBACA" />
                      </InputIcon>
                    </div>
                  </fieldset>
                  <Button
                    type="submit"
                    variant="contained"
                    className="bg-l-boxBg hover:bg-l-boxBg/80 dark:bg-d-boxBg dark:hover:bg-d-boxBg/80 w-full"
                  >
                    Reset Password
                  </Button>
                </form>

                <div className="mt-4 flex justify-between items-center">
                  <Button
                    onClick={(prev) => setResetDialogOpen(!prev)}
                    className="text-c-info hover:text-c-info/80"
                  >
                    Login
                  </Button>
                  <Link to="/signup" className="text-c-info hover:text-c-info/80">
                    Sign up
                  </Link>
                </div>
              </Paper>
            )}
          </div>
        )}
    </>
  );
};

export default Login;
