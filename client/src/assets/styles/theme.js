import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
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
        h1: {
            fontSize: "48px",
        },
        h2: {
            fontSize: "40px",
        },
        h3: {
            fontSize: "36px",
        },
        h4: {
            fontSize: "32px",
        },
        h5: {
            fontSize: "24px",
        },
        h6: {
            fontSize: "20px",
        },
        subtitle1: {
            fontSize: "16px",
        },
        subtitle2: {
            fontSize: "14px",
        },
        body1: {
            fontSize: "16px",
        },
        body2: {
            fontSize: "14px",
        },
        button: {
            fontSize: "14px",
        },
        caption: {
            fontSize: "12px",
        },
        overline: {
            fontSize: "10px",
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;
