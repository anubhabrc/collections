import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";

const rootRoute = createRootRoute({
  component: MainLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });
export default router;
