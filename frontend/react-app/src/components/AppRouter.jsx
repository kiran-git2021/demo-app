import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "@/components/pages/home";
import About from "@/components/pages/about";
import Contact from "@/components/pages/contact";
import NothingFound from "@/components/pages/pageNotFound";
import LiveDashboard from "@/components/pages/live-dashboard";
import Settings from "@/components/pages/settings";
import Login from "@/components/pages/login";
import Logout from "@/components/pages/logout";
import DevelopmentMessage from "@/components/pages/DevelopmentMessage";
import OrganizationTree from "@/components/pages/OrganizationTree";
import InventoryPage from "@/components/pages/InventoryPage"
import UsersPage from "@/components/pages/UserManagement";
import MapView from "@/components/pages/map.jsx";
import DemoPage from "@/components/pages/historical.jsx";

// Layout
import MainLayout from "@/components/layouts/MainLayout";

// Auth
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "@/components/ui/theme-provider"

function AppRouter() {
  return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login/>} />

        {/* Protected routes with sidebar (MainLayout) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<LiveDashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/live" element={<LiveDashboard />} />
          <Route path="/historical" element={<DemoPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user-management" element={<UsersPage />} />
          <Route path="/organization" element={<OrganizationTree />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/reports-standard" element={<DevelopmentMessage />} />
          <Route path="/reports-custom" element={<DevelopmentMessage />} />

          <Route
            path="/notifications"
            element={<DevelopmentMessage />}
            errorElement="Under Development"
          />
        </Route>

        {/* Logout (public, clears token) */}
        <Route path="/logout" element={<Logout />} />

        {/* 404 fallback */}
        <Route path="*" element={<NothingFound />} errorElement="PageNotFound" />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default AppRouter;
