import { useParams } from "react-router-dom";
import { Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";

import { StudentContext } from "../../contexts/StudentContext";
import { getClassmatesForStudentInSection, getSectionDetails } from "../../utils/apiRequests";
import { BigProfilePhoto } from "../../components/atoms/avatar";
import { AddFriendButton, MessageButton } from "../../components/atoms/button";
import { FriendsIcon } from "../../components/atoms/icon";
import { DefaultChip } from "../../components/atoms/chip";

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

// Background for student card
const ClassmateCardBackground = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
}));

// Container for classmate card content
const ClassmateCardContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(2),
    width: "100%",
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
}));

// Container for classmate card classmate info
const ClassmateCardClassmateInfoContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: theme.spacing(2),
    width: "100%",
}));

// Container for classmate card header
const ClassmateCardHeaderContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
}));

// Container for classmate card header text
const ClassmateCardHeaderTextContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "end",
    gap: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
    },
}));

// Container for classmate card header buttons
const ClassmateCardHeaderButtonsContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// Container for classmate card interests
const ClassmateCardChipsContainer = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// ClassmateCard component
function ClassmateCard(props) {
    // Props
    const { classmate } = props;

    // Hooks
    const { student } = useContext(StudentContext);
    const [friendshipStatus, setFriendshipStatus] = useState(classmate.friendship_status);

    // Updates the friendship status of the classmate with the student (DOESN'T WORK)
    const updateFriendshipStatus = () => {
        setFriendshipStatus("pending");
    };

    return (
        <ClassmateCardBackground>
            <ClassmateCardContentContainer>
                <BigProfilePhoto src={classmate.profile_photo_url} />
                <ClassmateCardClassmateInfoContainer>
                    <ClassmateCardHeaderContainer>
                        <ClassmateCardHeaderTextContainer>
                            <Typography variant="h4">{`${classmate.first_name} ${classmate.last_name}`}</Typography>
                            <Typography sx={{ paddingBottom: "2px" }} variant="body1">
                                {`${classmate.year} year, ${classmate.major} major`}
                            </Typography>
                        </ClassmateCardHeaderTextContainer>
                        <ClassmateCardHeaderButtonsContainer>
                            <MessageButton studentId1={student.student_id} studentId2={classmate.student_id} />
                            {friendshipStatus === "none" && (
                                <AddFriendButton
                                    requestorId={student.student_id}
                                    requesteeId={classmate.student_id}
                                    onSuccess={updateFriendshipStatus}
                                />
                            )}
                            {friendshipStatus === "accepted" && <FriendsIcon />}
                        </ClassmateCardHeaderButtonsContainer>
                    </ClassmateCardHeaderContainer>
                    <ClassmateCardChipsContainer container>
                        <Grid xs="auto">
                            <Typography variant="body1">Interests</Typography>
                        </Grid>
                        {classmate.interests.map((interest, index) => (
                            <Grid key={index} xs="auto">
                                <DefaultChip label={interest.interest_name} />
                            </Grid>
                        ))}
                    </ClassmateCardChipsContainer>
                    <ClassmateCardChipsContainer container>
                        <Grid xs="auto">
                            <Typography variant="body1">Mutual courses</Typography>
                        </Grid>
                        {classmate.mutual_courses_for_term.map((course, index) => (
                            <Grid key={index} xs="auto">
                                <DefaultChip
                                    label={`${course.subject_name} ${course.course_number} ${course.section_number}`}
                                />
                            </Grid>
                        ))}
                    </ClassmateCardChipsContainer>
                </ClassmateCardClassmateInfoContainer>
            </ClassmateCardContentContainer>
        </ClassmateCardBackground>
    );
}

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
                        <ClassmateCard key={index} classmate={classmate} />
                    ))}
                </ClassmateCardsContainer>
            )}
        </ContentContainer>
    );
}
