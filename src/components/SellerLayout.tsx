import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/session";
import { LayoutDashboard, Package, User } from "lucide-react";

export default function SellerLayout() {
  const { seller } = useAuth();

  if (!seller) {
    return <div className="p-8 text-center">Please log in to access seller dashboard</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600">Welcome back, {seller.name}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="px-6">
            <nav className="flex space-x-8">
              <NavLink
                to="/seller"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>
              <NavLink
                to="/seller/products"
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`
                }
              >
                <Package className="w-4 h-4" />
                My Products
              </NavLink>
              <NavLink
                to="/seller/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`
                }
              >
                <User className="w-4 h-4" />
                Edit Shop
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}