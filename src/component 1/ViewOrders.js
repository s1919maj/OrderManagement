import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AirtableAPI = axios.create({
  baseURL: 'https://api.airtable.com/v0/appnYUoWmzzJGfRHj/Order_data',
  headers: {
    'Authorization': 'Bearer patdDG4BjXWfRAvU2.c191d6fd37f7f3eb24a64e74a4bba799fe022d8dd0666286b27f1e1e3f3060f2',
    'Content-Type': 'application/json',
  },
});

const ViewOrders = ({ markOrderCompleted }) => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await AirtableAPI.get();
        const airtableOrders = response.data.records;
        const formattedOrders = airtableOrders.map((order) => ({
          id: order.id,
          tableNumber: order.fields['Table Number'],
          completed: order.fields['Completed'],
          dishes: JSON.parse(order.fields['Dishes']),
          generalInstructions: order.fields['General Instructions'],
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching orders from Airtable:', error);
      }
    };

    fetchOrders();
  }, []);

  const filterOrders = (status) => {
    return orders.filter((order) => (status === 'pending' ? !order.completed : order.completed));
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <h2>View Orders Screen</h2>
      <div>
        <button onClick={() => toggleTab('pending')}>Pending Orders</button>
        <button onClick={() => toggleTab('completed')}>Completed Orders</button>
      </div>
      <ul>
        {filterOrders(activeTab).map((order) => (
          <li key={order.id}>
            <div>
              <strong>Order ID:</strong> {order.id} - <strong>Table Number:</strong> {order.tableNumber} -{' '}
              <strong>Completed:</strong> {order.completed ? 'Yes' : 'No'}
              {!order.completed && (
                <button onClick={() => markOrderCompleted(order.id)}>
                  Mark Completed
                </button>
              )}
            </div>
            <h4>Dishes:</h4>
            <ul>
              {Array.isArray(order.dishes) ? (
                order.dishes.map((dish, index) => (
                  <li key={index}>
                    <strong>Name:</strong> {dish.name} - <strong>Quantity:</strong> {dish.quantity} -{' '}
                    <strong>Special Request:</strong> {dish.specialRequest || 'None'}
                  </li>
                ))
              ) : (
                <li>No dish information available</li>
              )}
            </ul>
            <p>
              <strong>General Instructions:</strong> {order.generalInstructions || 'None'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewOrders;
