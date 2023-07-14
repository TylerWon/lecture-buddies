import { Box, Stack } from "@mui/material";
import { useState } from "react";

import LoginForm from "./login/LoginForm";
import LoginFooter from "./login/LoginFooter";
import SignUpModal from "./signup/SignUpModal";

// Home component
function Home() {
    // Hooks
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    return (
        <>
            <Box minHeight="inherit">
                <Stack justifyContent="space-between" minHeight="inherit">
                    <LoginForm setShowSignUpModal={setShowSignUpModal} />
                    <LoginFooter />
                </Stack>
            </Box>
            <SignUpModal showSignUpModal={showSignUpModal} setShowSignUpModal={setShowSignUpModal} />
        </>
    );
}

export default Home;
