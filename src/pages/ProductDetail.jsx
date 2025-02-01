import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Rating,
  IconButton,
  Grid,
  Divider,
  Alert,
  Breadcrumbs,
  Box
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { useCart } from '../hooks/useCart';
import { toast, Toaster } from 'react-hot-toast';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbDivider
} from 'keep-react';
import ProductDetailsSkeleton from '../components/skeletons/ProductDetailsSkeleton';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, loading, updateCartItemQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('white');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8081/product/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      if (!data.data.in_stock) {
        console.log(data);
        setError('Product is out of stock');
        setProduct(data.data);
        return
      }
      setError(null);
      setProduct(data.data);
      if (data.data.colors?.length > 0) {
        setSelectedColor(data.data.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product');
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleQuantityChange = async (qty) => {
    if (quantity >= 1) {
      setQuantity((prevQuantity) => prevQuantity + qty);
    } else {
      setQuantity(1);
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await fetch('http://localhost:8081/user/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId: product.id }),
      });
      if (response.ok) {
        toast.success('Item added to wishlist successfully', {
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
          position: 'bottom-right',
        });
      } else {
        toast.error('Failed to add item to wishlist', {
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
          position: 'bottom-right',
        });
      }
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    const response = await addToCart(product.id, quantity);
    if (response.success) {
      toast.success(response.message, {
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        position: 'bottom-right',
      });

      setTimeout(() => {
        navigate('/cart');
      }, 2000);
    } else {
      toast.error(response.error, {
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        position: 'bottom-right',
      });
      setError(response.error);
      if (response.error.includes('out of stock')) {
        await fetchProduct();
      }
    }
  };

  const calculateTotal = () => {
    return product.price * quantity;
  };

  const acutualPrice = () => {
    return product.price;
  };

  const calculateDiscount = (discount) => {
    return acutualPrice() * quantity * (discount / 100);
  };

  const calculateSubtotal = () => {
    return calculateTotal();
  }

  const calculateTax = (tax) => {
    return calculateSubtotal() * (tax / 100);
  };

  const calculateGrandTotal = (tax, discount) => {
    return calculateSubtotal() + calculateTax(tax) - calculateDiscount(discount);
  };

  const handleImageSelect = (imageId) => {
    setSelectedImage(imageId);
  };

  const handleStyleFromOptions = (options) => {
    const style = {};
    try {
      const decodedOptions = JSON.parse(options);
      for (const [key, value] of Object.entries(decodedOptions)) {
        style[key] = value;
      }
      return style;
    } catch (error) {
      console.error("Invalid JSON string:", error);
      return null;
    }
  };

  useEffect(() => {
    if (product) {
      const updatedImages = product.images?.map(image => ({
        ...image,
        is_main: image.id === selectedImage
      }));
      
      setProduct(prev => ({
        ...prev,
        images: updatedImages
      }));
    }
  }, [selectedImage]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <Grid container spacing={6}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <div className="flex gap-4">
            <div className="w-24 space-y-4">
              {product?.images && product.images.length > 0 ? product.images.map((image, index) => (
                <div
                  key={image.id}
                  className={`border-2 rounded cursor-pointer text-sm ${image.is_main ? 'border-c-info' : 'border-gray-200'}`}
                  onClick={() => handleImageSelect(image.id)}
                >
                  <img
                    src={image.url}
                    alt={`${product.id} view ${index + 1}`}
                    className="w-full h-24 object-contain p-2"
                  />
                </div>
              )) : (
                <div className="w-full h-24 bg-gray-200 rounded p-4 flex items-center justify-center">
                  No images available
                </div>
              )}
            </div>
            {product?.images && product?.images.length > 0 ? (
              <div className="flex-1">
                {product?.images?.map((image, index) => {
                  // Display the selected or main image in large view
                  if (selectedImage === image.id || image?.is_main) {
                    return (
                      <img
                        key={image.id}
                        src={image.url || `https://picsum.photos/200/200?random=${product?.id + index}`}
                        alt={product?.name}
                        className="w-full h-[500px] object-contain border-2 border-gray-200 rounded p-4"
                      />
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="w-full h-[500px] bg-gray-200 rounded p-4 flex items-center justify-center">
                {/* via.placeholder */}
                <img src={`https://placehold.co/800x500?text=No+Image+Available&font=poppins`} alt="No Image Available" />
              </div>
            )}
          </div>
          {product?.attributes?.length > 0 && (
            <div className="flex flex-col gap-2 !mt-8 p-8 rounded-lg shadow-sm dark:bg-d-boxBg border border-l-border dark:border-d-border">
              <Typography variant="subtitle1" className="!mb-2">
                Specification:
              </Typography>
              <div className="">
                {product?.attributes?.length > 0 && product.attributes.map((attribute, index) => (
                  <>
                    <div key={index} className="p-2 flex gap-2 justify-between">
                      <span className="font-semibold text-gray-600">{attribute.name}</span>
                      <span className="font-semibold text-gray-600"> {attribute.value}</span>
                    </div>
                    <Divider className='my-2 dark:border-gray-600' />
                  </>
                ))}
              </div>
            </div>
          )}
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <div className="mb-2 text-2xl font-bold">
            {product.name}
          </div>
          <div className="mb-6 text-md font-medium text-l-secondary">
            {product.description}
          </div>
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex flex-row items-center gap-3">
              <div className="text-xl font-bold">
                ₹{product.discount
                  ? (product.price * (1 - product.discount / 100)).toFixed(2)
                  : product.price}
              </div>
              {product.discount > 0 && (
                <div className="text-md font-semibold line-through">
                  ₹{product.price}
                </div>
              )}
              <div className="text-md font-semibold text-green">
                (₹{product.discount}%)
              </div>
            </div>
            <div className="flex flex-row items-center">
              <Rating value={product.rating} className="!m-0 !p-0" onChange={(newValue) => console.log(newValue)} />
              <div className="ml-2">({product?.reviews} Reviews)</div>
            </div>
          </div>

          {/* Variants */}
          {product?.variants?.length > 0 && (
            <div className="mb-6 mt-4">
              <Typography variant="subtitle1" className="!mb-2">
                Variants:
              </Typography>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-2">
                  {product?.variants?.map((variant, index) => {
                    if (Object.keys(variant.options).length === 0 || !variant?.options) return null;
                    const options = JSON.parse(variant?.options);
                    const variantColor = options?.color;

                    return (
                      <div
                        key={variant?.id}
                        className="w-6 h-6 rounded-full"
                        style={{
                          backgroundColor: variantColor,
                          cursor: 'pointer',
                        }}
                        title={variant?.sku}
                        onClick={() => handleColorChange(variantColor)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Size */}
          {product?.sizes?.length > 0 && (
            <div className="mb-6">
              <Typography variant="subtitle1" className="mb-2">
                Size:
              </Typography>
              <div className="flex gap-2">
                {product?.sizes?.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'contained' : 'outlined'}
                    className={selectedSize === size ? 'bg-primary' : ''}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-6 mb-6 mt-4">
            <div className="flex items-center border rounded">
              <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity === 1}>
                <RemoveIcon className="text-l-secondary dark:!text-d-primary" />
              </IconButton>
              <Typography className="w-12 text-center">
                {quantity}
              </Typography>
              <IconButton onClick={() => handleQuantityChange(1)} disabled={!product.in_stock || quantity === 0}>
                <AddIcon className="text-l-secondary dark:!text-d-primary" />
              </IconButton>
            </div>

            <Button
              variant="contained"
              className="bg-primary hover:bg-primary-dark flex-1"
              onClick={handleAddToCart}
              disabled={loading || !product.in_stock || quantity === 0}
            >
              Add to Cart
            </Button>

            <IconButton className="border">
              <FavoriteIcon />
            </IconButton>
          </div>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          <div className="flex flex-col gap-4 lg:col-span-1 dark:text-d-primary">
            <div className={`p-6 rounded-lg shadow-sm dark:bg-d-boxBg border border-l-border dark:border-d-border`}>
              {/* Cost Breakdown */}
              <div className="space-y-3 my-2">
                <div className="flex justify-between">
                  <Typography>Price * Quantity ({quantity})</Typography>
                  <Typography>₹{product.price} * {quantity}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography>Subtotal</Typography>
                  <Typography>₹{calculateSubtotal().toFixed(2)}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography>Shipping cost</Typography>
                  <Typography>TBD</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography>Discount</Typography>
                  <Typography>- ₹{calculateDiscount(product.discount).toFixed(2)}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography>Tax ({product?.tax}%)</Typography>
                  <Typography>+ ₹{calculateTax(product.tax).toFixed(2)}</Typography>
                </div>
                <Divider className="my-4 dark:border-d-secondary" />
                <div className="flex justify-between font-bold">
                  <Typography variant="body1">Total</Typography>
                  <Typography variant="body1">₹{calculateGrandTotal(product.tax, product.discount).toFixed(2)}</Typography>
                </div>
              </div>
            </div>
          </div>
          {/* Delivery Info */}
          <div className="border rounded-lg p-4 space-y-4 mt-4">
            <div className="flex items-center gap-4">
              <LocalShippingIcon className="text-primary" />
              <div>
                <Typography variant="subtitle2">
                  Free Delivery
                </Typography>
                <Typography variant="caption" color="primary">
                  Enter your postal code for delivery availability
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AssignmentReturnIcon className="text-primary" />
              <div>
                <Typography variant="subtitle2">
                  Return Delivery
                </Typography>
                <Typography variant="caption" color="primary">
                  Free 30 Days Delivery Returns. Details
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductDetail;
