import React from "react";

export default function CommissionReport() {
  const reports = [
    { id: 1, partner: "Partner A", commission: "$240", date: "2025-08-01" },
    { id: 2, partner: "Partner B", commission: "$150", date: "2025-08-05" },
    { id: 3, partner: "Partner C", commission: "$400", date: "2025-08-12" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Commission Report</h1>
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="p-4">Partner</th>
            <th className="p-4">Commission</th>
            <th className="p-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium">{r.partner}</td>
              <td className="p-4 text-blue-600">{r.commission}</td>
              <td className="p-4 text-gray-500">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
