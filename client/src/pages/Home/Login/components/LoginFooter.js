import { Box, useTheme } from "@mui/material";

// LoginFooter component
export default function LoginFooter() {
    // Hooks
    const theme = useTheme();

    return <Box sx={{ flex: "1 0 0", backgroundColor: theme.palette.common.black }} />;
}
