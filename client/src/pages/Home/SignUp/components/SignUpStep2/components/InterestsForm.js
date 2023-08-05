import { useContext, useState } from "react";
import { FormControl, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import * as yup from "yup";

import { createInterest, deleteInterest } from "../../../../../../utils/apiRequests";
import { UserContext } from "../../../../../../contexts/UserContext";

import { DefaultTextField } from "../../../../../../components/atoms/input";
import { AcceptAndCancelButtons, AddButtonWithLabel } from "../../../../../../components/atoms/button";
import { InterestChipWithDelete } from "../../../../../../components/atoms/chip";

// Yup validation schema for form
const validationSchema = yup.object({
    interest: yup.string().required("Interest is required"),
});

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    gap: theme.spacing(2),
    width: "100%",
}));

// Container for form content
const FormContentContainer = styled(Grid)(({ theme }) => ({
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(1),
}));

// InterestsForm component
export default function InterestsForm() {
    // Hooks
    const { studentId } = useContext(UserContext);
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
    const [interestsAdded, setInterestsAdded] = useState([]);

    // Handler for when delete interest button is clicked
    const handleDeleteInterestClick = async (interestId) => {
        try {
            // Delete interest
            const deleteInterestResponse = await deleteInterest(interestId);
            const deleteInterestData = await deleteInterestResponse.json();
            if (deleteInterestResponse.status === 400) {
                throw new Error(deleteInterestData.message);
            }

            // Remove interest form interestsAdded state
            const newInterests = interestsAdded.filter((interest) => interest.interest_id !== interestId);
            setInterestsAdded(newInterests);
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
            const createInterestResponse = await createInterest({
                student_id: studentId,
                interest_name: values.interest,
            });
            const createInterestData = await createInterestResponse.json();
            if (createInterestResponse.status === 400) {
                throw new Error(createInterestData.message);
            }

            // Add interest to interestsAdded state
            setInterestsAdded([...interestsAdded, createInterestData]);

            // Close add interest form
            handleCancelAddInterestClick();
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    return (
        <ContentContainer>
            <Typography variant="body1">Interests</Typography>
            <Grid container spacing={2}>
                {interestsAdded.map((interest) => (
                    <Grid key={interest.interest_id}>
                        <InterestChipWithDelete
                            label={interest.interest_name}
                            onDelete={() => handleDeleteInterestClick(interest.interest_id)}
                        />
                    </Grid>
                ))}
            </Grid>
            {showAddInterestForm ? (
                <FormControl fullWidth component="form" onSubmit={formik.handleSubmit}>
                    <FormContentContainer container>
                        <Grid xs>
                            <DefaultTextField id="interest" label="Interest" formik={formik} />
                        </Grid>
                        <Grid xs="auto">
                            <AcceptAndCancelButtons
                                acceptButtonProps={{ type: "submit" }}
                                cancelButtonProps={{ onClick: handleCancelAddInterestClick }}
                            />
                        </Grid>
                    </FormContentContainer>
                </FormControl>
            ) : (
                <AddButtonWithLabel label="Add interest" onClick={handleAddInterestClick} />
            )}
        </ContentContainer>
    );
}
