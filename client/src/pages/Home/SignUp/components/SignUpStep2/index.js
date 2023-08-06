import { Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import { useContext } from "react";
import * as yup from "yup";

import { UserContext } from "../../../../../contexts/UserContext";
import { updateStudent } from "../../../../../utils/apiRequests";
import { uploadPfpToS3 } from "../../../../../utils/awsRequests";

import StudentSection from "./components/StudentSection";
import InterestsSection from "./components/InterestsSection";
import SocialMediasSection from "./components/SocialMediasSection";

// Yup validation schema for student section form
const studentSectionFormValidationSchema = yup.object({
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
    const studentSectionFormFormik = useFormik({
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
        validationSchema: studentSectionFormValidationSchema,
        onSubmit: () => {},
    });

    // Handler for when next button is clicked
    const handleNextClick = async () => {
        // Submit student form to check if there are errors
        await studentSectionFormFormik.submitForm();
        if (!studentSectionFormFormik.isValid) {
            return;
        }

        try {
            // If student added a profile photo, upload it to s3
            if (studentSectionFormFormik.values.profilePhoto) {
                uploadPfpToS3(studentSectionFormFormik.values.profilePhoto, studentId);
            }

            // Update student
            const updateStudentResponse = await updateStudent(studentId, {
                first_name: studentSectionFormFormik.values.firstName,
                last_name: studentSectionFormFormik.values.lastName,
                school_id: studentSectionFormFormik.values.schoolId,
                year: studentSectionFormFormik.values.year,
                faculty: studentSectionFormFormik.values.faculty,
                major: studentSectionFormFormik.values.major,
                bio: studentSectionFormFormik.values.bio,
                profile_photo_url: studentSectionFormFormik.values.profilePhoto
                    ? `${process.env.REACT_APP_AWS_S3_BUCKET_URL}/${studentId}`
                    : "",
            });
            const updateStudentData = await updateStudentResponse.json();
            if (updateStudentResponse.status === 400) {
                throw new Error(updateStudentData.message);
            }

            // Set selected school id
            setSelectedSchoolId(studentSectionFormFormik.values.schoolId);

            // Move to next step in the sign up process
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    return (
        <ContentContainer>
            <StudentSection formik={studentSectionFormFormik} />
            <InterestsSection />
            <SocialMediasSection />
            <Button fullWidth variant="contained" color="primary" onClick={handleNextClick}>
                Next
            </Button>
        </ContentContainer>
    );
}
