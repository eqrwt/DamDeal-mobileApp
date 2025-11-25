import React from "react";

export default function Orders() {
  const orders = [
    { id: 101, customer: "John Doe", amount: "$120", status: "Completed" },
    { id: 102, customer: "Jane Smith", amount: "$85", status: "Pending" },
    { id: 103, customer: "Sam Lee", amount: "$200", status: "Completed" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="p-4">Order ID</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium">{o.id}</td>
              <td className="p-4">{o.customer}</td>
              <td className="p-4">{o.amount}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    o.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
