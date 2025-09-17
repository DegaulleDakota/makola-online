import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/auth/session";
import { RequireSeller, RequireAdmin } from "@/auth/guards";
import GlobalHeader from "./components/GlobalHeader";
import Index from "./pages/Index";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ReturnPolicy from "./pages/ReturnPolicy";
import HelpCenter from "./pages/HelpCenter";
import Sell from "./pages/Sell";
import NotFound from "./pages/NotFound";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminChangePassword from "./components/AdminChangePassword";
import ServerError from "@/pages/ServerError";

import AdminAnalytics from "./components/AdminAnalytics";
import AdminNotifications from "./components/AdminNotifications";
import AdminRiders from "./components/AdminRiders";
import WhatsAppBotConfig from "./components/WhatsAppBotConfig";
import SellerLogin from "./components/SellerLogin";
import SellerLayout from "./components/SellerLayout";
import SellerDashboard from "./components/SellerDashboard";
import SellerProfilePage from "./pages/SellerProfilePage";
import SellerOnboarding from "./components/SellerOnboarding";
import RiderRegistration from "./components/RiderRegistration";
import RiderDashboard from "./components/RiderDashboard";
import RiderJobs from "./components/RiderJobs";
import MyProductsPage from "./components/MyProductsPage";
import RiderLogin from "./components/RiderLogin";
import AdminPrelaunch from "./components/AdminPrelaunch";
import Login from "./pages/Login";

const queryClient = new QueryClient();

function RiderRegisterPage() {
  const navigate = useNavigate();
  return (
    <>
      <GlobalHeader />
      <div className="py-8">
        <RiderRegistration onSuccess={() => navigate("/rider")} />
      </div>
    </>
  );
}

function AdminChangePasswordPage() {
  const navigate = useNavigate();
  return (
    <AdminChangePassword
      adminEmail={localStorage.getItem("makola_admin_email") || ""}
      onPasswordChanged={() => navigate("/admin")}
    />
  );
}

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<><GlobalHeader /><Index /></>} />
              <Route path="/about" element={<><GlobalHeader /><About /></>} />
              <Route path="/terms" element={<><GlobalHeader /><Terms /></>} />
              <Route path="/privacy" element={<><GlobalHeader /><Privacy /></>} />
              <Route path="/return-policy" element={<><GlobalHeader /><ReturnPolicy /></>} />
              <Route path="/help" element={<><GlobalHeader /><HelpCenter /></>} />
              <Route path="/sell" element={<><GlobalHeader /><Sell /></>} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/seller/login" element={<SellerLogin />} />
              <Route path="/seller/onboarding" element={<><GlobalHeader /><div className="py-8"><SellerOnboarding /></div></>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/change-password" element={<AdminChangePasswordPage />} />

              {/* Protected admin routes */}
              <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/whatsapp" element={<WhatsAppBotConfig />} />
                <Route path="/admin/riders" element={<AdminRiders />} />
                <Route path="/admin/prelaunch" element={<AdminPrelaunch />} />
              </Route>

              {/* Rider routes */}
              <Route path="/rider/register" element={<RiderRegisterPage />} />
              <Route path="/rider/login" element={<><GlobalHeader /><div className="py-8"><RiderLogin onSuccess={() => {}} /></div></>} />
              <Route path="/rider" element={<><GlobalHeader /><div className="py-8"><RiderDashboard riderId="sample-rider-id" /></div></>} />
              <Route path="/rider/jobs" element={<><GlobalHeader /><div className="py-8"><RiderJobs riderId="sample-rider-id" /></div></>} />

              {/* Protected seller routes */}
              <Route element={<RequireSeller />}>
                <Route path="/seller" element={<SellerLayout />}>
                  <Route index element={<SellerDashboard />} />
                  <Route path="products" element={<MyProductsPage />} />
                  <Route path="profile" element={<SellerProfilePage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
