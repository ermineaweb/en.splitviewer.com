import React from "react";
import Router from "./router";
import ThemeProvider from "./theme";

function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;
