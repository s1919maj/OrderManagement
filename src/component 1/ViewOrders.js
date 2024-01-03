import React, { useState } from 'react';

const ViewOrders = ({ orders, markOrderCompleted }) => {
  const [activeTab, setActiveTab] = useState('pending');

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
            Order ID: {order.id} - Table Number: {order.tableNumber} - Completed: {order.completed ? 'Yes' : 'No'}
            {!order.completed && (
              <button onClick={() => markOrderCompleted(order.id)}>
                Mark Completed
              </button>
            )}
            <h4>Dishes:</h4>
            <ul>
              {Array.isArray(order.dishes) ? (
                order.dishes.map((dish, index) => (
                  <li key={index}>
                    {dish.name} - Quantity: {dish.quantity} - Special Request: {dish.specialRequest}
                  </li>
                ))
              ) : (
                <li>No dish information available</li>
              )}
            </ul>
            <p>General Instructions: {order.generalInstructions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewOrders;
