import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Container,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  Box,
  MenuItem,
  Alert
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCart } from '../hooks/useCart';
import CartItemSkeleton from '../components/skeletons/CartItemSkeleton';
import { useCheckout } from '../hooks/useCheckout';
import { useNavigate } from 'react-router-dom';
import { Button as Button2 } from 'keep-react';
import { Trash } from 'phosphor-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, updateCartItemQuantity, removeFromCart, fetchCart, clearCart, success } = useCart();
  const { checkout, setCheckout } = useCheckout();
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');
  const [cartItem, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(cartItems);
  }, [cartItems]);  

  const calculateTotal = () => {
    return cartItems.filter(item => item.checked).reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return cartItems.filter(item => item.checked).reduce((total, item) => total + (item.product.price * item.quantity * (item.product.discount / 100)), 0);
  };

  const calculateTax = () => {
    return cartItems.filter(item => item.checked).reduce((total, item) => total + (item.product.price * item.quantity * 0.18), 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotal() - calculateDiscount() + calculateTax();
  };

  const calculateFreeShipping = () => {
    return calculateGrandTotal() - 1000;
  };

  const handleQuantityChange = async (productId, itemId, newQuantity, method) => {
    if (newQuantity >= 1) {
      const isIncrease = method === "add";
      await updateCartItemQuantity(productId, itemId, 1, isIncrease);
    }
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const shortString = (s) => {
    // wrap the string if it's longer than 100 characters
    if (s.length > 100) {
      return s.substring(0, 100) + '...';
    }
    return s;
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleApplyPromoCode = () => {
    if (promoCode === "SAVE20") {
      console.log("Promo code applied successfully!");
    } else {
      setError("Invalid promo code");
    }
  };

  const handlePromoCodeChange = (event) => {
    setPromoCode(event.target.value);
  };

  const handlePromoCodeApply = () => {
    // Add your logic here to apply the promo code
  };

  const handleItemCheck = (e, cartId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cart_id === cartId ? { ...item, checked: e.target.checked } : item
      )
    );
  };

  const countSelectedItems = () => {
    return cartItem.filter((item) => item.checked).length;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItem.length === 0) {
      setError('Your cart is empty');
      return;
    }
    const selectedCartItems = cartItem.filter((item) => item.checked);
    if (selectedCartItems.length === 0) {
      setError('Please select at least one item to checkout');
      return;
    }
    // initialize checkout
    setCheckout({
      cart_items: selectedCartItems
    });
    setTimeout(() => {
      navigate('/checkout');
    }, 0);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Typography variant="h4" className="mb-6">My Cart</Typography>
        {[1, 2, 3].map((i) => (
          <CartItemSkeleton key={i} />
        ))}
      </Container>
    );
  }

  if (!cartItems.length) {
    return (
      <Container maxWidth="xl" className="py-8 z-0">
        <div className=" flex flex-col items-center justify-between py-8">
          <div className="w-[48%]">
            <img
              src={`https://media.istockphoto.com/id/1250686842/vector/shopping-online-on-website-or-mobile-application-vector-illustration.jpg?s=612x612&w=0&k=20&c=HmhTjcgp-knRJMNWadcE9qweSnY_GniodtVEk11p0wc=`}
              className="w-full h-full object-cover rounded-lg border"
            />
          </div>
          <div className="text-center w-[48%] mt-8">
            <Typography variant="h6" className="mb-4 text-center font-semibold fs-4 text-l-primary dark:text-d-secondary mb-4">
              Your cart is empty
            </Typography>
            <Link
              to="/products"
              className="w-fit inline-block mt-4 px-6 py-2 bg-charcoal text-white rounded-sm hover:bg-primary-600 transition-colors duration-300 ease-in-out border border-l-border hover:border-primary-600"
            >
              <span className="mr-2">🛒</span>
              Continue Shopping
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" className="py-4 dark:text-d-primary">My Cart</Typography>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between">
            <Typography variant="h6" className="mb-4 dark:text-d-secondary">Cart Items</Typography>
            <div className="flex gap-2 items-center">
              {cartItem && (
                <div className="lg:col-span-2 space-y-4">
                  <input
                    type="checkbox"
                    id="selectAll"
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out cursor-pointer border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                    checked={cartItem.every((item) => item.checked)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setCartItems(
                        cartItem.map((item) => ({
                          ...item,
                          checked: isChecked,
                        }))
                      );
                    }}
                  />
                  <label htmlFor="selectAll" className="ml-2 font-medium dark:text-d-secondary">
                    Selected Items: {countSelectedItems()} / {cartItem.length}
                  </label>
                </div>
              )}
              <div className="ml-2 flex items-center gap-2">
                <Button2 onClick={() => handleClearCart()} variant="outline" color='error' >
                  <Trash className='w-5 h-5 mr-2'/> Clear Cart
                </Button2>
              </div>
            </div>
          </div>
          {cartItem.map((item) => (
            <div key={item.cart_id} className={`flex items-center gap-4 p-4 rounded-lg shadow-sm border text-l-primary border-l-border dark:border-d-border bg-l-boxBg dark:bg-d-boxBg`}>
              <input
                type="checkbox"
                id={`item-${item.cart_id}`}
                checked={item.checked} 
                onChange={(e) => handleItemCheck(e, item.cart_id)} 
                className="mr-2 h-4 w-4 text-blue-600 transition duration-150 ease-in-out cursor-pointer border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
              />

              <div className="flex gap-4 justify-between items-center w-full" 
              >
                <div className="w-24 h-24">
                  <img
                    src={`http://via.placeholder.com/200x200?text=${item.product.name}`}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg border cursor-pointer"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  />
                </div>

                <div className="flex items-center p-2 flex-1 dark:text-d-secondary">
                  <div className="flex justify-between flex-col w-4/5">
                    <div>
                      <Typography variant="subtitle1" className="font-medium">
                        {item.product.name}
                      </Typography>
                      <Typography variant="subtitle2" className="font-medium">
                        {shortString(item.product.description)}
                      </Typography>
                      {item.size && (
                        <Typography variant="body2" className="mb-2">
                          Size: {item.size}
                        </Typography>
                      )}
                      {item.color && (
                        <Typography variant="body2">
                          Color: {item.color}
                        </Typography>
                      )}
                    </div>                    
                    <div className="flex items-center gap-4 mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border rounded-sm">
                        <button
                          className="px-3 py-1 hover:bg-gray-100"
                          onClick={() => handleQuantityChange(item.product.id, item.cart_id, item.quantity - 1, "subtract")}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x">{item.quantity}</span>
                        <button
                          className="px-3 py-1 hover:bg-gray-100"
                          onClick={() => handleQuantityChange(item.product.id, item.cart_id, item.quantity + 1, "add")}
                        >
                          +
                        </button>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <IconButton
                          size="small"
                          color="error"
                          className="text-c-danger hover:text-c-danger"
                          onClick={() => handleRemoveItem(item.cart_id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="success"
                          className="text-c-success hover:text-c-success"
                          // onClick={() => handleWishlist(item.product.id)}
                        >
                          <FavoriteBorderIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end w-1/5">
                  <Typography variant="body1" className="font-bold">
                      ₹{(item.product.price).toFixed(2)} * {item.quantity}
                    </Typography>
                    <Typography variant="body1" className={`${item.product.discount > 0 ? "line-through font-semibold" : "font-bold"}`}>
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                    {item.product.discount > 0 ? (
                      <span className="font-semibold text-c-success">
                        -{item.product.discount}%
                      </span>
                    ) : (
                      <span className="font-semibold">
                        0%
                      </span>
                    )}
                    {item.product.discount > 0 ? (
                      <Typography variant="h6" className="font-semibold">
                        ₹{(item.product.price * item.quantity * (1 - item.product.discount / 100)).toFixed(2)}
                      </Typography>
                    ) : (
                      <Typography variant="h6" className="font-semibold">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-4 lg:col-span-1 dark:text-d-primary">
          <div className={`p-6 rounded-lg shadow-sm bg-l-boxBg dark:bg-d-boxBg border border-l-border dark:border-d-border`}>
            <Typography variant="h6" className="mb-4">
              Order Summary
            </Typography>

            {/* Promo Code */}
            <div className="mb-6">
              <Typography variant="subtitle2" className="mb-2">
                Enter Promo Code
              </Typography>
              <div className="flex gap-2">
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-gray-100 dark:bg-l-boxBg"
                />
                <Button2
                  variant="outline"
                  className='bg-c-info/20 border-c-info dark:text-c-info dark:bg-c-info/20 dark:border-c-info'
                >
                  Submit
                </Button2>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Cost Breakdown */}
            <div className="space-y-3 mb-2">
              <div className="flex justify-between">
                <Typography>Shipping cost</Typography>
                <Typography>TBD</Typography>
              </div>
              <div className="flex justify-between">
                <Typography>Discount</Typography>
                <Typography>- ₹{calculateDiscount().toFixed(2)}</Typography>
              </div>
              <div className="flex justify-between">
                <Typography>Tax (18%)</Typography>
                <Typography>+ ₹{calculateTax().toFixed(2)}</Typography>
              </div>
              <Divider className="my-4" />
              <div className="flex justify-between font-bold">
                <Typography variant="h6">Estimated Total</Typography>
                <Typography variant="h6">₹{calculateGrandTotal().toFixed(2)}</Typography>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              variant="contained"
              fullWidth
              className={`mt-6 bg-primary-500 hover:bg-primary-600 text-white 
                dark:bg-d-primary-500 dark:hover:bg-d-primary-600
                ${countSelectedItems() === 0 ? "dark:!text-white dark:!bg-gray-500" : ""}`}
              disabled={countSelectedItems() === 0}
              onClick={handleCheckout}
            >
              Proceed to Checkout ({countSelectedItems()} items)
            </Button>

            {/* Free Shipping Notice */}
            <Box className={`mt-4 p-3 bg-gray-50 rounded-lg dark:bg-l-boxBg dark:text-l-primary ${calculateFreeShipping().toFixed(2) > 0 ? "dark:bg-c-success bg-c-success text-l-primary dark:!text-d-primary " : ""}`}>
              <Typography variant="body2" align="center">
                You're ₹{calculateFreeShipping().toFixed(2) > 0 ? "0.00" : calculateFreeShipping().toFixed(2)} away from free shipping!
              </Typography>
            </Box>
            {error && <Alert severity="error" className='mt-4'>{error}</Alert>}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Cart;
