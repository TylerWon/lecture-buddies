import { Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import { useContext } from "react";
import * as yup from "yup";

import { UserContext } from "../../../../../contexts/UserContext";
import { updateStudent } from "../../../../../utils/requests";

import EducationForm from "./components/EducationForm";

// Yup validation schema for education form
const educationFormValidationSchema = yup.object({
    school: yup.number().required("School is required"),
    year: yup.string().required("Year is required"),
    faculty: yup.string().required("Faculty is required"),
    major: yup.string().required("Major is required"),
    bio: yup.string().max(500, "Character limit is 500").required("Bio is required"),
});

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(4),
}));

// SignUpStep2 component
function SignUpStep2(props) {
    // Props
    const { setActiveStep } = props;

    // Hooks
    const { userId } = useContext(UserContext);
    const educationFormFormik = useFormik({
        initialValues: {
            school: "",
            year: "",
            faculty: "",
            major: "",
            bio: "",
        },
        validationSchema: educationFormValidationSchema,
        onSubmit: () => {},
    });

    // Handler for when next button is clicked
    const handleNextClick = async () => {
        // Submit education form to check if there are errors
        await educationFormFormik.submitForm();
        if (!educationFormFormik.isValid) {
            return;
        }

        try {
            // Update student
            const updateStudentResponse = await updateStudent(userId, educationFormFormik.values);
            const updateStudentData = await updateStudentResponse.json();
            if (updateStudentResponse.status === 400) {
                throw new Error(updateStudentData.message);
            }

            // Create interests

            // Create social medias

            // Move to next step in the sign up process
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (err) {
            console.log(err); // unexpected error
        }
    };

    return (
        <ContentContainer>
            <EducationForm formik={educationFormFormik} />
            <Button fullWidth variant="contained" color="primary" onClick={handleNextClick}>
                Next
            </Button>
        </ContentContainer>
    );
}

export default SignUpStep2;
