import React, { useState } from 'react';
import axios from 'axios';

const DishDialog = ({ isOpen, onClose, onAddDish, dishesData }) => {
  const [selectedDish, setSelectedDish] = useState('');
  const [dishQuantity, setDishQuantity] = useState(0);
  const [dishSpecialRequest, setDishSpecialRequest] = useState('');

  const handleAddDish = () => {
    const newDish = {
      name: selectedDish,
      quantity: dishQuantity,
      specialRequest: dishSpecialRequest,
    };
    onAddDish(newDish);
    onClose();
  };

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <h3>Add Dish</h3>
      <label>
        Dish:
        <select value={selectedDish} onChange={(e) => setSelectedDish(e.target.value)} required>
          <option value="">Select a Dish</option>
          {dishesData.map((dish) => (
            <option key={dish.name} value={dish.name}>
              {dish.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Quantity:
        <input type="number" value={dishQuantity} onChange={(e) => setDishQuantity(e.target.value)} required />
      </label>
      <br />
      <label>
        Special Request:
        <input type="text" value={dishSpecialRequest} onChange={(e) => setDishSpecialRequest(e.target.value)} />
      </label>
      <br />
      <button onClick={handleAddDish}>Add Dish</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

const OrderForm = ({ onPlaceOrder, dishesData }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [isDishDialogOpen, setDishDialogOpen] = useState(false);

  const AirtableAPI = axios.create({
    baseURL: 'https://api.airtable.com/v0/appnYUoWmzzJGfRHj/Order_data',
    headers: {
      'Authorization': 'Bearer patdDG4BjXWfRAvU2.c191d6fd37f7f3eb24a64e74a4bba799fe022d8dd0666286b27f1e1e3f3060f2',
      'Content-Type': 'application/json',
    },
  });

  const handleDishQuantityChange = (dishName, quantity) => {
    const updatedDishes = selectedDishes.map((dish) =>
      dish.name === dishName ? { ...dish, quantity } : dish
    );
    setSelectedDishes(updatedDishes);
  };

  const handleSpecialRequestChange = (dishName, specialRequest) => {
    const updatedDishes = selectedDishes.map((dish) =>
      dish.name === dishName ? { ...dish, specialRequest } : dish
    );
    setSelectedDishes(updatedDishes);
  };

  const handleAddDish = (newDish) => {
    setSelectedDishes([...selectedDishes, newDish]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      fields: {
        'Table Number': parseInt(tableNumber),
        'Dishes': JSON.stringify(selectedDishes),
        'General Instructions': generalInstructions,
        'Completed': "false",
      },
    };

    try {
      // Send a request to Airtable to create a new record (order)
      const response = await AirtableAPI.post(
        '',
        config
      );

      const newOrder = response.data.fields;

      // Call the onPlaceOrder callback with the new order data
      onPlaceOrder(newOrder);

      // Reset form fields after submission
      setTableNumber('');
      setSelectedDishes([]);
      setGeneralInstructions('');
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (display a message, log, etc.)
    }
  };

  return (
    <div>
      <h2>Place Order Screen</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Table Number:
          <input type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} required />
        </label>
        <br />
        <label>
          Dishes:
          <ul>
            {selectedDishes.map((dish, index) => (
              <li key={index}>
                {dish.name} -
                Quantity:
                <input
                  type="number"
                  value={dish.quantity || 0}
                  onChange={(e) => handleDishQuantityChange(dish.name, e.target.value)}
                />
                Special Request:
                <input
                  type="text"
                  value={dish.specialRequest || 'None'}
                  onChange={(e) => handleSpecialRequestChange(dish.name, e.target.value)}
                />
              </li>
            ))}
          </ul>
          <button onClick={() => setDishDialogOpen(true)}>Add Dish</button>
          <DishDialog
            isOpen={isDishDialogOpen}
            onClose={() => setDishDialogOpen(false)}
            onAddDish={handleAddDish}
            dishesData={dishesData} // Pass dishesData to DishDialog
          />
        </label>
        <br />
        <label>
          General Instructions:
          <textarea value={generalInstructions} onChange={(e) => setGeneralInstructions(e.target.value)} />
        </label>
        <br />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
