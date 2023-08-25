import { MenuItem, Select, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";

import { getCourseHistoryForStudent } from "../../utils/apiRequests";
import { StudentContext } from "../../contexts/StudentContext";

import { CourseCardWithLink } from "../../components/atoms/card";

// Container for content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(4),
}));

// Container for the header
const HeaderContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "end",
    width: "100%",
}));

// Container for course cards
const CourseCardsContainer = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(4),
    width: "100%",
}));

// Courses component
export default function Courses() {
    // Hooks
    const { student } = useContext(StudentContext);
    const [courseHistory, setCourseHistory] = useState(null);
    const [terms, setTerms] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState("");

    // Handler for when term is changed
    const handleTermChange = (event) => {
        setSelectedTerm(event.target.value);
    };

    // Initializes course history
    const initCourseHistory = async () => {
        try {
            // Get course history
            const getCourseHistoryForStudentResponse = await getCourseHistoryForStudent(student.student_id, "name");
            const getCourseHistoryForStudentData = await getCourseHistoryForStudentResponse.json();
            if (getCourseHistoryForStudentResponse.status === 400) {
                throw new Error(getCourseHistoryForStudentData.message);
            }

            // Set course history
            setCourseHistory(getCourseHistoryForStudentData);

            // Get terms
            const unorderedTerms = [];
            for (const term in getCourseHistoryForStudentData) {
                if (!unorderedTerms.includes(term)) {
                    unorderedTerms.push(term);
                }
            }

            // Sort terms by name in descending order
            const orderedTerms = unorderedTerms.sort((a, b) => {
                return b.localeCompare(a);
            });

            // Set terms
            setTerms(orderedTerms);

            // Set selectedTerm
            setSelectedTerm(orderedTerms[0]);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Initializes values
    useEffect(() => {
        initCourseHistory();
    }, []);

    return (
        <ContentContainer>
            <HeaderContainer>
                <Typography variant="h1">Courses</Typography>
                {terms.length > 0 && (
                    <Select value={selectedTerm} onChange={handleTermChange}>
                        {terms.map((term, index) => (
                            <MenuItem key={index} value={term}>
                                {term}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </HeaderContainer>
            {courseHistory && (
                <CourseCardsContainer container>
                    {courseHistory[selectedTerm].map((course) => (
                        <Grid key={course.section_id} xs="auto">
                            <CourseCardWithLink course={course} path={`/courses/${course.section_id}`} />
                        </Grid>
                    ))}
                </CourseCardsContainer>
            )}
        </ContentContainer>
    );
}
