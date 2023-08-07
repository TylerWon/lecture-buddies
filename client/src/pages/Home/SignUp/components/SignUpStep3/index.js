import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";

import { deleteEnrolment, getSchool } from "../../../../../utils/apiRequests";

import { AddButtonWithLabel } from "../../../../../components/atoms/button";
import { UserContext } from "../../../../../contexts/UserContext";
import { CourseCardWithDelete } from "../../../../../components/atoms/card";
import AddCourseForm from "./components/AddCourseForm";

// Container for content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    gap: theme.spacing(2),
    width: "100%",
}));

// SignUpStep3 component
export default function SignUpStep3(props) {
    // Props
    const { selectedSchoolId } = props;

    // Hooks
    const { setIsLoggedIn, studentId } = useContext(UserContext);
    const navigate = useNavigate();
    const [school, setSchool] = useState(null);
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [coursesAdded, setCoursesAdded] = useState([]);

    // Handler for when add course button is clicked
    const handleAddCourseClick = () => {
        setShowAddCourseForm(true);
    };

    // Handler for when course is deleted
    const handleCourseDelete = async (sectionId) => {
        try {
            // Delete enrolment
            const deleteEnrolmentResponse = await deleteEnrolment(studentId, sectionId);
            const deleteEnrolmentData = await deleteEnrolmentResponse.json();
            if (deleteEnrolmentResponse.status === 400) {
                throw new Error(deleteEnrolmentData.message);
            }

            // Remove course from coursesAdded state
            const newCoursesAdded = coursesAdded.filter((course) => course.section_id !== sectionId);
            setCoursesAdded(newCoursesAdded);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Handler for when done button is clicked
    const handleDoneClick = () => {
        // Set isLoggedIn in the user context
        setIsLoggedIn(true);

        // Navigate to courses page
        navigate("/courses");
    };

    // Initializes school state
    const initSchool = async () => {
        try {
            // Get school
            const getSchoolResponse = await getSchool(selectedSchoolId);
            const getSchoolData = await getSchoolResponse.json();
            if (getSchoolResponse.status !== 200) {
                throw new Error(getSchoolData.message);
            }

            // Set school state
            setSchool(getSchoolData);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Initializes values
    useEffect(() => {
        initSchool();
    }, []);

    return (
        <ContentContainer>
            <Typography variant="h5">Current term - {school?.current_term}</Typography>
            <Grid sx={{ justifyContent: "space-evenly" }} container spacing={2}>
                {coursesAdded.map((course) => (
                    <Grid sx={{ display: "flex" }} key={course.section_id} xs="auto">
                        <CourseCardWithDelete course={course} onDelete={() => handleCourseDelete(course.section_id)} />
                    </Grid>
                ))}
            </Grid>
            {showAddCourseForm ? (
                <AddCourseForm
                    selectedSchoolId={selectedSchoolId}
                    setCoursesAdded={setCoursesAdded}
                    setShowAddCourseForm={setShowAddCourseForm}
                />
            ) : (
                <AddButtonWithLabel label="Add course" onClick={handleAddCourseClick} />
            )}
            <Button fullWidth variant="contained" color="primary" onClick={handleDoneClick}>
                Done
            </Button>
        </ContentContainer>
    );
}
