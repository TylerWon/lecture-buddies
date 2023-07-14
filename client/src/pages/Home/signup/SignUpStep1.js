import { useFormik } from "formik";
import { useContext } from "react";
import * as yup from "yup";
import YupPassword from "yup-password";

import { UserContext } from "../../../contexts/UserContext";

import AuthForm from "../../../components/forms/AuthForm";

YupPassword(yup);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

function SignUpStep1(props) {
    const { setActiveStep } = props;

    const { setUserId } = useContext(UserContext);

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

    return <AuthForm formik={formik} submitButtonText="Sign up" />;
}

export default SignUpStep1;
