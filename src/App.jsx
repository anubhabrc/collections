import { RouterProvider } from "@tanstack/react-router";
import router from "../src/router/index";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
