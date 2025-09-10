import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/session";
import { isAdminAuthed } from "@/admin/auth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function GlobalHeader() {
  const { seller, logout } = useAuth();
  const location = useLocation();
  const isAdmin = isAdminAuthed();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Makola Online</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${
                isActive("/") ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/sell"
              className={`text-sm font-medium ${
                isActive("/sell") ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              Sell
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium ${
                isActive("/about") ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {seller ? (
              <>
                <Link to="/seller">
                  <Button variant="outline" size="sm">My Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Seller Login</Button>
                </Link>
                {isAdmin ? (
                  <Link to="/admin">
                    <Button variant="default" size="sm">Admin</Button>
                  </Link>
                ) : (
                  <Link to="/admin/login">
                    <Button variant="ghost" size="sm">Admin</Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-emerald-600">Home</Link>
              <Link to="/sell" className="text-gray-700 hover:text-emerald-600">Sell</Link>
              <Link to="/about" className="text-gray-700 hover:text-emerald-600">About</Link>
              {seller ? (
                <>
                  <Link to="/seller" className="text-emerald-600 font-medium">My Dashboard</Link>
                  <button onClick={logout} className="text-left text-gray-700">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-emerald-600">Seller Login</Link>
                  <Link to="/admin/login" className="text-gray-700">Admin</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}