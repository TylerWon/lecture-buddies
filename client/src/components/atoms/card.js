import { Box, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Background for course card
const CourseCardBackground = styled(Paper)(({ theme }) => ({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "250px",
    minHeight: "125px",
}));

// Container for course card delete button
const CourseCardDeleteButtonContainer = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 0,
    right: 0,
}));

// Container for course card content
const CourseCardContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: theme.spacing(2),
}));

// BaseCourseCard component
function BaseCourseCard(props) {
    // Props
    const { course, deleteButton } = props;

    return (
        <CourseCardBackground>
            {deleteButton && <CourseCardDeleteButtonContainer>{deleteButton}</CourseCardDeleteButtonContainer>}
            <CourseCardContentContainer>
                <Typography variant="h5">{`${course.subject_name} ${course.course_number} ${course.section_number}`}</Typography>
                <Typography sx={{ textAlign: "center" }} variant="body1">
                    {course.course_name}
                </Typography>
            </CourseCardContentContainer>
        </CourseCardBackground>
    );
}

// CourseCard component
export function CourseCard(props) {
    // Props
    const { course } = props;

    return <BaseCourseCard course={course} deleteButton={null} />;
}

// CourseCardWithDelete component
export function CourseCardWithDelete(props) {
    // Props
    const { course, deleteButton } = props;

    return <BaseCourseCard course={course} deleteButton={deleteButton} />;
}
