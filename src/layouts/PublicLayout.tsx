import { Outlet } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAccountBookings, useFavorites } from "../lib/wedding/store";

export default function PublicLayout() {
  const favorites = useFavorites();
  const bookings = useAccountBookings();
  const activeBookings = bookings.filter((item) => item.status !== "cancelled").length;

  return (
    <>
      <PublicHeader favCount={favorites.length} bookingCount={activeBookings} />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}
