import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import GameOfThrones from "../pages/gameofthrones/GameOfThrones";
import StacksOfCash from "../pages/stacksofcash/StacksOfCash";

const rootRoute = createRootRoute({
  component: MainLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const gameOfThronesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game-of-thrones",
  component: GameOfThrones,
});

const stacksOfCashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stacks-of-cash",
  component: StacksOfCash,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  gameOfThronesRoute,
  stacksOfCashRoute,
]);
const router = createRouter({ routeTree });
export default router;
