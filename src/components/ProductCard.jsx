import React from 'react';
import { Card, CardContent, Typography, Rating, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import {CustomProductTypography} from "../commons/customTypography.jsx";
import { toast, Toaster } from 'react-hot-toast';

const ProductCard = ({ product, isFlashSale = false, callback = null }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();


  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      const result = await addToCart(product.id, 1);
      if (callback) {
        if (result.success) {
          callback(1,result.message);
        } else {
          callback(0, result.error);
        }
      } else {
        if (result.success) {
          console.log(result.message);
        } else {
          console.error(result.error);
        }
      }
      if (result.success) {
        toast.success(result.message, {
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
          position: 'bottom-right',
        });
      } else {
        toast.error(result.error, {
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
      if (callback) {
        callback(0, error.message);
      } else {
        console.error(error.message);
      }
      toast.error(error.message, {
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

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    try {
      await addToWishlist(product.id);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <Card 
      className="relative group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg bg-l-boxBg dark:bg-d-boxBg border border-l-border dark:border-d-border transition-all duration-300 ease-in-out font-poppins"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {/* Discount Badge */}
      {product.discount > 0 && (
        <span className="absolute top-4 right-4 text-white bg-red-500 border border-red-500 text-sm px-2 py-1 z-10 font-semibold rounded-md">
          -{product.discount}% off
        </span>
      )}
      
      {/* Quick Action Buttons */}
      <div className={`absolute ${ product.discount > 0 ? 'top-16' : 'top-4' } right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
        <IconButton 
          className={`w-8 h-8 bg-white ${isInWishlist ? 'text-cta-bg' : 'text-charcoal'} hover:text-white transition-colors`}
          onClick={handleAddToWishlist}
        >
          <FavoriteIcon className="w-5 h-5" />
        </IconButton>
        <IconButton 
          className="w-8 h-8 bg-white text-charcoal hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
        >
          <VisibilityIcon className="w-5 h-5" />
        </IconButton>
      </div>

      {/* Product Image */}
      <div className="relative pt-[100%] dark:bg-d-boxBg">
        <img
          // src={`http://via.placeholder.com/200x200?text=${product.name}`}
          src={`https://picsum.photos/200/200?random=${product.id}`}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4 pt-2 font-poppins">
        {/* Product Name */}
        <div className="font-medium dark:text-d-primary">
          {product.name}
        </div>

        {/* Price and Rating */}
        <div className="mt-2 flex justify-between items-center dark:text-d-secondary dark:hover:text-d-secondary">
          <div className="flex items-center gap-2">
            <div className="text-l-primary font-semibold dark:text-d-secondary">
              ₹{discountedPrice.toFixed(2)}
            </div>
            {product.discount > 0 && (
              <div className="text-gray-500 line-through" >
                ₹{product.price.toFixed(2)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Rating value={product.rating || 0} readOnly size="small" className="text-yellow-400" />
            <CustomProductTypography variant="body2" color="textSecondary" hoverColor="textSecondary">
              ({product.reviews || 0})
            </CustomProductTypography>
          </div>
        </div>

        {/* Stock Progress Bar for Flash Sale */}
        {isFlashSale && product.stock_percentage !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-ctaBg h-2 rounded-full transition-all duration-300" 
                style={{ width: `${product.stock_percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          className={`w-full mt-4 py-2 bg-black text-white rounded-sm dark:bg-d-primary dark:text-d-boxBg dark:hover:bg-d-ctaText transition-colors text-sm font-medium ${product.in_stock ? '' : '!text-c-danger dark:text-c-danger opacity-50 cursor-not-allowed'}`}
          onClick={handleAddToCart}
          disabled={!product.in_stock}
        >
          {product.in_stock? 'Add to Cart' : 'Sold Out'}
        </button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;