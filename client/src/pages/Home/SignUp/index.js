import {
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
import { styled } from "@mui/material/styles";
import { useState } from "react";

import SignUpStep1 from "./components/SignUpStep1";
import SignUpStep2 from "./components/SignUpStep2";
import SignUpStep3 from "./components/SignUpStep3";

// Constants
const STEPS = ["General", "Personal", "Courses"];

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(4),
}));

// Container for the header
const HeaderContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
}));

// SignUp component
export default function SignUp(props) {
    // Props
    const { showSignUp, setShowSignUp } = props;

    // Hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [activeStep, setActiveStep] = useState(0);
    const [selectedSchoolId, setSelectedSchoolId] = useState(null);

    // Handler for when sign up is closed
    const handleSignUpClose = () => {
        setShowSignUp(false);
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={showSignUp} onClose={handleSignUpClose} fullScreen={isMobile}>
            <ContentContainer>
                <HeaderContainer>
                    <Typography variant="h3">Sign up</Typography>
                    <IconButton onClick={handleSignUpClose}>
                        <CloseIcon />
                    </IconButton>
                </HeaderContainer>
                <Stepper sx={{ width: "80%" }} activeStep={activeStep} alternativeLabel={isMobile}>
                    {STEPS.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === 0 && <SignUpStep1 setActiveStep={setActiveStep} />}
                {activeStep === 1 && (
                    <SignUpStep2 setActiveStep={setActiveStep} setSelectedSchoolId={setSelectedSchoolId} />
                )}
                {activeStep === 2 && <SignUpStep3 selectedSchoolId={selectedSchoolId} />}
            </ContentContainer>
        </Dialog>
    );
}
