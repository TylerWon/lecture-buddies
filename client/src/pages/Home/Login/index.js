import { Box, Stack } from "@mui/material";

import LoginForm from "./components/LoginForm";
import LoginFooter from "./components/LoginFooter";

// Login component
function Login(props) {
    const { setShowSignUp } = props;

    return (
        <Box minHeight="inherit">
            <Stack justifyContent="space-between" minHeight="inherit">
                <LoginForm setShowSignUp={setShowSignUp} />
                <LoginFooter />
            </Stack>
        </Box>
    );
}

export default Login;
