import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#d32f2f",
        },
        secondary: {
            main: "#1976d2",
        },
        error: {
            main: "#ed6c02",
        },
        grey: {
            main: "#dbdbdb",
        },
    },
    typography: {
        fontFamily: ["Lato", "sans-serif"].join(","),
    },
});

export default theme;
