import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DocumentTitle from "./components/DocumentTitle";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SellerStorePage from "./pages/SellerStorePage";
import AuthPage from "./pages/AuthPage";
import CartCheckoutPage from "./pages/CartCheckoutPage";
import FavoritesPage from "./pages/FavoritesPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import { CustomerGuest, CustomerOnly } from "./routes/guards";
import { paths } from "./routes/paths";
import { dismissBootLoader } from "./lib/bootLoader";
import { useAppContext } from "./context/AppContext";

export default function App() {
  const { user, authReady, logout } = useAppContext();

  useEffect(() => dismissBootLoader(1100), []);

  useEffect(() => {
    if (!authReady || !user) return;
    if (user.role !== "customer") void logout({ silent: true });
  }, [authReady, logout, user]);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", fontFamily: "var(--font-body)" }}>
      <DocumentTitle />
      <ScrollToTop />
      <Routes>
        <Route
          path="/auth"
          element={
            <CustomerGuest>
              <AuthPage />
            </CustomerGuest>
          }
        />

        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListingPage />} />
          <Route path="products/:productId" element={<ProductDetailPage />} />
          <Route path="store/:storeSlug" element={<SellerStorePage />} />
          <Route path="store" element={<Navigate to={paths.store()} replace />} />
          <Route path="cart" element={<CartCheckoutPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route
            path="account/*"
            element={
              <CustomerOnly>
                <CustomerDashboard />
              </CustomerOnly>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to={paths.home} replace />} />
      </Routes>
    </div>
  );
}
