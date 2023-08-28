import { Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { useContext, useState } from "react";

import { StudentContext } from "../../../contexts/StudentContext";

import { BigProfilePhoto } from "../../../components/atoms/avatar";
import { AddFriendButton, MessageButton } from "../../../components/atoms/button";
import { FriendsIcon } from "../../../components/atoms/icon";
import { DefaultChip } from "../../../components/atoms/chip";
import ClassmateInfoDialog from "./ClassmateInfoDialog";

// Background for the card
const CardBackground = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
}));

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
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

// Container for classmate info
const ClassmateInfoContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: theme.spacing(2),
    width: "100%",
}));

// Container for header
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
    justifyContent: "center",
    alignItems: "end",
    gap: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
    },
}));

// Container for header buttons
const HeaderButtonsContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// Container for chips
const ChipsContainer = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// ClassmateCard component
export default function ClassmateCard(props) {
    // Props
    const { classmate, classmates, setClassmates } = props;

    // Hooks
    const { student } = useContext(StudentContext);
    const [showClassmateInfoDialog, setShowClassmateInfoDialog] = useState(false);

    // Updates the friendship status of the classmate with the student
    const updateFriendshipStatus = () => {
        const updatedClassmates = classmates.map((c) => {
            if (c.student_id === classmate.student_id) {
                return { ...c, friendship_status: "pending" };
            }
            return c;
        });
        setClassmates(updatedClassmates);
    };

    // Handler for when classmate card is clicked
    const handleClassmateCardClick = () => {
        setShowClassmateInfoDialog(true);
    };

    return (
        <>
            <CardBackground onClick={handleClassmateCardClick}>
                <ContentContainer>
                    <BigProfilePhoto src={classmate.profile_photo_url} />
                    <ClassmateInfoContainer>
                        <HeaderContainer>
                            <HeaderTextContainer>
                                <Typography variant="h4">{`${classmate.first_name} ${classmate.last_name}`}</Typography>
                                <Typography sx={{ paddingBottom: "2px" }} variant="body1">
                                    {`${classmate.year} year, ${classmate.major} major`}
                                </Typography>
                            </HeaderTextContainer>
                            <HeaderButtonsContainer>
                                <MessageButton studentId1={student.student_id} studentId2={classmate.student_id} />
                                {classmate.friendship_status === "none" && (
                                    <AddFriendButton
                                        requestorId={student.student_id}
                                        requesteeId={classmate.student_id}
                                        onSuccess={updateFriendshipStatus}
                                    />
                                )}
                                {classmate.friendship_status === "accepted" && <FriendsIcon />}
                            </HeaderButtonsContainer>
                        </HeaderContainer>
                        <ChipsContainer container>
                            <Grid xs="auto">
                                <Typography variant="body1">Interests</Typography>
                            </Grid>
                            {classmate.interests.map((interest, index) => (
                                <Grid key={index} xs="auto">
                                    <DefaultChip label={interest.interest_name} />
                                </Grid>
                            ))}
                        </ChipsContainer>
                        <ChipsContainer container>
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
                        </ChipsContainer>
                    </ClassmateInfoContainer>
                </ContentContainer>
            </CardBackground>
            <ClassmateInfoDialog
                showClassmateInfoDialog={showClassmateInfoDialog}
                setShowClassmateInfoDialog={setShowClassmateInfoDialog}
                classmate={classmate}
            />
        </>
    );
}
