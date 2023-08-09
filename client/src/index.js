import "@fontsource/lato";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";

import "./assets/styles/index.css";
import App from "./App";
import theme from "./assets/styles/theme";
import { StudentContextProvider } from "./contexts/StudentContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <StudentContextProvider>
                <App />
            </StudentContextProvider>
        </ThemeProvider>
    </React.StrictMode>
);
