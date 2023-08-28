import { useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";

import { StudentContext } from "../../contexts/StudentContext";
import { getClassmatesForStudentInSection, getSectionDetails } from "../../utils/apiRequests";
import ClassmateCard from "./components/ClassmateCard";

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
    alignItems: "center",
    width: "100%",
}));

// Container for header text
const HeaderTextContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "end",
    gap: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
    },
}));

// Container for student cards
const ClassmateCardsContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    gap: theme.spacing(4),
    width: "100%",
}));

// Course component
export default function Course() {
    // Hooks
    const { sectionId } = useParams();
    const { student } = useContext(StudentContext);
    const [sectionDetails, setSectionDetails] = useState(null);
    const [classmates, setClassmates] = useState([]);

    // Initializes sectionDetails state
    const initSectionDetails = async () => {
        try {
            // Get section details
            const getSectionDetailsResponse = await getSectionDetails(sectionId);
            const getSectionDetailsData = await getSectionDetailsResponse.json();
            if (getSectionDetailsResponse.status === 400) {
                throw new Error(getSectionDetailsData.message);
            }

            // Set sectionDetails state
            setSectionDetails(getSectionDetailsData);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Initializes classmates state
    const initClassmates = async () => {
        try {
            // Get classmates
            const getClassmatesForStudentInSectionResponse = await getClassmatesForStudentInSection(
                student.student_id,
                sectionId,
                "name",
                0,
                100
            );
            const getClassmatesForStudentInSectionData = await getClassmatesForStudentInSectionResponse.json();
            if (getClassmatesForStudentInSectionResponse.status === 400) {
                throw new Error(getClassmatesForStudentInSectionData.message);
            }

            // Set classmates state
            setClassmates(getClassmatesForStudentInSectionData);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Initializes values
    useEffect(() => {
        initSectionDetails();
        initClassmates();
    }, []);

    return (
        <ContentContainer>
            <HeaderContainer>
                {sectionDetails && (
                    <HeaderTextContainer>
                        <Typography variant="h1">
                            {`${sectionDetails.subject_name} ${sectionDetails.course_number} ${sectionDetails.section_number} (${sectionDetails.section_term})`}
                        </Typography>
                        <Typography sx={{ paddingBottom: "2px" }} variant="body1">
                            {sectionDetails.course_name}
                        </Typography>
                    </HeaderTextContainer>
                )}
            </HeaderContainer>
            {classmates.length > 0 && (
                <ClassmateCardsContainer>
                    {classmates.map((classmate, index) => (
                        <ClassmateCard
                            key={index}
                            classmate={classmate}
                            classmates={classmates}
                            setClassmates={setClassmates}
                        />
                    ))}
                </ClassmateCardsContainer>
            )}
        </ContentContainer>
    );
}
