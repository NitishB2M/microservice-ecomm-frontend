import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Button } from 'keep-react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShippingAddress from '../components/ShippingAddress';
import ReviewCart from '../components/ReviewCart';
import PaymentDemo from './PaymentDemo';
import Payment from './Payment';
import Addresses from '../components/profile/Addresses';

const CheckoutSteps = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [IsAddressSelected, setIsAddressSelected] = useState(false);

  const data = [
    { id: 1, title: 'Review Cart', description: 'Review Cart-content' },
    // { id: 2, title: 'Shipping Address', description: 'Shipping Address-content' },
    { id: 2, title: 'Payment Method', description: 'Payment Method-content' },
    { id: 3, title: 'Confirm Order', description: 'Confirm Order-content' },
    { id: 4, title: 'Order Summary', description: 'Order Summary-content' },
  ];

  const informUser = () => {
    if (activeStep === 0 && !IsAddressSelected) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Please select a shipping address
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ), {
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        position: 'bottom-right',
      });
    } 
  };
  const handleNext = () => {
    // if address is not selected
    if (activeStep < data.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      toast.success('Your order has been successfully placed!', {
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    informUser();
  }, [activeStep, IsAddressSelected]);

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };
  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  const handleAddressChange = () => {
    setIsAddressSelected(true);
  };

  const renderStepContent = (current) => {
    switch (current) {
      case 0:
        return <div className='flex flex-row gap-2'>
          <div className='w-3/4'>
            <ReviewCart setCheckoutItems={setCheckoutItems} />
          </div>
          <div className='w-1/4'>
            <Addresses callback={handleAddressChange} />
          </div>
        </div>;
      // case 1:
      //   return <ShippingAddress callback={handleAddressChange} />;
      case 1:
        return <Payment checkoutItems={checkoutItems} />;
      case 2:
        return <div>Confirm Order-content</div>;
      case 3:
        return <div>Order Summary-content</div>;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="py-8 px-4 w-full">
        <div className="w-full flex justify-between items-center relative">
          {data.map((step, index) => (
            <div
              key={step.id}
              className="flex-1 flex flex-col items-center relative"
              // onClick={() => handleStepClick(index)}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 text-lg border-2 text-c-info ${
                  index < activeStep ? 'bg-c-info text-l-primary' : index === activeStep ? 'border-c-info' : 'border-c-warning text-c-warning'
                } rounded-full`}
              >
                {step.id}
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300" />
          <div
            className={`absolute top-1/2 left-0 h-1 transition-all ease-in-out duration-300 bg-c-info ${
              activeStep === 0
                ? 'w-1/5'
                : activeStep === 1
                ? 'w-2/5'
                : activeStep === 2
                ? 'w-3/5'
                : activeStep === 3
                ? 'w-4/5'
                : 'w-full'
            }`}
          />
        </div>

        <div className="my-8">{renderStepContent(activeStep)}</div>

        <div className="flex justify-between">
          {activeStep === 0 ? (
            <Button
              variant="softBg"
              color="success"
              onClick={() => navigate('/cart')}
              className="px-4 py-2"
            >
              Go Back To Cart
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={activeStep === 0}
              className="px-4 py-2"
            >
              Previous
            </Button>
          )}
          <Button
            variant={activeStep === data.length - 1 ? 'softBg' : 'outline'}
            color={activeStep === data.length - 1 ? 'success' : 'primary'}
            onClick={handleNext}
            disabled={data.length === 0 || (activeStep === 0 && !IsAddressSelected)}
            className="px-4 py-2"
          >
            {activeStep === data.length - 1 ? 'Done' : 'Next'}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutSteps;
