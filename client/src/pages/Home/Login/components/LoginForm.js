import { Box, Link as MuiLink, Paper, Stack, Typography } from "@mui/material";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { useFormik } from "formik";
import { useContext } from "react";
import * as yup from "yup";

import { UserContext } from "../../../../contexts/UserContext";
import { login } from "../../../../utils/requests";

import AuthForm from "../../../../components/forms/AuthForm";

// Yup validation schema for form
const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

// LoginForm component
function LoginForm(props) {
    // Props
    const { setShowSignUp } = props;

    // Hooks
    const { setIsLoggedIn, setUserId } = useContext(UserContext);
    const navigate = useNavigate();
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

    // Handler for when the AuthForm is submitted
    const handleAuthFormSubmit = async (values) => {
        try {
            // Log the user in
            const loginResponse = await login(values);
            const loginData = await loginResponse.json();
            if (loginResponse.status !== 200) {
                formik.setErrors({ email: "Invalid email or password", password: "Invalid email or password" });
                return;
            }

            // Set the user context
            setIsLoggedIn(true);
            setUserId(loginData.user_id);

            // Navigate to the courses page
            navigate("/courses");
        } catch (err) {
            console.log(err); // unexpected error
        }
    };

    // Handler for when the sign up link is clicked
    const handleSignUpClick = () => {
        setShowSignUp(true);
    };

    return (
        <Box minHeight="400px" marginTop="200px" marginBottom="92px">
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="center"
                alignItems="center"
                spacing={{ xs: 5, md: 15, lg: 40 }}
            >
                <Stack direction="column" justifyContent="center" alignItems={{ xs: "center", md: "start" }}>
                    <Typography variant="h1">Lecture Buddies</Typography>
                    <Typography variant="h6">Meet new people in your classes</Typography>
                </Stack>
                <Paper elevation={2} sx={{ width: { xs: "250px", sm: "400px" }, padding: "16px" }}>
                    <Stack direction="column" alignItems="center" spacing={2}>
                        <AuthForm formik={formik} submitButtonText="Login" />
                        <Typography variant="body1">
                            Don't have an account yet?{" "}
                            <MuiLink component={ReactRouterLink} variant="body1" onClick={handleSignUpClick}>
                                Sign up
                            </MuiLink>
                        </Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    );
}

export default LoginForm;
