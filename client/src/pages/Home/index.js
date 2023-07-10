import { Box, Stack } from "@mui/material";

import LoginForm from "./login/LoginForm";
import LoginFooter from "./login/LoginFooter";

function Home() {
    return (
        <Box minHeight="inherit">
            <Stack justifyContent="space-between" minHeight="inherit">
                <LoginForm />
                <LoginFooter />
            </Stack>
        </Box>
    );
}

export default Home;
