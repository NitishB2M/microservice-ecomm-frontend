import { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Button, TextField, Drawer, List,
  ListItem, ListItemText, Checkbox, Rating, Box, 
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useProduct } from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';
import { toast, Toaster } from 'react-hot-toast';
import {Button as Button2} from "keep-react";
import { ShoppingCart } from 'phosphor-react';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

const Products = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const [filterDrawer, setFilterDrawer] = useState(false);
  const { fetchProducts, productLoading, products, fetchFilteredProducts, productCategory: categories } = useProduct();
  const [filters, setFilters] = useState({
    name: '',
    category: [],
    brand: [],
    min_price: '',
    max_price: '',
    min_rating: '',
  });
  const searchParams = new URLSearchParams(location.search);
  useEffect(() => {
    const params = {};
    if (searchParams.has('search')) {
      params.name = searchParams.get('search');
    }
    setFilters(prev => ({ ...prev, ...params }));
    const filteredParams = searchParams.toString();
    if (filteredParams) {
      fetchFilteredProducts(`?${filteredParams}`);
    } else {
      fetchProducts();
    }
  }, [location.search, fetchFilteredProducts, fetchProducts]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      if (field === 'category') {
        const newCategories = [...prev.category];
        if (newCategories.includes(value)) {
          return { ...prev, category: newCategories.filter(cat => cat !== value) };
        } else {
          return { ...prev, category: [...newCategories, value] };
        }
      }
      if (field === 'brand') {
        const newBrands = [...prev.brand];
        if (newBrands.includes(value)) {
          return { ...prev, brand: newBrands.filter(brand => brand !== value) };
        } else {
          return { ...prev, brand: [...newBrands, value] };
        }
      }
      return {...prev,[field]: value}
    });
  };

  const applyFilters = () => {
    setFilterDrawer(false);
    const params = new URLSearchParams(filters).toString();
    fetchFilteredProducts(`?${params}`);
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      category: [],
      brand: [],
      min_price: '',
      max_price: '',
      min_rating: '',
    });
    setFilterDrawer(false);
    fetchProducts();
  };

  const handleAddToCartCallback = async (response, message) => {
    // console.log(response, message);
  };

  const handleClickOpen = () => {
    resetFilters();
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-bold">
          Products
        </Typography>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setFilterDrawer(true)}
          variant="outlined"
          className="border-primary text-primary hover:bg-primary/10"
        >
          Filters
        </Button>
      </div>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawer}
        onClose={() => setFilterDrawer(false)}
      >
        <Box className="w-80 p-4">
          <Typography variant="h6" className="mb-4">
            Filters
          </Typography>
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Search by name"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />

            <Typography variant="subtitle2" className="mb-2">
              Category
            </Typography>
            <List className="max-h-48 overflow-y-auto">
              {categories && categories.map((category) => { 
                if (!category?.entity_type || category?.entity_type !== 'category') return null;
                return(
                <ListItem
                  key={category?.entity_id}
                  dense
                  button
                  onClick={() => handleFilterChange('category', category?.entity_id)}
                >
                  <Checkbox
                    edge="start"
                    checked={filters.category.includes(category?.entity_id)} // Check if category is selected
                  />
                  <ListItemText primary={category?.entity_name} />
                </ListItem>
              )})}
            </List>
            
            <Typography variant="subtitle2" className="mb-2">
              Brand
            </Typography>
            <List className="max-h-48 overflow-y-auto">
              {categories && categories.map((category) => { 
                if (!category?.entity_type || category?.entity_type !== 'brand') return null;
                return(
                <ListItem
                  key={category?.entity_id}
                  dense
                  button
                  onClick={() => handleFilterChange('brand', category?.entity_id)}
                >
                  <Checkbox
                    edge="start"
                    checked={filters.brand.includes(category?.entity_id)} // Check if category is selected
                  />
                  <ListItemText primary={category?.entity_name} />
                </ListItem>
              )})}
            </List>

            <div className="space-y-2">
              <Typography variant="subtitle2">
                Price Range
              </Typography>
              <div className="flex gap-2">
                <TextField
                  label="Min"
                  type="number"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  size="small"
                />
                <TextField
                  label="Max"
                  type="number"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  size="small"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Typography variant="subtitle2">
                Minimum Rating
              </Typography>
              <Rating
                value={Number(filters.min_rating)}
                onChange={(_, value) => handleFilterChange('min_rating', value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="contained"
                onClick={applyFilters}
                fullWidth
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                onClick={resetFilters}
                fullWidth
              >
                Reset
              </Button>
            </div>
          </div>
        </Box>
      </Drawer>

      {/* Products Grid */}
      {productLoading ? (
        <div className="flex justify-center gap-4 items-center w-full">
          {/* <CircularProgress /> */}
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : (
        <Grid container spacing={3}>
          {products && products.length > 0 ? products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} callback={handleAddToCartCallback} />
            </Grid>
          )) : 
          <div className='flex justify-center flex-col items-center min-h-[400px] md:min-h-[500px] w-full'>
            <div className="mb-4">
              No products found.
            </div>
            <Button2 variant="outline" onClick={handleClickOpen}>
              <ShoppingCart /> &nbsp; Click here to refresh product
            </Button2>
          </div>
          }
        </Grid>
      )}
    </Container>
  );
};

export default Products;
