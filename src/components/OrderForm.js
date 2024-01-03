import React, { useState } from 'react';

const OrderForm = ({ onPlaceOrder, dishesData }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [selectedDishes, setSelectedDishes] = useState(dishesData.map(initializeDish));
  const [generalInstructions, setGeneralInstructions] = useState('');

  function initializeDish(dish) {
    return {
      name: dish.name,
      quantity: 0,
      specialRequest: 'None',
    };
  }

  const findDishIndex = (dishName) => {
    return selectedDishes.findIndex((dish) => dish.name === dishName);
  };

  const handleDishQuantityChange = (dishName, quantity) => {
    // Update the quantity for the selected dish
    const dishIndex = findDishIndex(dishName);
    if (dishIndex !== -1) {
      const updatedDishes = [...selectedDishes];
      updatedDishes[dishIndex].quantity = parseInt(quantity);
      setSelectedDishes(updatedDishes);
    }
  };

  const handleSpecialRequestChange = (dishName, specialRequest) => {
    // Update the special request for the selected dish
    const dishIndex = findDishIndex(dishName);
    if (dishIndex !== -1) {
      const updatedDishes = [...selectedDishes];
      updatedDishes[dishIndex].specialRequest = specialRequest;
      setSelectedDishes(updatedDishes);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter dishes with quantity greater than 0
    const filteredDishes = selectedDishes.filter((dish) => dish.quantity > 0);

    const orderData = { tableNumber, dishes: filteredDishes, generalInstructions };
    onPlaceOrder(orderData);

    // Reset form fields after submission
    setTableNumber('');
    setSelectedDishes(dishesData.map(initializeDish));
    setGeneralInstructions('');
  };

  return (
    <div>
      <h2>Place Order Screen</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Table Number:
          <input type="text" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} required />
        </label>
        <br />
        <label>
          Dishes:
          <ul>
            {dishesData.map((dish, index) => (
              <li key={index}>
                {dish.name} - 
                Quantity: 
                <input
                  type="number"
                  value={selectedDishes[findDishIndex(dish.name)]?.quantity}
                  onChange={(e) => handleDishQuantityChange(dish.name, e.target.value)}
                />
                Special Request: 
                <input
                  type="text"
                  value={selectedDishes[findDishIndex(dish.name)]?.specialRequest}
                  onChange={(e) => handleSpecialRequestChange(dish.name, e.target.value)}
                />
              </li>
            ))}
          </ul>
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
