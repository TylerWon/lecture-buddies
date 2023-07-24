import { Button, FormControl, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// AuthForm component
function AuthForm(props) {
    //Props
    const { formik, submitButtonText } = props;

    // Hooks
    const [showPassword, setShowPassword] = useState(false);

    // Handler for when show password button is clicked
    const handleShowPasswordClick = () => {
        setShowPassword(!showPassword);
    };

    return (
        <FormControl fullWidth component="form" onSubmit={formik.handleSubmit}>
            <ContentContainer>
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
                <Button fullWidth color="primary" variant="contained" type="submit">
                    {submitButtonText}
                </Button>
            </ContentContainer>
        </FormControl>
    );
}

export default AuthForm;
