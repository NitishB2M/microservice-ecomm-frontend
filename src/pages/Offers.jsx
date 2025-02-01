import { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  CardMedia, Button, Chip, Box, CircularProgress,
  Rating
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:8081/products/offers');
      const data = await response.json();
      setOffers(data.data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await fetch('http://localhost:8081/user/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId })
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[50vh]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        Special Offers
      </Typography>

      {offers.length === 0 ? (
        <Typography variant="h6" className="text-center text-gray-500">
          No special offers available at the moment
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {offers.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card 
                className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative">
                  <CardMedia
                    component="img"
                    height="200"
                    image={`https://via.placeholder.com/300?text=${encodeURIComponent(product.product_name)}`}
                    alt={product.product_name}
                    className="h-48 object-cover"
                  />
                  <Chip
                    label={`${product.discount}% OFF`}
                    color="error"
                    className="absolute top-2 right-2"
                  />
                </div>
                <CardContent className="flex-grow">
                  <Typography variant="h6" className="mb-2">
                    {product.product_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="mb-2">
                    {product.product_desc}
                  </Typography>
                  <div className="flex items-center justify-between mb-2">
                    <div className="gap-2 flex items-center">
                      <Typography variant="h6" color="primary" component="span">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="span"
                        className="ml-2 line-through"
                      >
                        ${product.price}
                      </Typography>
                    </div>
                    <Rating value={product.rating} readOnly size="small" />
                  </div>
                  <div className="flex justify-between mt-4 gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => addToCart(product)}
                      className="flex-grow mr-2"
                    >
                      Add to Cart
                    </Button> 
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => addToWishlist(product.id)}
                    >
                      <FavoriteIcon />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Offers;
