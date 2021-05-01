import React from "react";
import "./reset.css";
import "fontsource-open-sans";
import "fontsource-montserrat";
import "./global.css";
import "./scrollbar.css";

function ThemeProvider({ children }) {
  return <>{children}</>;
}

export default ThemeProvider;
