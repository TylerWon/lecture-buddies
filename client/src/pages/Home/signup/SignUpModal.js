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
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as yup from "yup";
import YupPassword from "yup-password";

import { UserContext } from "../../../contexts/UserContext";

import AuthForm from "../../../components/forms/AuthForm";

YupPassword(yup);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const STEPS = ["General", "Education", "Personal"];

const validationSchema = yup.object({
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup
        .string()
        .password()
        .min(8, "Password must be at least 8 characters long")
        .minLowercase(1, "Password must contain at least 1 lowercase letter")
        .minUppercase(1, "Password must contain at least 1 uppercase letter")
        .minNumbers(1, "Password must contain at least 1 number")
        .minSymbols(1, "Password must contain at least 1 symbol")
        .required("Password is required"),
});

function SignUpModal(props) {
    const { showSignUpModal, setShowSignUpModal } = props;

    const { setUserId } = useContext(UserContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [activeStep, setActiveStep] = useState(0);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleAuthFormSubmit(values);
        },
    });

    // Handler for when sign up modal is closed
    const handleSignUpModalClose = () => {
        setShowSignUpModal(false);
        formik.setFieldValue("email", "");
        formik.setFieldValue("password", "");
    };

    // Handler for when AuthForm is submitted
    const handleAuthFormSubmit = async (values) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: values.email,
                    password: values.password,
                }),
                credentials: "include",
            });

            if (response.status === 400) {
                formik.setErrors({ email: "An account with this email already exists" });
                return;
            }

            const data = await response.json();

            setUserId(data.userId);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (err) {
            console.log(err); // unexpected error
        }
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
                <Container sx={{ marginTop: "35px" }}>
                    <Stack direction="column" alignItems="center" spacing={2}>
                        <Stepper activeStep={activeStep} alternativeLabel={isMobile} sx={{ width: "80%" }}>
                            {STEPS.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <AuthForm formik={formik} submitButtonText="Sign up" />
                    </Stack>
                </Container>
            </Box>
        </Dialog>
    );
}

export default SignUpModal;
