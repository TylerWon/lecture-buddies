import { Button, FormControl, IconButton, InputAdornment, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { DefaultTextField } from "../atoms/input";

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// AuthForm component
export default function AuthForm(props) {
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
                <DefaultTextField id="email" label="Email" formik={formik} />
                <DefaultTextField
                    id="password"
                    label="Password"
                    formik={formik}
                    type={showPassword ? "text" : "password"}
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
