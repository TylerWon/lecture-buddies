import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
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

// CourseCardWithDelete component
export function CourseCardWithDelete(props) {
    // Props
    const { course, onDelete } = props;

    return (
        <CourseCardBackground>
            <CourseCardDeleteButtonContainer>
                <IconButton size="small" onClick={onDelete}>
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
    );
}
