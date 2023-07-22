import {
    Box,
    Container,
    Dialog,
    IconButton,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import * as yup from "yup";
import YupPassword from "yup-password";

import SignUpStep1 from "./components/SignUpStep1";
import SignUpStep2 from "./components/SignUpStep2";
import SignUpStep3 from "./components/SignUpStep3";

YupPassword(yup);

// Constants
const STEPS = ["General", "Education", "Personal"];

// SignUp component
function SignUp(props) {
    // Props
    const { showSignUp, setShowSignUp } = props;

    // Hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [activeStep, setActiveStep] = useState(0);

    // Handler for when sign up is closed
    const handleSignUpClose = () => {
        setShowSignUp(false);
    };

    return (
        <Dialog open={showSignUp} onClose={handleSignUpClose} fullScreen={isMobile} fullWidth maxWidth="sm">
            <Box padding="20px" bgcolor={theme.palette.common.white}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h3">Sign up</Typography>
                    <IconButton onClick={handleSignUpClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Container sx={{ marginTop: "25px" }}>
                    <Stack direction="column" alignItems="center" spacing={2}>
                        <Stepper activeStep={activeStep} alternativeLabel={isMobile} sx={{ width: "80%" }}>
                            {STEPS.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === 0 && <SignUpStep1 setActiveStep={setActiveStep} />}
                        {activeStep === 1 && <SignUpStep2 setActiveStep={setActiveStep} />}
                        {activeStep === 2 && <SignUpStep3 setActiveStep={setActiveStep} />}
                    </Stack>
                </Container>
            </Box>
        </Dialog>
    );
}

export default SignUp;
