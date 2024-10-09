import { Outlet } from "@tanstack/react-router";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <main className="pt-12">
        <Outlet />
      </main>
    </div>
  );
}
