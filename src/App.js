import React, { useState, useEffect } from 'react';
import './App.css';
import OrderForm from './components/OrderForm';
import ViewOrders from './component 1/ViewOrders';

const dishesData = [
  { name: 'Pizza', ingredients: ['Dough', 'Tomato Sauce', 'Cheese'], cost: 8.99 },
  { name: 'Burger', ingredients: ['Bun', 'Beef Patty', 'Lettuce', 'Tomato', 'Cheese'], cost: 5.99 },
  // Add more dishes as needed
];

const ingredientsData = [
  { name: 'Dough', quantity: 10 },
  { name: 'Tomato Sauce', quantity: 5 },
  { name: 'Cheese', quantity: 20 },
  { name: 'Bun', quantity: 15 },
  { name: 'Beef Patty', quantity: 10 },
  { name: 'Lettuce', quantity: 8 },
  { name: 'Tomato', quantity: 12 },
];

const App = () => {
  const [activeScreen, setActiveScreen] = useState('menu');
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem('orders')) || []);
  const [orderDetails, setOrderDetails] = useState(null);

  const showScreen = (screen) => {
    setActiveScreen(screen);
  };

  const handlePlaceOrder = (orderData) => {
    // Handle the order data as needed
    console.log('Placing order:', orderData);

    // Update the orders state and local storage
    const newOrder = { ...orderData, id: Date.now(), completed: false };
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));

    // For demonstration, you can update the order details state
    setOrderDetails(newOrder);

    // Switch to the 'viewOrders' screen after placing the order
    showScreen('viewOrders');
  };

  const markOrderCompleted = (orderId) => {
    // Mark the order as completed in both state and local storage
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, completed: true } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  useEffect(() => {
    // Fetch orders from local storage on component mount
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  return (
    <div className="App">
      <div id="navbar">
        <button onClick={() => showScreen('placeOrder')}>Place Order</button>
        <button onClick={() => showScreen('viewOrders')}>View Orders</button>
      </div>
      <div id="content">
        {activeScreen === 'placeOrder' && <OrderForm onPlaceOrder={handlePlaceOrder} dishesData={dishesData} />}
        {activeScreen === 'viewOrders' && <ViewOrders orders={orders} markOrderCompleted={markOrderCompleted} />}
      </div>
    </div>
  );
};

export default App;
