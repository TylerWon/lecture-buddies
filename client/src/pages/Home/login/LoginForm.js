import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link as MuiLink,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as yup from "yup";

import { UserContext } from "../../../contexts/UserContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

function LoginForm(props) {
    const { setShowSignUpModal } = props;
    const { setIsLoggedIn, setUserId } = useContext(UserContext);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleLoginFormSubmit(values);
        },
    });

    // Handler for when the login form is submitted
    const handleLoginFormSubmit = async (values) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
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

            if (response.status !== 200) {
                formik.setErrors({ email: "Invalid email or password", password: "Invalid email or password" });
                return;
            }

            const data = await response.json();

            setIsLoggedIn(true);
            setUserId(data.userId);

            navigate("/courses");
        } catch (err) {
            console.log(err); // unexpected error
        }
    };

    // Handler for when show password button is clicked
    const handleShowPasswordClick = () => {
        setShowPassword(!showPassword);
    };

    // Handler for when the sign up link is clicked
    const handleSignUpClick = () => {
        setShowSignUpModal(true);
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
                    <Typography variant="h6">Make new friends in your classes</Typography>
                </Stack>
                <Paper elevation={2} sx={{ width: { xs: "250px", sm: "300px", md: "400px" }, padding: "16px" }}>
                    <form onSubmit={formik.handleLoginFormSubmit}>
                        <Stack direction="column" alignItems="center" spacing={2}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowPasswordClick} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Login
                            </Button>
                            <Typography variant="body1">
                                Don't have an account yet?{" "}
                                <MuiLink component={ReactRouterLink} variant="body1" onClick={handleSignUpClick}>
                                    Sign up
                                </MuiLink>
                            </Typography>
                        </Stack>
                    </form>
                </Paper>
            </Stack>
        </Box>
    );
}

export default LoginForm;
