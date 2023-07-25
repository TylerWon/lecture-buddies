import { useContext, useState } from "react";
import { Chip, FormControl, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";

import { createInterest, deleteInterest } from "../../../../../../utils/requests";
import { UserContext } from "../../../../../../contexts/UserContext";

import { DefaultTextField } from "../../../../../../components/atoms/input";
import { DefaultAcceptButton, DefaultAddButton, DefaultCancelButton } from "../../../../../../components/atoms/button";

// Yup validation schema for form
const validationSchema = yup.object({
    interest: yup.string().required("Interest is required"),
});

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
    width: "100%",
}));

// Container for the header
const HeaderContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: theme.spacing(1.5),
    width: "100%",
}));

// Container for form content
const FormContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(1),
}));

// Container for add interest button
const AddInterestButtonContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}));

// InterestsForm component
function InterestsForm() {
    // Hooks
    const { userId } = useContext(UserContext);
    const formik = useFormik({
        initialValues: {
            interest: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleAddInterestFormSubmit(values);
        },
    });
    const [showAddInterestForm, setShowAddInterestForm] = useState(false);
    const [interests, setInterests] = useState([]);

    // Handler for when delete interest button is clicked
    const handleDeleteInterestClick = async (interestId) => {
        try {
            // Delete interest
            const deleteInterestResponse = await deleteInterest(interestId);
            const deleteInterestData = await deleteInterestResponse.json();
            if (deleteInterestResponse.status === 400) {
                throw new Error(deleteInterestData.message);
            }

            // Remove interest form interests state
            const newInterests = interests.filter((interest) => interest.interest_id !== interestId);
            setInterests(newInterests);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Handler for when add interest button is clicked
    const handleAddInterestClick = () => {
        setShowAddInterestForm(true);
    };

    // Handler for when cancel add interest button is clicked
    const handleCancelAddInterestClick = () => {
        setShowAddInterestForm(false);
        formik.resetForm();
    };

    // Handler for when the add interest form is submitted
    const handleAddInterestFormSubmit = async (values) => {
        try {
            // Create interest
            const createInterestResponse = await createInterest({ student_id: userId, interest: values.interest });
            const createInterestData = await createInterestResponse.json();
            if (createInterestResponse.status === 400) {
                throw new Error(createInterestData.message);
            }

            // Add interest to interests state
            setInterests([...interests, createInterestData]);

            // Close add interest form
            handleCancelAddInterestClick();
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    return (
        <ContentContainer>
            <HeaderContainer>
                <Typography variant="body1">Interests</Typography>
                <Grid container spacing={1}>
                    {interests.map((interest) => (
                        <Grid key={interest.interest_id}>
                            <Chip
                                variant="outlined"
                                label={interest.interest_name}
                                onDelete={() => handleDeleteInterestClick(interest.interest_id)}
                                deleteIcon={<CloseIcon />}
                            />
                        </Grid>
                    ))}
                </Grid>
            </HeaderContainer>
            {showAddInterestForm ? (
                <FormControl fullWidth component="form" onSubmit={formik.handleSubmit}>
                    <FormContentContainer>
                        <DefaultTextField id="interest" label="Interest" formik={formik} />
                        <DefaultAcceptButton type="submit" />
                        <DefaultCancelButton onClick={handleCancelAddInterestClick} />
                    </FormContentContainer>
                </FormControl>
            ) : (
                <AddInterestButtonContainer>
                    <DefaultAddButton onClick={handleAddInterestClick} />
                    <Typography variant="body1">Add Interest</Typography>
                </AddInterestButtonContainer>
            )}
        </ContentContainer>
    );
}

export default InterestsForm;
