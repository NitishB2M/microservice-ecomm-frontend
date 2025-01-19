import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Grid, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ComputerIcon from '@mui/icons-material/Computer';
import WatchIcon from '@mui/icons-material/Watch';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import ProductCard from '../components/ProductCard';
import ViewButton from '../components/buttons/ViewButton';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { Button } from "keep-react";
import { ShoppingCart } from 'phosphor-react';
import { Carousel, CarouselItem, CarouselSlides, CarouselControl, CarouselButtons, CarouselPrevButton, CarouselNextButton, CarouselIndicators } from 'keep-react';

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });
  const { 
    productGDLoading,
    productOfferLoading,
    productFeaturedLoading,
    productGreatDeals,
    featuredProducts,
    productFeaturedError,
    productGDError,
    productOfferError,
    offerProducts,
   } = useProduct();

  const { addToCart} = useCart();


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds >= 0) return { ...prev, seconds: newSeconds };
        
        const newMinutes = prev.minutes - 1;
        if (newMinutes >= 0) return { ...prev, minutes: newMinutes, seconds: 59 };
        
        const newHours = prev.hours - 1;
        if (newHours >= 0) return { ...prev, hours: newHours, minutes: 59, seconds: 59 };
        
        const newDays = prev.days - 1;
        if (newDays >= 0) return { days: newDays, hours: 23, minutes: 59, seconds: 59 };
        
        clearInterval(timer);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const categories = [
    { icon: <PhoneIphoneIcon />, name: 'Phones', path: '/products/filters?category=phones' },
    { icon: <ComputerIcon />, name: 'Computers', path: '/products/filters?category=computers' },
    { icon: <WatchIcon />, name: 'Smartwatch', path: '/products/filters?category=smartwatch' },
    { icon: <CameraAltIcon />, name: 'Camera', path: '/products/filters?category=camera' },
    { icon: <HeadphonesIcon />, name: 'Headphones', path: '/products/filters?category=headphones' },
  ];

  if (productGDLoading || productOfferLoading || productFeaturedLoading) {
    return (
      <Container className="py-8">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (productGDError || productOfferError || productFeaturedError) {
    return (
      <Container className="py-8">
        <Typography color="error">{productGDError || productOfferError || productFeaturedError}</Typography>
      </Container>
    );
  }

  if(Object.keys(productGreatDeals).length === 0 && Object.keys(offerProducts).length === 0 && Object.keys(featuredProducts).length === 0) {
    return (
      <Container className="py-8">
        <Typography color="error">No products found</Typography>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:text-white dark:bg-d-background">
      {/* Hero Section */}
      <section className="bg-background text-l-primary dark:text-d-primary dark:bg-d-background">
        <Container maxWidth="xl" className="py-8">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" className="font-bold mb-4">
                iPhone 14 Series
              </Typography>
              <Typography variant="h5" className="mb-6 text-l-secondary dark:text-d-secondary">
                Up to 10% off Voucher
              </Typography>
              <Button color="secondary" variant='softBg' className='mt-3'>
                <ShoppingCart size={18} className="mr-2" />
                Shop Now
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                src="https://images.unsplash.com/photo-1609921205586-7e8a57516512?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aXBob25lfGVufDB8fDB8fHww"
                alt="iPhone 14"
                className="w-full max-w-md mx-auto"
              />
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Categories Section */}
      <Container maxWidth="xl" className="py-8">
        <Typography variant="h5" className="font-bold pb-4">
          Browse By Category
        </Typography>
        <Carousel options={{ slidesToScroll: 2 }}>
          <CarouselSlides className="flex">
            {categories.map((category) => (
              <CarouselItem key={category.name} className="flex-[0_0_30%]">
                <Link
                  to={category.path}
                  className="block p-4 text-center border rounded-sm hover:text-l-primary transition-colors duration-700 ease-in-out hover:bg-l-boxBg"
                >
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <Typography variant="subtitle2">{category.name}</Typography>
                </Link>
              </CarouselItem>
            ))}
          </CarouselSlides>

          {/* Carousel Controls */}
          <CarouselControl>
            <CarouselButtons>
              <CarouselPrevButton />
              <CarouselNextButton />
            </CarouselButtons>
            <CarouselIndicators />
          </CarouselControl>
        </Carousel>
      </Container>

      {/* Flash Sale Section */}
      <Container maxWidth="xl" className="py-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography variant="h5" className="font-bold mb-2">
              Today's
            </Typography>
            <Typography variant="h4" className="font-bold text-c-warning">
              Flash Sales
            </Typography>
          </div>
          <div className="flex items-center gap-8 dark:text-d-secondary">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <Typography variant="h6" className="font-bold">
                  {timeLeft.days.toString().padStart(2, '0')}
                </Typography>
                <div color="textSecondary">
                  Days
                </div>
              </div>
              <Typography variant="h6" className="font-bold">
                :
              </Typography>
              <div className="text-center">
                <Typography variant="h6" className="font-bold">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </Typography>
                <div className="dark:text-d-secondary">
                  Hours
                </div>
              </div>
              <Typography variant="h6" className="font-bold">
                :
              </Typography>
              <div className="text-center">
                <Typography variant="h6" className="font-bold">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </Typography>
                <div className="dark:text-d-secondary">
                  Minutes
                </div>
              </div>
              <Typography variant="h6" className="font-bold">
                :
              </Typography>
              <div className="text-center">
                <Typography variant="h6" className="font-bold">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </Typography>
                <div className="dark:text-d-secondary">
                  Seconds
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <IconButton className="border border-gray-200 hover:border-d-secondary dark:hover:text-d-secondary dark:text-d-primary">
                <ArrowBackIcon />
              </IconButton>
              <IconButton className="border border-gray-200 hover:border-d-secondary dark:hover:text-d-secondary dark:text-d-primary">
                <ArrowForwardIcon />
              </IconButton>
            </div>
          </div>
        </div>

        <Grid container spacing={3}>
          {productGreatDeals && productGreatDeals.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} isFlashSale={true} />
            </Grid>
          ))}
        </Grid>
        <ViewButton link="/products/flash-sale" text="View All Products" />
      </Container>

      {/* Featured Products Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <Container maxWidth="xl" className="py-8">
          <Typography variant="h5" className="font-bold pb-4">
            Featured Products
          </Typography>
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          <ViewButton link="/products" text="View All Products" />
        </Container>
      )}
    </div>
  );
};

export default Home;
