import React from "react";
import Card from "../Components/atoms/Card";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <Card>
        <h2 className="text-xl font-semibold mb-4">Selamat Datang, {user.nama || "User"}!</h2>
        <p className="text-gray-600 mb-2">Username: <span className="font-medium">{user.username}</span></p>
        <p className="text-gray-600">Role: <span className="font-medium capitalize">{user.role}</span></p>
      </Card>

      
        
       

     
    </div>
  );
};

export default Dashboard;
