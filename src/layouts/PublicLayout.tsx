import { Outlet } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAppContext } from "../context/AppContext";

export default function PublicLayout() {
  const { cartIds, favIds } = useAppContext();

  return (
    <>
      <PublicHeader cartCount={cartIds.length} favCount={favIds.length} />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}
