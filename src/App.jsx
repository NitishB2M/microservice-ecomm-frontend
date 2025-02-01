import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme.js';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Orders from "./pages/Orders.jsx";
import Login from './pages/Login';
import Register from './pages/Signup';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Offers from './pages/Offers';
import Payment from './pages/Payment';
import About from './pages/About';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import PrivateRoute from './middleware/PrivateRoute';
import PaymentDemo from "./pages/PaymentDemo.jsx";
import PaymentSuccess from './components/payment/PaymentSuccess.jsx';
import PaymentCancel from './components/payment/PaymentCancel.jsx';
import ManageProducts from './pages/ManageProducts.jsx';
import NewPassword from './pages/NewPassword.jsx';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <CustomThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-l-background dark:bg-d-background/95 text-l-primary dark:text-d-primary font-poppins">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/products/filters" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/new-password" element={<NewPassword />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <PrivateRoute>
                      <Wishlist />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <PrivateRoute>
                      <PaymentDemo />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payment/success"
                  element={
                    <PrivateRoute>
                      <PaymentSuccess />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payment/cancel"
                  element={
                    <PrivateRoute>
                      <PaymentCancel />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/manage-products"
                  element={
                    <PrivateRoute>
                      <ManageProducts />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </CustomThemeProvider>
        </ThemeProvider>
  );
}

export default App;
