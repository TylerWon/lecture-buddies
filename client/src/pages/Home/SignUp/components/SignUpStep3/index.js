import { useContext, useEffect, useState } from "react";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";

import { deleteEnrolment, getSchool } from "../../../../../utils/apiRequests";

import { AddButtonWithLabel } from "../../../../../components/atoms/button";
import AddCourseForm from "./components/AddCourseForm";
import { UserContext } from "../../../../../contexts/UserContext";

// Container for content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    gap: theme.spacing(2),
    width: "100%",
}));

// Container for course cards
const CourseCardsContainer = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(4),
}));

// Container for course card
const CourseCardContainer = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
}));

// Background for course card
const CourseCardBackground = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
    alignItems: "center",
    width: "250px",
}));

// Container for course card content
const CourseCardContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: `0 ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2)}`,
}));

// Container for course card delete button
const CourseCardDeleteButtonContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
    alignItems: "center",
    width: "100%",
}));

// SignUpStep3 component
export default function SignUpStep3(props) {
    // Props
    const { selectedSchoolId } = props;

    // Hooks
    const { studentId } = useContext(UserContext);
    const [school, setSchool] = useState(null);
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [coursesAdded, setCoursesAdded] = useState([]);

    // Handler for when add course button is clicked
    const handleAddCourseClick = () => {
        setShowAddCourseForm(true);
    };

    // Handler for when delete course button is clicked
    const handleDeleteCourseClick = async (sectionId) => {
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
            <CourseCardsContainer container>
                {coursesAdded.map((course) => (
                    <CourseCardContainer key={course.section_id}>
                        <CourseCardBackground>
                            <CourseCardDeleteButtonContainer>
                                <IconButton size="small" onClick={() => handleDeleteCourseClick(course.section_id)}>
                                    <ClearIcon />
                                </IconButton>
                            </CourseCardDeleteButtonContainer>
                            <CourseCardContentContainer>
                                <Typography variant="h5">{`${course.subject_name} ${course.course_number} ${course.section_number}`}</Typography>
                                <Typography sx={{ textAlign: "center" }} variant="body1">
                                    {course.course_name}
                                </Typography>
                            </CourseCardContentContainer>
                        </CourseCardBackground>
                    </CourseCardContainer>
                ))}
            </CourseCardsContainer>
            {showAddCourseForm ? (
                <AddCourseForm
                    selectedSchoolId={selectedSchoolId}
                    setCoursesAdded={setCoursesAdded}
                    setShowAddCourseForm={setShowAddCourseForm}
                />
            ) : (
                <AddButtonWithLabel label="Add course" onClick={handleAddCourseClick} />
            )}
        </ContentContainer>
    );
}