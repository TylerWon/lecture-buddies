import { useFormik } from "formik";
import { useContext } from "react";
import * as yup from "yup";
import YupPassword from "yup-password";

import { UserContext } from "../../../../contexts/UserContext";
import { createStudent, signup } from "../../../../utils/requests";

import AuthForm from "../../../../components/forms/AuthForm";

YupPassword(yup);

// Yup validation schema for form
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

// SignUpStep1 component
export default function SignUpStep1(props) {
    // Props
    const { setActiveStep } = props;

    // Hooks
    const { setStudentId } = useContext(UserContext);
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
            // Create user
            const createUserResponse = await signup({ username: values.email, password: values.password });
            const createUserData = await createUserResponse.json();
            if (createUserResponse.status === 400) {
                formik.setErrors({ email: "An account with this email already exists" });
                return;
            }

            // Create student
            await createStudent({ student_id: createUserData.user_id });

            // Set user id for the user context
            setStudentId(createUserData.user_id);

            // Move to next step in the sign up process
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    return <AuthForm formik={formik} submitButtonText="Sign up" />;
}
