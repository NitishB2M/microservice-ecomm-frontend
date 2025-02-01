import { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Card, 
  TextField, MenuItem, Button, Chip
} from '@mui/material';
import {
  Modal,
  Button as KeepButton
} from "keep-react";

import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useOrders } from '../hooks/useOrder';

const Orders = () => {
  const { orders, fetchOrderItems } = useOrders();
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrderItems();
  }, []);

  const handleFilterChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
    });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const orderStatuses = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <ReceiptIcon fontSize="small" />;
      case 'shipped':
        return <LocalShippingIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" className="py-8 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="text-primary font-bold">
          My Orders
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setFilterDialogOpen(true)}
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          Filters
        </Button>
      </div>

      {/* Orders Grid */}
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card 
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-l-background dark:bg-d-background"
              onClick={() => handleViewOrder(order)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ReceiptIcon className="text-l-primary dark:text-d-primary" />
                    <Typography variant="h6" className="text-l-primary dark:text-d-primary">
                      Order #{order.order_id}
                    </Typography>
                    <Chip 
                      label={order.order_status}
                      className={getStatusColor(order.order_status)}
                    />
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    Ordered on {new Date(order.created_at).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="h6" className="text-l-primary dark:text-d-primary font-bold">
                    ₹{order.total_amount.toFixed(2)}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    className="mt-2 border-l-primary dark:border-d-primary text-l-primary dark:text-d-primary hover:bg-l-primary dark:hover:bg-d-primary hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle tracking
                    }}
                  >
                    Track Order
                  </Button>
                </div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter Modal */}
      <Modal
        size="lg"
        position="center"
        onClose={() => setFilterDialogOpen(false)}
        show={filterDialogOpen}
      >
        <Modal.Header>Filter Orders</Modal.Header>
        <Modal.Body>
          <div className="p-4">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Order Status"
                  value={filters.status}
                  onChange={handleFilterChange('status')}
                  sx={{
                    color: 'text.l.primary',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'text.l.primary' },
                    '& .MuiSelect-select': { color: 'text.l.primary' },
                    '& .MuiSelect-icon': { color: 'text.l.primary' },
                  }}
                >
                  {orderStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={handleFilterChange('dateFrom')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  value={filters.dateTo}
                  onChange={handleFilterChange('dateTo')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Amount"
                  value={filters.minAmount}
                  onChange={handleFilterChange('minAmount')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Amount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange('maxAmount')}
                />
              </Grid>
            </Grid>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <KeepButton
            size="sm"
            variant="outline"
            color="error"
            onClick={() => setFilterDialogOpen(false)}
          >
            Cancel
          </KeepButton>
          <KeepButton
            size="sm"
            color="info"
            onClick={() => {
              // Apply filters logic here
              setFilterDialogOpen(false);
            }}
          >
            Apply Filters
          </KeepButton>
        </Modal.Footer>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        size="xl"
        position="center"
        onClose={() => setSelectedOrder(null)}
        show={selectedOrder !== null}
      >
        <Modal.Header>Order Details</Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Typography variant="h5" className="mb-2">
                    Order #{selectedOrder.order_id}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Placed on: {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </Typography>
                </div>
                <Chip
                  label={selectedOrder.order_status}
                  className={`${getStatusColor(selectedOrder.order_status)}`}
                />
              </div>

              <div className="mb-6">
                <Typography variant="h6" className="mb-3">
                  Shipping Address
                </Typography>
                <Card className="p-4">
                  <Typography variant="body1">
                    {selectedOrder.shipping.shipping_address}
                  </Typography>
                </Card>
              </div>

              <div>
                <Typography variant="h6" className="mb-3">
                  Order Items
                </Typography>
                {selectedOrder?.items && selectedOrder.items.map((item) => (
                  <Card key={item?.id} className="mb-2 p-3 bg-opacity-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item?.product?.image} 
                          alt={item?.product?.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <Typography variant="subtitle1">
                            {item?.product?.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Quantity: {item?.quantity}
                          </Typography>
                        </div>
                      </div>
                      <Typography variant="subtitle1" className="font-semibold">
                        ₹{(item?.product?.price * item?.quantity).toFixed(2)}
                      </Typography>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 text-right">
                <Typography variant="h6">
                  Total Amount: ₹{selectedOrder.total_amount.toFixed(2)}
                </Typography>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <KeepButton
            size="sm"
            variant="outline"
            onClick={() => setSelectedOrder(null)}
          >
            Close
          </KeepButton>
          <KeepButton
            size="sm"
            color="info"
          >
            Track Order
          </KeepButton>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;