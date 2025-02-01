import { useState, useCallback, useEffect } from 'react';

const CART_API = 'http://localhost:8082/user/cart';
const PRODUCT_API = 'http://localhost:8081/product';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const checkTokenExistence = () => {
    const token = localStorage.getItem('token');
    
    if (token && token.length > 0) {
      return { token, isValid: true };
    }
    setError('Please login first');
    return { token: '', isValid: false };
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    const { token, isValid } = checkTokenExistence();
    if (!isValid) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${CART_API}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok && result && result.data) {
        if (result.data.items === null || result.data.items.length === 0) {
          setSuccess('Your cart is empty');
          setCartItems([]);
          setError('');
          setCartItemsCount(0);
        } else {
          const items = result?.data?.items || [];
          setCartItems(items);
          setCartItemsCount(items.length);
          setError('');
        }
      } else {
        setError(result.error || 'Failed to fetch cart.');
        setCartItems([]);
        setCartItemsCount(0);
      }
    } catch (error) {
      setError('Error fetching cart');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity) => {
    const { token, isValid} = checkTokenExistence();
    if (!isValid) {
      return { success: false, error: 'You are not logged in, please login first' };
    }
    try {
      const payload = {
        items: [
          {
            product_id: productId,
            quantity: quantity,
          }
        ]
      };
      console.log(payload);
      const response = await fetch(`${CART_API}/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        setCartItemsCount((prevCount) => prevCount + 1);
        setSuccess('Product added to cart successfully.');
        // await fetchCart();
        const pResp = await updateProductQuantity(
          productId,
          quantity,
          'subtract'
        )
        if (!pResp.success) {
          setError(pResp.error);
          return { success: false, error: pResp.error};
        } else {
          return { success: true, message: result.message || 'Product added to cart successfully' };
        }
      } else {
        setError(result.error || 'Failed to add to cart.');
        return {
          success: false,
          error: result.error || 'Unknown error occurred',
          errorDetails: result.errorDetails || [],
        };
      }
    } catch (error) {
      setError('Error adding to cart');
      return { success: false, error: 'Error adding to cart' };
    }
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    const { token, isValid } = checkTokenExistence();
    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${CART_API}/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        setCartItems([]);
        setCartItemsCount(0);
        setSuccess('Cart cleared successfully.');
      } else {
        if (result.extra && result.extra.active_cart_length !== result.extra.total_cart_length) {
          setCartItemsCount(result.extra.active_cart_length);
          await fetchCart();
          return;
        }
        setError(result.error || 'Failed to clear cart.');
      }
    } catch (error) {
      setError('Error clearing cart');
    } finally {
      setTimeout(() => {
        setError('');
        setLoading(false);
      }, 1000);
    }
  }, [fetchCart]);

  const updateProductQuantity = useCallback(async (productId, quantity, method) => {
    try {
      const { token, isValid } = checkTokenExistence();
      if (!isValid) {
        setError('Please login to add items to cart');
        setLoading(false);
        return;
      }

      const response = await fetch(`${PRODUCT_API}/${productId}/update-quantity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity, method })
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        if (errorResponse.error && errorResponse.error.includes('out of stock')) {
          throw new Error('Product is out of stock');
        } else if (errorResponse.error && errorResponse.error.includes('invalid or expired token')) {
          throw new Error('Please login to add product to cart');
        } else {
          throw new Error('Failed to add item into cart');
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating product quantity:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const updateCartItemQuantity = useCallback(async (productId, cartId, quantity, isIncrease) => {
    setLoading(true);
    try {
      const { token, isValid } = checkTokenExistence();
      if (!isValid) {
        setError('Please login to add items to cart');
        setLoading(false);
        return;
      }
      // First update product quantity
      // await updateProductQuantity(
      //   productId,
      //   Math.abs(quantity),
      //   isIncrease ?  'subtract' : 'add'
      // );

      // Then update cart
      const response = await fetch(`${CART_API}/${cartId}/update/qty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          method: isIncrease ?  "add" : "subtract",
          quantity: Math.abs(quantity)
        })
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess('Cart updated successfully');
        await fetchCart();
      } else {
        setError(result.error || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      setError('Error updating cart quantity');
    }
    setLoading(false);
  }, [fetchCart, updateProductQuantity]);

  const removeFromCart = useCallback(async (cartId) => {
    setLoading(true);
    const { token, isValid } = checkTokenExistence();
    if (!isValid) {
      setError('Please login to add items to cart');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${CART_API}/${cartId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const result = await response.json();
      if (response.ok) {
        setSuccess('Item removed from cart');
        await fetchCart();
      } else {
        setError(result.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Error removing item from cart');
    }
    setLoading(false);
  }, [fetchCart]);

  const clearErrorMessages = useCallback((v) => {
    if (v) {
      setTimeout(() => {
        setError('');
      }, v * 1000);
    } else {
      setError('');
    }
  }, []);

  const clearSucccessMessages = useCallback((v) => {
    if (v) {
      setTimeout(() => {
        setSuccessMessage('');
      }, v * 1000);
    } else {
      setSuccessMessage('');
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    loadCart();
  }, []);
  return {
    cartItems,
    cartItemsCount,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchCart,
    addToCart,
    removeFromCart,
    updateProductQuantity,
    updateCartItemQuantity,
    clearCart,
    clearErrorMessages,
    clearSucccessMessages,
  };
};
