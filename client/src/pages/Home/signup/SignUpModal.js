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

import SignUpStep1 from "./SignUpStep1";

YupPassword(yup);

const STEPS = ["General", "Education", "Personal"];

function SignUpModal(props) {
    const { showSignUpModal, setShowSignUpModal } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [activeStep, setActiveStep] = useState(0);

    // Handler for when sign up modal is closed
    const handleSignUpModalClose = () => {
        setShowSignUpModal(false);
    };

    return (
        <Dialog open={showSignUpModal} onClose={handleSignUpModalClose} fullScreen={isMobile} fullWidth maxWidth="sm">
            <Box padding="20px" bgcolor={theme.palette.common.white}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h3">Sign up</Typography>
                    <IconButton onClick={handleSignUpModalClose}>
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
                        <SignUpStep1 setActiveStep={setActiveStep} />
                    </Stack>
                </Container>
            </Box>
        </Dialog>
    );
}

export default SignUpModal;
