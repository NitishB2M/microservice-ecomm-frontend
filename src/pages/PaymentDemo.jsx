import React, { useEffect, useState } from 'react';
import { Container, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../hooks/useCheckout';

const PAYMENT_API = 'http://localhost:8084/payment';

const PaymentDemo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const navigate = useNavigate();
  const { checkout, setCheckoutLoading } = useCheckout();

  // Create checkout session
  const createCheckoutSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to proceed with payment');
      }

      const response = await fetch(`${PAYMENT_API}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: calculateGrandTotal(),
          currency: 'INR',
          items: checkout.cart_items.map(item => ({
            name: item.product.name,
            amount: item.product.price,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to create checkout session');
      }

      const result = await response.json();
      return result.checkout_token;
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  };

  const calculateTotal = () => {
    if (!checkout?.cart_items?.length) return 0;
    return checkout.cart_items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!checkout?.cart_items?.length) return 0;
    return checkout.cart_items.reduce((total, item) => 
      total + (item.price * item.quantity * (item.product.discount / 100)), 0);
  };

  const calculateSubtotal = () => {
    return calculateTotal() - calculateDiscount();
  }

  const calculateGrandTotal = () => {
    if (!checkout?.cart_items?.length) return 0;
    return checkout.cart_items.reduce((total, item) => 
      total + (item.price * item.quantity * (1 - item.product.discount / 100)), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18;
  };

  useEffect(() => {
    let checkoutInstance = null;
    let mounted = true;

    const initializeCheckout = async () => {
      try {
        if (!window.RapydCheckoutToolkit) {
          throw new Error('Rapyd Checkout Toolkit not loaded');
        }

        // Get checkout token
        const token = await createCheckoutSession();
        if (!mounted) return;
        setCheckoutToken(token);
        checkoutInstance = new window.RapydCheckoutToolkit({
          pay_button_text: "Complete Payment",
          pay_button_color: "#4BB4D2",
          id: "checkout-container",
          checkout_id: token,
          style: {
            submit: {
              base: {
                color: "white",
                background: "#4BB4D2",
                '&:hover': {
                  background: "#3CA1BF"
                }
              },
            },
          },
        });

        checkoutInstance.displayCheckout();
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing checkout:', error);
        if (!mounted) return;
        
        setFeedbackState({
          title: "Error",
          message: error.message || "Failed to initialize payment system. Please try again later.",
          isError: true
        });
        setIsLoading(false);
      }
    };

    const loadScript = () => {
      if (document.getElementById('rapyd-checkout-script')) {
        setScriptLoaded(true);
        initializeCheckout();
        return;
      }

      const script = document.createElement('script');
      script.src = "https://sandboxcheckouttoolkit.rapyd.net";
      script.id = "rapyd-checkout-script";
      script.async = true;

      script.onload = () => {
        if (!mounted) return;
        setScriptLoaded(true);
        initializeCheckout();
      };

      script.onerror = () => {
        if (!mounted) return;
        console.error('Failed to load Rapyd script');
        setFeedbackState({
          title: "Error",
          message: "Failed to load payment system. Please try again later.",
          isError: true
        });
        setIsLoading(false);
      };

      document.body.appendChild(script);
    };

    const handlePaymentSuccess = (event) => {
      console.log('Payment successful:', event.detail);
      setFeedbackState({
        title: "Payment Successful!",
        message: "Thank you for your purchase. Your order has been confirmed.",
        isError: false
      });
      setTimeout(() => navigate('/orders'), 2000);
    };

    const handlePaymentFailure = (event) => {
      console.error('Payment failed:', event.detail);
      setFeedbackState({
        title: "Payment Failed",
        message: event.detail.error || "Something went wrong with your payment. Please try again.",
        isError: true
      });
    };

    window.addEventListener('onCheckoutPaymentSuccess', handlePaymentSuccess);
    window.addEventListener('onCheckoutPaymentFailure', handlePaymentFailure);

    if (checkout?.cart_items?.length > 0) {
      loadScript();
    } else {
      setIsLoading(false);
    }

    return () => {
      mounted = false;
      window.removeEventListener('onCheckoutPaymentSuccess', handlePaymentSuccess);
      window.removeEventListener('onCheckoutPaymentFailure', handlePaymentFailure);
      if (checkoutInstance) {
        checkoutInstance.destroy();
      }
      setCheckoutLoading(false);
    };
  }, [navigate, checkout, setCheckoutLoading]);

  if (!checkout?.cart_items?.length) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h6" align="center" color="error">
          No items in cart. Please add items to proceed with checkout.
        </Typography>
        <div className="text-center mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Typography variant="h4" align="center" gutterBottom className="mb-6 dark:text-d-primary">
          Complete Your Payment
        </Typography>
        <span id="rapyd-checkout-script"></span>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <CircularProgress size={40} className="mb-4" />
            <Typography variant="body1" className="dark:text-d-primary">
              Initializing payment system...
            </Typography>
          </div>
        )}

        {/* Feedback Messages */}
        {feedbackState && (
          <div className={`p-4 rounded-lg mb-6 text-center ${
            feedbackState.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            <Typography variant="h6" gutterBottom>
              {feedbackState.title}
            </Typography>
            <Typography variant="body1">
              {feedbackState.message}
            </Typography>
          </div>
        )}

        {/* Checkout Container */}
        <div 
          id="checkout-container" 
          className={`bg-white dark:bg-d-background rounded-lg shadow-lg p-6 ${
            isLoading ? 'hidden' : 'block'
          }`}
        />

        {/* Order Summary */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-d-background/80 rounded-lg">
          <Typography variant="h6" gutterBottom className="dark:text-d-primary">
            Order Summary
          </Typography>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Typography variant="body1" className="dark:text-d-primary">
                Subtotal:
              </Typography>
              <Typography variant="body1" className="dark:text-d-primary">
                ₹{calculateTotal().toFixed(2)}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body1" className="dark:text-d-primary">
                Discount:
              </Typography>
              <Typography variant="body1" className="text-green-600">
                -₹{calculateDiscount().toFixed(2)}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body1" className="dark:text-d-primary">
                Tax (18%):
              </Typography>
              <Typography variant="body1" className="dark:text-d-primary">
                ₹{calculateTax().toFixed(2)}
              </Typography>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <Typography variant="h6" className="dark:text-d-primary">
                Total Amount:
              </Typography>
              <Typography variant="h6" className="font-semibold dark:text-d-primary">
                ₹{(calculateGrandTotal() + calculateTax()).toFixed(2)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PaymentDemo;
