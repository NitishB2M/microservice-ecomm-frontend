import { useState } from 'react';
import {
  Typography, Button, Grid, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const SavedCards = () => {
  const [cardDialog, setCardDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [cardForm, setCardForm] = useState({
    card_number: '',
    name_on_card: '',
    expiry_month: '',
    expiry_year: '',
    card_type: 'visa'
  });

  const handleCardChange = (field) => (event) => {
    setCardForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCardDialog = (card = null) => {
    if (card) {
      setSelectedCard(card);
      setCardForm(card);
    } else {
      setSelectedCard(null);
      setCardForm({
        card_number: '',
        name_on_card: '',
        expiry_month: '',
        expiry_year: '',
        card_type: 'visa'
      });
    }
    setCardDialog(true);
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    // Implement card save logic here
    setCardDialog(false);
  };

  const handleDeleteCard = async (cardId) => {
    // Implement card delete logic here
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5">Saved Cards</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleCardDialog()}
        >
          Add New Card
        </Button>
      </div>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} key={card.id}>
            <div className="bg-white rounded-lg shadow-md p-4 relative hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-2">
                <CreditCardIcon className="mr-2" />
                <Typography variant="subtitle1" className="font-medium">
                  {card.card_type.toUpperCase()}
                </Typography>
              </div>
              <Typography variant="body2" color="textSecondary" className="mb-1">
                **** **** **** {card.card_number.slice(-4)}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mb-2">
                Expires: {card.expiry_month}/{card.expiry_year}
              </Typography>
              <div className="flex justify-end space-x-2 mt-2">
                <IconButton
                  size="small"
                  onClick={() => handleCardDialog(card)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteCard(card.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={cardDialog} 
        onClose={() => setCardDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSaveCard}>
          <DialogTitle>
            {selectedCard ? 'Edit Card' : 'Add New Card'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} className="pt-2">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={cardForm.card_number}
                  onChange={handleCardChange('card_number')}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name on Card"
                  value={cardForm.name_on_card}
                  onChange={handleCardChange('name_on_card')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Month"
                  value={cardForm.expiry_month}
                  onChange={handleCardChange('expiry_month')}
                  required
                  type="number"
                  inputProps={{ min: 1, max: 12 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Year"
                  value={cardForm.expiry_year}
                  onChange={handleCardChange('expiry_year')}
                  required
                  type="number"
                  inputProps={{ min: new Date().getFullYear(), max: new Date().getFullYear() + 10 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Card Type</InputLabel>
                  <Select
                    value={cardForm.card_type}
                    onChange={handleCardChange('card_type')}
                    label="Card Type"
                    required
                  >
                    <MenuItem value="visa">Visa</MenuItem>
                    <MenuItem value="mastercard">Mastercard</MenuItem>
                    <MenuItem value="amex">American Express</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCardDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedCard ? 'Update' : 'Add'} Card
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default SavedCards;
