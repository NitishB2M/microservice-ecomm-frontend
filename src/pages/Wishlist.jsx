import { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  CardMedia, Button, Rating, IconButton, Box,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const response = await fetch('http://localhost:8081/user/wishlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setWishlistItems(data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await fetch(`http://localhost:8081/user/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWishlistItems(items => items.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = async (product) => {
    await addToCart(product);
    removeFromWishlist(product.id);
  };

  if (!user) {
    return (
      <Container maxWidth="lg" className="py-8 text-center">
        <Typography variant="h5" className="mb-4">
          Please login to view your wishlist
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          color="primary"
        >
          Login
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[50vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Container maxWidth="lg" className="py-8 text-center">
        <Typography variant="h5" className="mb-4">
          Your wishlist is empty
        </Typography>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          color="primary"
          startIcon={<ShoppingCartIcon />}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        My Wishlist ({wishlistItems.length} items)
      </Typography>

      <Grid container spacing={4}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
                className="h-48 object-cover"
              />
              <CardContent className="flex-grow">
                <Typography variant="h6" className="mb-2">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-2">
                  {item.description}
                </Typography>
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="h6" color="primary">
                    ${item.price}
                  </Typography>
                  <Rating value={item.rating} readOnly size="small" />
                </div>
                <div className="flex justify-between mt-2">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(item)}
                    fullWidth
                    className="mr-2"
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Wishlist;
