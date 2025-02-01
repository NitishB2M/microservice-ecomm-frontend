import React from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <Typography variant="h1" className="text-8xl font-bold mb-8">
        404 Not Found
      </Typography>
      <div className="mb-8 text-center">
        Your visited page not found. You may go home page.
      </div>
      <Button
        variant="contained"
        className="bg-primary hover:bg-primary-dark"
        onClick={() => navigate('/')}
      >
        Back to Home page
      </Button>
    </div>
  );
};

export default NotFound;
