import { RouterProvider } from "@tanstack/react-router";
import router from "../src/router/index";
import ReactGA from "react-ga4";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    ReactGA.initialize("G-2Q5N5DFX1X");
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "App.jsx",
    });
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
