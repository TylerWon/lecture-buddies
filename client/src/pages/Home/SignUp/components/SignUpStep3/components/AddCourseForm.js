import { useContext, useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import * as yup from "yup";

import {
    createEnrolment,
    getCoursesForSubject,
    getSectionsForCourse,
    getSubjectsForSchool,
} from "../../../../../../utils/apiRequests";
import { UserContext } from "../../../../../../contexts/UserContext";

import { AcceptAndCancelButtons } from "../../../../../../components/atoms/button";
import { DefaultSelectField, SelectFieldWithCustomHandleChange } from "../../../../../../components/atoms/input";

// Yup validation schema for form
const validationSchema = yup.object({
    subject: yup.object().required("Subject is required"),
    course: yup.object().required("Course # is required"),
    section: yup.object().required("Section is required"),
});

// Container for form content
const FormContentContainer = styled(Grid)(({ theme }) => ({
    justifyContent: "center",
    alignItems: "stretch",
    gap: theme.spacing(2),
}));

// AddCourseForm component
export default function AddCourseForm(props) {
    // Props
    const { selectedSchoolId, setCoursesAdded, setShowAddCourseForm } = props;

    // Hooks
    const { studentId } = useContext(UserContext);
    const formik = useFormik({
        initialValues: {
            subject: "",
            course: "",
            section: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleAddCourseFormSubmit(values);
        },
    });
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [courseNumSelectDisabled, setCourseNumSelectDisabled] = useState(true);
    const [sectionSelectDisabled, setSectionSelectDisabled] = useState(true);

    // Handler for when add course form is submitted
    const handleAddCourseFormSubmit = async (values) => {
        try {
            // Create enrolment
            const createEnrolmentResponse = await createEnrolment({
                student_id: studentId,
                section_id: values.section.section_id,
            });
            if (createEnrolmentResponse.status === 400) {
                formik.setErrors({
                    subject: "Course already added",
                    course: " ",
                    section: " ",
                });
                return;
            }

            // Add course to coursesAdded state
            setCoursesAdded((prevCoursesAdded) => [
                ...prevCoursesAdded,
                { ...values.subject, ...values.course, ...values.section },
            ]);

            // Close add course form
            handleCancelAddCourseClick();
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Handler for when cancel add course button is clicked
    const handleCancelAddCourseClick = () => {
        // Hide add course form
        setShowAddCourseForm(false);

        // Disable course number and section select fields
        setCourseNumSelectDisabled(true);
        setSectionSelectDisabled(true);

        // Reset formik form
        formik.resetForm();
    };

    // Handler for when subject select field is closed
    const handleSubjectChange = async (event) => {
        const subject = event.target.value;

        // Set subject formik value
        await formik.setFieldValue("subject", subject);

        // Reset courses and sections formik values
        await formik.setFieldValue("course", "");
        await formik.setFieldValue("section", "");

        // Reset courses and sections states
        setCourses([]);
        setSections([]);

        // Disable course number and section select fields
        setCourseNumSelectDisabled(true);
        setSectionSelectDisabled(true);

        try {
            // Get courses for subject
            const getCoursesForSubjectResponse = await getCoursesForSubject(subject.subject_id);
            const getCoursesForSubjectData = await getCoursesForSubjectResponse.json();
            if (getCoursesForSubjectResponse.status !== 200) {
                throw new Error(getCoursesForSubjectData.message);
            }

            // Set courses state
            setCourses(getCoursesForSubjectData);

            // Enable course number select field
            setCourseNumSelectDisabled(false);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Handler for when course number select field is closed
    const handleCourseNumChange = async (event) => {
        const course = event.target.value;

        // Set course formik value
        await formik.setFieldValue("course", course);

        // Reset sections formik value
        await formik.setFieldValue("section", "");

        // Reset sections state
        setSections([]);

        // Disable section select field
        setSectionSelectDisabled(true);

        try {
            // Get sections for course
            const getSectionsForCourseResponse = await getSectionsForCourse(course.course_id);
            const getSectionsForCourseData = await getSectionsForCourseResponse.json();
            if (getSectionsForCourseResponse.status !== 200) {
                throw new Error(getSectionsForCourseData.message);
            }

            // Set sections state
            setSections(getSectionsForCourseData);

            // Enable section select field
            setSectionSelectDisabled(false);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Initializes subjects state
    const initSubjects = async () => {
        try {
            // Get subjects for school
            const getSubjectsForSchoolResponse = await getSubjectsForSchool(selectedSchoolId);
            const getSubjectsForSchoolData = await getSubjectsForSchoolResponse.json();
            if (getSubjectsForSchoolResponse.status !== 200) {
                throw new Error(getSubjectsForSchoolData.message);
            }

            // Set subjects state
            setSubjects(getSubjectsForSchoolData);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Initializes values
    useEffect(() => {
        initSubjects();
    }, []);

    return (
        <FormControl fullWidth component="form" onSubmit={formik.handleSubmit}>
            <FormContentContainer container>
                <Grid xs={12} sm>
                    <SelectFieldWithCustomHandleChange
                        id="subject"
                        label="Subject"
                        handleChange={handleSubjectChange}
                        options={subjects}
                        optionAsValue={true}
                        optionTextField="subject_name"
                        formik={formik}
                    />
                </Grid>
                <Grid xs={12} sm>
                    <SelectFieldWithCustomHandleChange
                        id="course"
                        label="Course #"
                        handleChange={handleCourseNumChange}
                        options={courses}
                        optionAsValue={true}
                        optionTextField="course_number"
                        formik={formik}
                        disabled={courseNumSelectDisabled}
                    />
                </Grid>
                <Grid xs={12} sm>
                    <DefaultSelectField
                        id="section"
                        label="Section"
                        options={sections}
                        optionAsValue={true}
                        optionTextField="section_number"
                        formik={formik}
                        disabled={sectionSelectDisabled}
                    />
                </Grid>
                <Grid sx={{ display: "flex", alignItems: "center" }} xs="auto">
                    <AcceptAndCancelButtons
                        acceptButtonProps={{ type: "submit" }}
                        cancelButtonProps={{ onClick: handleCancelAddCourseClick }}
                    />
                </Grid>
            </FormContentContainer>
        </FormControl>
    );
}
