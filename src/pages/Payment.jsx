import { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button,
  Stepper, Step, StepLabel, Radio, RadioGroup,
  FormControlLabel, Grid, Divider, Box, Alert
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';

const Payment = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const steps = ['Select Payment Method', 'Enter Details', 'Confirm Payment'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardDetailsChange = (field) => (event) => {
    setCardDetails({
      ...cardDetails,
      [field]: event.target.value
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      fetch('http://localhost:8084/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: 1.2,
        })
      }).then((response) => response.json())
      .then((data) => {
        window.location.href = data.redirect_url;
      })
      .catch((error) => console.error('Error:', error));
    } catch (error) {
      setError('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="py-4">
            <Typography variant="h6" className="mb-4">
              Choose Payment Method
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <Paper className="p-4 mb-3 hover:shadow-md transition-shadow">
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <div className="flex items-center">
                      <CreditCardIcon className="mr-2" />
                      <div>
                        <Typography>Credit/Debit Card</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Pay securely with your card
                        </Typography>
                      </div>
                    </div>
                  }
                />
              </Paper>
              <Paper className="p-4 mb-3 hover:shadow-md transition-shadow">
                <FormControlLabel
                  value="bank"
                  control={<Radio />}
                  label={
                    <div className="flex items-center">
                      <AccountBalanceIcon className="mr-2" />
                      <div>
                        <Typography>Bank Transfer</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Pay directly from your bank account
                        </Typography>
                      </div>
                    </div>
                  }
                />
              </Paper>
              <Paper className="p-4 hover:shadow-md transition-shadow">
                <FormControlLabel
                  value="upi"
                  control={<Radio />}
                  label={
                    <div className="flex items-center">
                      <PaymentIcon className="mr-2" />
                      <div>
                        <Typography>UPI</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Pay using UPI
                        </Typography>
                      </div>
                    </div>
                  }
                />
              </Paper>
            </RadioGroup>
          </Box>
        );

      case 1:
        return (
          <Box className="py-4">
            <Typography variant="h6" className="mb-4">
              {paymentMethod === 'card' ? 'Card Details' : 
               paymentMethod === 'bank' ? 'Bank Details' : 'UPI Details'}
            </Typography>
            {paymentMethod === 'card' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={cardDetails.number}
                    onChange={handleCardDetailsChange('number')}
                    placeholder="1234 5678 9012 3456"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={cardDetails.name}
                    onChange={handleCardDetailsChange('name')}
                    placeholder="John Doe"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={cardDetails.expiry}
                    onChange={handleCardDetailsChange('expiry')}
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange('cvv')}
                    placeholder="123"
                  />
                </Grid>
              </Grid>
            )}
            {paymentMethod === 'bank' && (
              <Typography>Bank transfer details will be shown here</Typography>
            )}
            {paymentMethod === 'upi' && (
              <Typography>UPI payment details will be shown here</Typography>
            )}
          </Box>
        );

      case 2:
        return (
          <Box className="py-4 text-center">
            <Typography variant="h6" color="primary" className="mb-2">
              Payment Successful!
            </Typography>
            <Typography variant="body1" className="mb-4">
              Your order has been confirmed
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/orders"
            >
              View Orders
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Paper className="p-6">
        <Typography variant="h4" className="mb-6 font-bold text-center">
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Divider className="my-4" />

        <div className="flex justify-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? undefined : handlePayment}
            disabled={loading || activeStep === steps.length - 1}
          >
            {loading ? 'Processing...' : activeStep === steps.length - 2 ? 'Pay Now' : 'Next'}
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

export default Payment;
