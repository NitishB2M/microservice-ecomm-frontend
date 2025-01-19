import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import {
  AppBar, Toolbar, IconButton, Typography, Badge, Box, Menu, MenuItem,
  ListItemIcon, ListItemText, InputBase, Divider, Avatar, Tooltip
} from '@mui/material';
import { Button } from "keep-react";
import { ShoppingCart, Heart } from 'phosphor-react';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const categories = [
  {
    name: "Fashion",
    items: [
      { name: "Women's Fashion", path: '/products/womens-fashion' },
      { name: "Men's Fashion", path: '/products/mens-fashion' },
      { name: "Kids Fashion", path: '/products/kids-fashion' },
      { name: "Accessories", path: '/products/accessories' },
      { name: "Footwear", path: '/products/footwear' },
      { name: "Jewelry", path: '/products/jewelry' },
    ]
  },
  {
    name: "Electronics",
    items: [
      { name: "Smartphones", path: '/products/smartphones' },
      { name: "Laptops", path: '/products/laptops' },
      { name: "Gaming", path: '/products/gaming' },
      { name: "Accessories", path: '/products/electronics-accessories' },
      { name: "Audio", path: '/products/audio' },
      { name: "Cameras", path: '/products/cameras' },
    ]
  },
  {
    name: "Home & Living",
    items: [
      { name: "Furniture", path: '/products/furniture' },
      { name: "Decor", path: '/products/decor' },
      { name: "Kitchen", path: '/products/kitchen' },
      { name: "Bath", path: '/products/bath' },
      { name: "Lighting", path: '/products/lighting' },
      { name: "Storage", path: '/products/storage' },
    ]
  },
  {
    name: "Beauty",
    items: [
      { name: "Makeup", path: '/products/makeup' },
      { name: "Skincare", path: '/products/skincare' },
      { name: "Haircare", path: '/products/haircare' },
      { name: "Fragrances", path: '/products/fragrances' },
      { name: "Personal Care", path: '/products/personal-care' },
      { name: "Tools", path: '/products/beauty-tools' },
    ]
  }
]

const Navbar = () => {
  const { cartItemsCount } = useCartContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, profileLoading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        '&.MuiAppBar-root': {
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }
      }}
      className={`dark:bg-d-background bg-l-primary bg-opacity-70 border-b border-l-border dark:border-d-border`}
    >
      {profileLoading ? (
        <NavbarSkeleton />
      ) : (
        <Toolbar className="justify-between py-2">
          <NavLink to="/" className="no-underline">
            <Typography variant="h5" className={`font-bold transition-colors duration-500 ease-in-out ${activePath === '/'
                ? 'text-c-info dark:text-c-info'
                : 'text-l-primary dark:text-d-primary hover:text-c-info/80 dark:hover:text-c-info/80'
              }`}>
              Exclusive
            </Typography>
          </NavLink>

          <Box className="flex items-center space-x-4 md:space-x-8">
            <NavLink to="/products" className="no-underline">
              <div className={` transition-colors duration-500 ease-in-out ${activePath === '/products'
                  ? 'text-c-info dark:text-c-info'
                  : 'text-l-primary dark:text-d-primary hover:text-c-info/80 dark:hover:text-c-info/80'
                }`}>
                Shop
              </div>
            </NavLink>
            <NavLink to="/about" className="no-underline">
              <div className={`transition-colors duration-500 ease-in-out ${activePath === '/about'
                  ? 'text-c-info dark:text-c-info'
                  : 'text-l-primary dark:text-d-primary hover:text-c-info/80 dark:hover:text-c-info/80'
                }`}>
                About Us
              </div>
            </NavLink>

            {/* <Dropdown
            title="Categories"
            icon={<ArrowDropDownIcon />}
            className="text-l-primary dark:text-d-primary hover:text-l-hover dark:hover:text-d-hover"
          >
            {categories.map((category) => (
              <Dropdown.Item key={category.name}>
                {category.name}
                <Dropdown.Submenu>
                  {category.items.map((item) => (
                    <Dropdown.Item key={item.name} onClick={() => navigate(item.path)}>
                      {item.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Submenu>
              </Dropdown.Item>
            ))}
          </Dropdown> */}
            {/* user?.role?.active_role?.permissions?.includes('manage_products') future implementation */}
            {user && Object.keys(user).length > 0 ? user?.role?.active_role?.role === 'seller' ? (
              <Link to="/manage-products" className="no-underline">
                <div className={`transition-colors duration-500 ease-in-out ${activePath === '/manage-products'
                    ? 'text-c-info dark:text-c-info'
                    : 'text-l-primary dark:text-d-primary hover:text-c-info/80 dark:hover:text-c-info/80'
                  }`}>
                  Manage Products
                </div>
              </Link>
            ) : null : null}
          </Box>

          <Box className="flex items-center space-x-4">
            <IconButton
              onClick={toggleTheme}
              className="text-l-primary dark:text-d-primary hover:text-l-hover dark:hover:text-d-hover"
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-l-primary dark:text-d-primary z-10" />
              <InputBase
                placeholder="What are you looking for?"
                className="pl-10 pr-4 py-2 bg-l-boxBg dark:bg-d-boxBg dark:text-d-primary rounded-md w-64 dark:text-d-primary dark:border-d-gray-700 border border-l-border focus:border-l-primary dark:focus:border-d-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>

            {user && Object.keys(user).length > 0 ? (
              <>
                <IconButton
                  component={Link}
                  to="/wishlist"
                  className="text-l-primary dark:text-d-primary hover:text-l-hover dark:hover:text-d-hover"
                >
                  <Badge badgeContent={cartItemsCount} color="error">
                    <Heart className={`transition-colors duration-500 ease-in-out ${activePath === '/wishlist'
                      ? 'text-c-info dark:text-c-info'
                      : 'text-l-primary dark:text-d-primary hover:text-c-info/80 dark:hover:text-c-info/80'
                    }`} 
                    weight={`${activePath === '/wishlist' ? 'fill' : 'regular'}`}
                    />
                  </Badge>
                </IconButton>

                <IconButton
                  component={Link}
                  to="/cart"
                  className="text-l-primary dark:text-d-primary hover:text-l-hover dark:hover:text-d-hover"
                >
                  <Badge badgeContent={cartItemsCount} color="error">
                    <ShoppingCart className={`transition-colors duration-500 ease-in-out ${activePath === '/cart'
                    ? 'text-c-info dark:text-c-info'
                    : 'text-l-primary dark:text-d-primary hover:text-c-info/80 dark:hover:text-c-info/80'
                  }`}
                  weight={`${activePath === '/cart' ? 'fill' : 'regular'}`}
                  />
                  </Badge>
                </IconButton>

                <Tooltip title={`${user?.first_name} ${user.last_name}`}>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    className={`text-l-primary dark:text-d-primary hover:text-l-hover dark:hover:text-d-hover ${activePath === '/profile'
                      ? 'text-c-info dark:text-c-info'
                      : 'text-l-primary dark:text-d-primary hover:text-c-info/80 dark:hover:text-c-info/80'
                    }`}
                  >
                    <Avatar className="bg-l-primary dark:bg-d-primary text-l-primary dark:text-d-background">
                      {getInitials(user.first_name, user.last_name)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  className="mt-2"
                  PaperProps={{
                    elevation: 0,
                    className: "bg-l-background dark:bg-d-background shadow-lg rounded-lg"
                  }}
                >
                  <Box className="px-4 py-3">
                    <Typography className="text-l-primary dark:text-d-primary font-medium">
                      Hello, {user.first_name} 👋
                    </Typography>
                  </Box>
                  <Divider className="bg-l-border dark:bg-d-border" />
                  <MenuItem
                    component={Link}
                    to="/profile"
                    className="text-l-primary dark:text-d-primary hover:bg-l-accent/10 dark:hover:bg-d-accent/10"
                  >
                    <ListItemIcon>
                      <AccountCircleIcon className="text-l-primary dark:text-d-primary" />
                    </ListItemIcon>
                    <ListItemText primary="Manage My Account" />
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/orders"
                    className="text-l-primary dark:text-d-primary hover:bg-l-accent/10 dark:hover:bg-d-accent/10"
                  >
                    <ListItemIcon>
                      <LocalShippingIcon className="text-l-primary dark:text-d-primary" />
                    </ListItemIcon>
                    <ListItemText primary="My Orders" />
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/cancellations"
                    className="text-l-primary dark:text-d-primary hover:bg-l-accent/10 dark:hover:bg-d-accent/10"
                  >
                    <ListItemIcon>
                      <CancelIcon className="text-l-primary dark:text-d-primary" />
                    </ListItemIcon>
                    <ListItemText primary="My Cancellations" />
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/reviews"
                    className="text-l-primary dark:text-d-primary hover:bg-l-accent/10 dark:hover:bg-d-accent/10"
                  >
                    <ListItemIcon>
                      <StarIcon className="text-l-primary dark:text-d-primary" />
                    </ListItemIcon>
                    <ListItemText primary="My Reviews" />
                  </MenuItem>
                  <Divider className="bg-l-border dark:bg-d-border" />
                  <MenuItem
                    onClick={handleLogout}
                    className="text-l-primary dark:text-d-primary hover:bg-l-accent/10 dark:hover:bg-d-accent/10"
                  >
                    <ListItemIcon>
                      <LogoutIcon className="text-l-primary dark:text-d-primary" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                className="bg-link hover:bg-link/80 w-full"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>)}
    </AppBar>
  );
};

export default Navbar;
