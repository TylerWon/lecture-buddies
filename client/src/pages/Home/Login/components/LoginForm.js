import { Link as MuiLink, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { useFormik } from "formik";
import { useContext } from "react";
import * as yup from "yup";

import { StudentContext } from "../../../../contexts/StudentContext";
import { login } from "../../../../utils/apiRequests";

import AuthForm from "../../../../components/forms/AuthForm";

// Yup validation schema for form
const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(20),
    padding: theme.spacing(4),
    flex: "2 0 0",
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        gap: theme.spacing(4),
    },
}));

// Container for the header
const HeaderContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    [theme.breakpoints.down("md")]: {
        alignItems: "center",
    },
}));

// Container for the form background
const FormBackground = styled(Paper)(({ theme }) => ({
    width: "400px",
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
        width: "100%",
    },
}));

// Container for the form
const FormContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// LoginForm component
export default function LoginForm(props) {
    // Props
    const { setShowSignUp } = props;

    // Hooks
    const { setIsLoggedIn, setStudent } = useContext(StudentContext);
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
            const loginResponse = await login({ username: values.email, password: values.password });
            if (loginResponse.status !== 200) {
                formik.setErrors({ email: "Invalid email or password", password: "Invalid email or password" });
                return;
            }
            const loginData = await loginResponse.json();

            // Set the student context
            setIsLoggedIn(true);
            setStudent(loginData);

            // Navigate to the courses page
            navigate("/courses");
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Handler for when the sign up link is clicked
    const handleSignUpClick = () => {
        setShowSignUp(true);
    };

    return (
        <ContentContainer>
            <HeaderContainer>
                <Typography variant="h1">Lecture Buddies</Typography>
                <Typography variant="h6">Meet new people in your classes</Typography>
            </HeaderContainer>
            <FormBackground>
                <FormContainer>
                    <AuthForm formik={formik} submitButtonText="Login" />
                    <Typography variant="body1">
                        Don't have an account yet?{" "}
                        <MuiLink component={ReactRouterLink} variant="body1" onClick={handleSignUpClick}>
                            Sign up
                        </MuiLink>
                    </Typography>
                </FormContainer>
            </FormBackground>
        </ContentContainer>
    );
}
