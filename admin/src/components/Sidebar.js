import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingBag, BarChart } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold text-blue-600">YsrapEtpe</div>
      <nav className="flex-1">
        <ul className="space-y-2 px-4">
          <li>
            <Link
              to="/"
              className="flex items-center p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/partners"
              className="flex items-center p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Users className="w-5 h-5 mr-3" />
              Partners
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="flex items-center p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/commission"
              className="flex items-center p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <BarChart className="w-5 h-5 mr-3" />
              Commission Report
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
