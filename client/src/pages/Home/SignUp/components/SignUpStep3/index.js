import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormHelperText, IconButton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";

import { deleteEnrolment, getSchool } from "../../../../../utils/apiRequests";

import { AddButtonWithLabel } from "../../../../../components/atoms/button";
import { StudentContext } from "../../../../../contexts/StudentContext";
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

// Container for header
const HeaderContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "end",
    gap: theme.spacing(1),
}));

// Container for course cards
const CourseCardsContainer = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    rowGap: theme.spacing(3),
    width: "100%",
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
    },
}));

// Container for course card
const CourseCardContainer = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}));

// SignUpStep3 component
export default function SignUpStep3(props) {
    // Props
    const { selectedSchoolId } = props;

    // Hooks
    const { setIsLoggedIn, student } = useContext(StudentContext);
    const navigate = useNavigate();
    const [school, setSchool] = useState(null);
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [coursesAdded, setCoursesAdded] = useState([]);
    const [minCourseError, setMinCourseError] = useState(false);

    // Handler for when add course button is clicked
    const handleAddCourseClick = () => {
        setShowAddCourseForm(true);
    };

    // Handler for when course is deleted
    const handleCourseDelete = async (sectionId) => {
        try {
            // Delete enrolment
            const deleteEnrolmentResponse = await deleteEnrolment(student.student_id, sectionId);
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
        // Check if at least one course has been added
        if (coursesAdded.length < 1) {
            setMinCourseError(true);
            return;
        }

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
            <HeaderContainer>
                <Typography variant="h5">Current term - {school?.current_term}</Typography>
                <FormHelperText sx={{ paddingBottom: "2px", display: minCourseError ? "block" : "none" }} error>
                    Add at least one course
                </FormHelperText>
            </HeaderContainer>
            <CourseCardsContainer container>
                {coursesAdded.map((course) => (
                    <CourseCardContainer key={course.section_id} xs="auto" sm={4}>
                        <CourseCardWithDelete
                            course={course}
                            deleteButton={
                                <IconButton size="small" onClick={() => handleCourseDelete(course.section_id)}>
                                    <ClearIcon />
                                </IconButton>
                            }
                        />
                    </CourseCardContainer>
                ))}
            </CourseCardsContainer>
            {showAddCourseForm ? (
                <AddCourseForm
                    school={school}
                    setCoursesAdded={setCoursesAdded}
                    setShowAddCourseForm={setShowAddCourseForm}
                    setMinCourseError={setMinCourseError}
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
