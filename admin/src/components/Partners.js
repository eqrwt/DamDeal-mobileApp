import React from "react";

export default function Partners() {
  const partners = [
    { id: 1, name: "Partner A", status: "Active", joined: "2024-01-10" },
    { id: 2, name: "Partner B", status: "Inactive", joined: "2023-09-18" },
    { id: 3, name: "Partner C", status: "Active", joined: "2024-05-02" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Partners</h1>
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Status</th>
            <th className="p-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium">{p.name}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    p.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="p-4 text-gray-500">{p.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
