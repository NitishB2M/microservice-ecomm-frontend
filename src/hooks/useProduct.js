import { useState, useCallback, useEffect } from 'react';

const PRODUCT_API = 'http://localhost:8081/product';
const PRODUCTS_API = 'http://localhost:8081/products';

export const useProduct = () => {
  const checkTokenExistence = () => {
    const token = localStorage.getItem('token');
    if (token && token.length > 0) {
      return { token, isValid: true };
    }
    return { token: '', isValid: false };
  };
  // Data
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productGDLoading, setProductGDLoading] = useState(true); 
  const [productOfferLoading, setProductOfferLoading] = useState(true);
  const [productFeaturedLoading, setProductFeaturedLoading] = useState(true);

  // Errors
  const [productError, setProductError] = useState(null);
  const [productGDError, setProductGDError] = useState(null);
  const [productOfferError, setProductOfferError] = useState(null);
  const [productFeaturedError, setProductFeaturedError] = useState(null);

  // Success
  const [productSuccess, setProductSuccess] = useState(null);
  const [productGDSuccess, setProductGDSuccess] = useState(null);
  const [productOfferSuccess, setProductOfferSuccess] = useState(null);
  const [productFeaturedSuccess, setProductFeaturedSuccess] = useState(null);

  // Categories
  const [productCategory, setProductCategory] = useState([]);
  const [productBrand, setProductBrand] = useState([]);
  const [productGreatDeals, setProductGreatDeals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);

  const fetchProductCategories = useCallback(async () => {
    try {
      const response = await fetch(`${PRODUCT_API}s/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const result = await response.json();
      if(response.ok){
        if (result.data === null) {
          setProductCategory([]);
        } else {
          setProductCategory(result.data);
        }
      } else {
        setProductCategory([]);
      }
    } catch (err) {
      setProductCategory([]);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setProductLoading(true);
      await fetchProductCategories();
      const response = await fetch(`${PRODUCTS_API}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const result = await response.json();
      if(response.ok){
        setProductSuccess(result.message || "Products fetched successfully");
        if (result.data === null) {
          setProducts([]);
        } else {
          setProducts(result.data);
        }
      } else {
        setProductError(result.error);
      }
    } catch (err) {
      setProductError(err.message);
    } finally {
      setTimeout(() => {
        setProductLoading(false);
      }, 1000);
    }
  }, []);

  
  const fetchProductsForSeller = useCallback(async () => {
    try {
      const { token, isValid } = checkTokenExistence();
      if (!isValid) {
        setProductError('Please login first');
        setProductLoading(false);
        return { success: false, error: 'No token found' };
      }
      setProductLoading(true);
      await fetchProductCategories();
      const response = await fetch(`${PRODUCTS_API}/manage`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const result = await response.json();
      if(response.ok){
        setProductSuccess(result.message || "Products fetched successfully");
        if (result.data === null) {
          setProducts([]);
        } else {
          setProducts(result.data);
        }
      } else {
        setProductError(result.error);
      }
    } catch (err) {
      setProductError(err.message);
    } finally {
      setTimeout(() => {
        setProductLoading(false);
      }, 1000);
    }
  }, []);

  const fetchProductGreatDeals = useCallback(async () => {
    try {
      setProductGDLoading(true);
      const response = await fetch(`${PRODUCTS_API}/deals`);
      if (!response.ok) {
        throw new Error('Failed to fetch deals products');
      }
      const result = await response.json();
      if(response.ok){
        setProductGDSuccess(result.message || "Products fetched successfully");
        if (result.data === null) {
          setProductGreatDeals([]);
        } else {
          setProductGreatDeals(result.data);
        }
      } else {
        setProductGDError(result.error);
      }
    } catch (err) {
      setProductGDError(err.message);
    } finally {
      setProductGDLoading(false);
    }
  }, []);

  const fetchProductOffers = useCallback(async () => {
    try {
      setProductOfferLoading(true);
      const response = await fetch(`${PRODUCTS_API}/offers`);
      if (!response.ok) {
        throw new Error('Failed to fetch offers products');
      }
      const result = await response.json();
      if(response.ok){
        setProductOfferSuccess(result.message || "Products fetched successfully");
        if (result.data === null) {
          setOfferProducts([]);
        } else {
          setOfferProducts(result.data);
        }
      } else {
        setProductOfferError(result.error);
      }
    } catch (err) {
      setProductOfferError(err.message);
    } finally {
      setProductOfferLoading(false);
    }
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setProductFeaturedLoading(true);
      const response = await fetch(`${PRODUCTS_API}/featured`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      const result = await response.json();
      if(response.ok){
        setProductFeaturedSuccess(result.message || "Products fetched successfully");
        if (result.data === null) {
          setFeaturedProducts([]);
        } else {
          setFeaturedProducts(result.data);
        }
      } else {
        setProductFeaturedError(result.error);
      }
    } catch (err) {
      setProductFeaturedError(err.message);
    } finally {
      setProductFeaturedLoading(false);
    }
  }, []);

  const fetchFilteredProducts = useCallback(async (filteredParams) => {
    try {
      setProductLoading(true);
      const response = await fetch(`${PRODUCTS_API}/filter?${filteredParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch filtered products');
      }
      const result = await response.json();
      if(response.ok){
        setProductSuccess(result.message || "Products fetched successfully");
        if (result.data === null) {
          setProducts([]);
        } else {
          setProducts(result.data);
        }
      } else {
        setProductError(result.error);
      }
    } catch (err) {
      setProductError(err.message);
    } finally {
      setProductLoading(false);
    }
  }, []);

  const addProduct = useCallback( async(product) => {
    setProductLoading(true);
    try {
      const { token, isValid } = checkTokenExistence();
      if (!isValid) {
        setProductError('Please login first');
        setProductLoading(false);
        return { success: false, error: 'No token found' };
      }
      const response = await fetch(`${PRODUCT_API}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product),
      });
      const result = await response.json();
      if(response.ok){
        setProductSuccess(result.message || "Product added successfully");
        setProducts([...products, result.data]);
        await fetchProducts();
        return { success: true, message: result.message };
      } else {
        setProductError(result.error);
        return { success: false, error: result.error, message: result.message };
      }
    } catch (err) {
      setProductError(err.message);
      return { success: false, error: err.message, message: err.message };
    } finally {
      setProductLoading(false);
    }
  }, [fetchProducts]);

  const updateProduct = useCallback( async(product, productId) => {
    setProductLoading(true);
    try {
      const { token, isValid } = checkTokenExistence();
      if (!isValid) {
        setProductError('Please login first');
        setProductLoading(false);
        return { success: false, error: 'No token found' };
      }
      const response = await fetch(`${PRODUCT_API}/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const result = await response.json();
      if(response.ok){        
        setProductSuccess(result.message || "Product updated successfully");
        await fetchProducts();
        return { success: true, message: result.message };
      } else {
        setProductError(result.error);
        return { success: false, error: result.error, message: result.message };
      }
    } catch (err) {
      setProductError(err.message);
      return { success: false, error: err.message, message: err.message };
    } finally {
      setProductLoading(false);
    }
  }, [fetchProducts]);

  const loadProducts = useCallback(async () => {
    await fetchProducts();
    await fetchProductGreatDeals();
    await fetchProductOffers();
    await fetchFeaturedProducts();
  }, [fetchProducts, fetchProductGreatDeals, fetchProductOffers, fetchFeaturedProducts]);

  // useEffect(() => {
  //   fetchFeaturedProducts();
  //   fetchProductGreatDeals();
  //   fetchProductOffers();
  // }, [fetchFeaturedProducts, fetchProductGreatDeals, fetchProductOffers]);

  return {
    products,
    productCategory,
    featuredProducts,
    productGreatDeals,
    offerProducts,
    productLoading,
    productGDLoading,
    productOfferLoading,
    productFeaturedLoading,
    productError,
    productGDError,
    productOfferError,
    productFeaturedError,
    productSuccess,
    productGDSuccess,
    productOfferSuccess,
    productFeaturedSuccess,
    fetchProducts,
    fetchProductGreatDeals,
    fetchProductOffers,
    fetchFeaturedProducts,
    fetchFilteredProducts,
    fetchProductCategories,
    addProduct,
    updateProduct,
    loadProducts,
    fetchProductsForSeller
  };
}