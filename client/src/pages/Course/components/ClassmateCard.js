import { Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { useContext, useState } from "react";

import { StudentContext } from "../../../contexts/StudentContext";
import { BigProfilePhoto } from "../../../components/atoms/avatar";
import { AddFriendButton, MessageButton } from "../../../components/atoms/button";
import { FriendsIcon } from "../../../components/atoms/icon";
import { DefaultChip } from "../../../components/atoms/chip";

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
export default function ClassmateCard(props) {
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
