import { Button, FormControl, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import { useContext } from "react";
import * as yup from "yup";

import { UserContext } from "../../../../../contexts/UserContext";
import { updateStudent } from "../../../../../utils/requests";
import EducationSection from "./EducationSection";

// Yup validation schema for form
const validationSchema = yup.object({
    school: yup.number().required("School is required"),
    year: yup.string().required("Year is required"),
    faculty: yup.string().required("Faculty is required"),
    major: yup.string().required("Major is required"),
});

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// SignUpStep2 component
function SignUpStep2(props) {
    // Props
    const { setActiveStep } = props;

    // Hooks
    const { userId } = useContext(UserContext);
    const formik = useFormik({
        initialValues: {
            school: "",
            year: "",
            faculty: "",
            major: "",
            bio: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleEducationFormSubmit(values);
        },
    });

    // Handler for when form is submitted
    const handleEducationFormSubmit = async (values) => {
        try {
            // Update student
            const updateStudentResponse = await updateStudent(userId, values);
            const updateStudentData = await updateStudentResponse.json();
            if (updateStudentResponse.status === 400) {
                throw new Error(updateStudentData.message);
            }

            // Move to next step in the sign up process
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (err) {
            console.log(err); // unexpected error
        }
    };

    return (
        <FormControl fullWidth component="form" onSubmit={formik.handleSubmit}>
            <ContentContainer>
                <EducationSection formik={formik} />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Next
                </Button>
            </ContentContainer>
        </FormControl>
    );
}

export default SignUpStep2;
