import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

function LoginForm() {
    // Handler for when the login form is submitted
    const handleSubmit = async (values) => {};

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    return (
        <Box minHeight="400px" marginTop="200px" marginBottom="92px">
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="center"
                alignItems="center"
                spacing={{ xs: 5, md: 15, lg: 40 }}
            >
                <Stack justifyContent="center" alignItems={{ xs: "center", md: "start" }}>
                    <Typography variant="h1">Lecture Buddies</Typography>
                    <Typography variant="h6">Make new friends in your classes</Typography>
                </Stack>
                <Paper elevation={2} sx={{ width: { xs: "250px", sm: "300px", md: "400px" }, padding: "16px" }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={1}>
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
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Login
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Stack>
        </Box>
    );
}

export default LoginForm;
