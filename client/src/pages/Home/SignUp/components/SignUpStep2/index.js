import { Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import { useContext } from "react";
import * as yup from "yup";

import { UserContext } from "../../../../../contexts/UserContext";
import { updateStudent } from "../../../../../utils/apiRequests";
import { uploadPfpToS3 } from "../../../../../utils/awsRequests";

import StudentForm from "./components/StudentForm";
import InterestsForm from "./components/InterestsForm";
import SocialMediasForm from "./components/SocialMediasForm";

// Yup validation schema for student form
const studentFormValidationSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    schoolId: yup.number().required("School is required"),
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
    gap: theme.spacing(2),
}));

// SignUpStep2 component
export default function SignUpStep2(props) {
    // Props
    const { setActiveStep, setSelectedSchoolId } = props;

    // Hooks
    const { studentId } = useContext(UserContext);
    const studentFormFormik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            schoolId: "",
            year: "",
            faculty: "",
            major: "",
            bio: "",
            profilePhoto: null,
        },
        validationSchema: studentFormValidationSchema,
        onSubmit: () => {},
    });

    // Handler for when next button is clicked
    const handleNextClick = async () => {
        // Submit student form to check if there are errors
        await studentFormFormik.submitForm();
        if (!studentFormFormik.isValid) {
            return;
        }

        try {
            // If student added a profile photo, upload it to s3
            if (studentFormFormik.values.profilePhoto) {
                uploadPfpToS3(studentFormFormik.values.profilePhoto, studentId);
            }

            // Update student
            const updateStudentResponse = await updateStudent(studentId, {
                first_name: studentFormFormik.values.firstName,
                last_name: studentFormFormik.values.lastName,
                school_id: studentFormFormik.values.schoolId,
                year: studentFormFormik.values.year,
                faculty: studentFormFormik.values.faculty,
                major: studentFormFormik.values.major,
                bio: studentFormFormik.values.bio,
                profile_photo_url: studentFormFormik.values.profilePhoto
                    ? `${process.env.REACT_APP_AWS_S3_BUCKET_URL}/${studentId}`
                    : "",
            });
            const updateStudentData = await updateStudentResponse.json();
            if (updateStudentResponse.status === 400) {
                throw new Error(updateStudentData.message);
            }

            // Set selected school id
            setSelectedSchoolId(studentFormFormik.values.schoolId);

            // Move to next step in the sign up process
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    return (
        <ContentContainer>
            <StudentForm formik={studentFormFormik} />
            <InterestsForm />
            <SocialMediasForm />
            <Button fullWidth variant="contained" color="primary" onClick={handleNextClick}>
                Next
            </Button>
        </ContentContainer>
    );
}
