import { Box, useTheme } from "@mui/material";

function LoginFooter() {
    const theme = useTheme();

    return <Box minHeight="250px" bgcolor={theme.palette.common.black} />;
}

export default LoginFooter;
