import { Box, useTheme } from "@mui/material";

// LoginFooter component
function LoginFooter() {
    // Hooks
    const theme = useTheme();

    return <Box minHeight="250px" bgcolor={theme.palette.common.black} />;
}

export default LoginFooter;
