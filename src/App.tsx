import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DocumentTitle from "./components/DocumentTitle";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import VenueDetailPage from "./pages/VenueDetailPage";
import BookingPage from "./pages/BookingPage";
import SpecialistsPage from "./pages/SpecialistsPage";
import SpecialistDetailPage from "./pages/SpecialistDetailPage";
import SpecialistRegisterPage from "./pages/SpecialistRegisterPage";
import AuthPage from "./pages/AuthPage";
import FavoritesPage from "./pages/FavoritesPage";
import AccountPage from "./pages/AccountPage";
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
          <Route path="katalog" element={<CatalogPage />} />
          <Route path="toyxonalar/:venueId" element={<VenueDetailPage />} />
          <Route path="toyxonalar/:venueId/bron" element={<BookingPage />} />
          <Route path="mutaxassislar" element={<SpecialistsPage />} />
          <Route path="mutaxassislar/:specialistId" element={<SpecialistDetailPage />} />
          <Route path="mutaxassis/royxatdan-otish" element={<SpecialistRegisterPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route
            path="account/*"
            element={
              <CustomerOnly>
                <AccountPage />
              </CustomerOnly>
            }
          />
          <Route path="products" element={<Navigate to={paths.catalog} replace />} />
          <Route path="products/:productId" element={<Navigate to={paths.catalog} replace />} />
          <Route path="cart" element={<Navigate to={paths.catalog} replace />} />
          <Route path="store/*" element={<Navigate to={paths.catalog} replace />} />
        </Route>

        <Route path="*" element={<Navigate to={paths.home} replace />} />
      </Routes>
    </div>
  );
}
