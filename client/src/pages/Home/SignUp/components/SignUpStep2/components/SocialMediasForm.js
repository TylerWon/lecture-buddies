import { FormControl, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { AcceptButton, AddButtonWithLabel, CancelButton } from "../../../../../../components/atoms/button";
import { DefaultSelectField, DefaultTextField } from "../../../../../../components/atoms/input";
import { createSocialMedia } from "../../../../../../utils/requests";
import { UserContext } from "../../../../../../contexts/UserContext";

// Constants
const PLATFORMS = [
    { platform_id: "Facebook", platform_name: "Facebook" },
    { platform_id: "Instagram", platform_name: "Instagram" },
    { platform_id: "LinkedIn", platform_name: "LinkedIn" },
    { platform_id: "Twitter", platform_name: "Twitter" },
];

// Yup validation schema for form
const validationSchema = yup.object({
    platform: yup.string().required("Platform is required"),
    url: yup.string().url("Enter a valid URL").required("URL is required"),
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

// Container for added social medias
const AddedSocialMediasContainer = styled(Grid)(({ theme }) => ({}));

// Container for form content
const FormContentContainer = styled(Grid)(({ theme }) => ({
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(1),
}));

export default function SocialMediasForm() {
    // Hooks
    const { userId } = useContext(UserContext);
    const formik = useFormik({
        initialValues: {
            platform: "",
            url: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleAddSocialMediaFormSubmit(values);
        },
    });
    const [showAddSocialMediaForm, setShowAddSocialMediaForm] = useState(false);
    const [socialMedias, setSocialMedias] = useState([]);

    // Handler for when delete social media button is clicked
    const handleDeleteSocialMediaClick = async (socialMediaId) => {};

    // Handler for when add social media button is clicked
    const handleAddSocialMediaButtonClick = () => {
        setShowAddSocialMediaForm(true);
    };

    // Handler for when cancel add social media button is clicked
    const handleCancelAddSocialMediaClick = () => {
        setShowAddSocialMediaForm(false);
        formik.resetForm();
    };

    // Handler for when the add social media form is submitted
    const handleAddSocialMediaFormSubmit = async (values) => {
        try {
            // Create social media
            const createSocialMediaResponse = await createSocialMedia({
                student_id: userId,
                ...values,
            });
            const createSocialMediaData = await createSocialMediaResponse.json();
            if (createSocialMediaResponse.status === 400) {
                throw new Error(createSocialMediaData.message);
            }

            // Add social medias to socialMedias state
            setSocialMedias([...socialMedias, createSocialMediaData]);

            // Close add interest form
            handleCancelAddSocialMediaClick();
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    return (
        <ContentContainer>
            <HeaderContainer>
                <Typography variant="body1">Social medias</Typography>
                {socialMedias.map((socialMedia) => (
                    <Grid
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        key={socialMedia.social_media_id}
                        container
                        spacing={1}
                    >
                        <Grid xs={3.2}>
                            <Typography variant="body1">{socialMedia.social_media_platform}</Typography>
                        </Grid>
                        <Grid xs={8.1}>
                            <TextField
                                fullWidth
                                defaultValue={socialMedia.social_media_url}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid xs>
                            <CancelButton onClick={() => handleDeleteSocialMediaClick(socialMedia.social_media_id)} />
                        </Grid>
                    </Grid>
                ))}
            </HeaderContainer>
            {showAddSocialMediaForm ? (
                <FormControl fullWidth component="form" onSubmit={formik.handleSubmit}>
                    <FormContentContainer container>
                        <Grid xs={3}>
                            <DefaultSelectField id="platform" label="Platform" formik={formik} options={PLATFORMS} />
                        </Grid>
                        <Grid xs={7}>
                            <DefaultTextField id="url" label="URL" formik={formik} />
                        </Grid>
                        <Grid xs>
                            <AcceptButton type="submit" />
                        </Grid>
                        <Grid xs>
                            <CancelButton onClick={handleCancelAddSocialMediaClick} />
                        </Grid>
                    </FormContentContainer>
                </FormControl>
            ) : (
                <AddButtonWithLabel label="Add social media" onClick={handleAddSocialMediaButtonClick} />
            )}
        </ContentContainer>
    );
}
