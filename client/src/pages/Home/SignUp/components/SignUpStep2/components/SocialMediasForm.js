import { FormControl, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { createSocialMedia, deleteSocialMedia } from "../../../../../../utils/apiRequests";
import { UserContext } from "../../../../../../contexts/UserContext";

import { AcceptAndCancelButtons, AddButtonWithLabel } from "../../../../../../components/atoms/button";
import { DefaultSelectField, DefaultTextField } from "../../../../../../components/atoms/input";
import { SocialMediaIconWithDelete } from "../../../../../../components/atoms/icon";

// Constants
const PLATFORMS = [
    { platform_value: "facebook", platform_text: "Facebook", disabled: false },
    { platform_value: "instagram", platform_text: "Instagram", disabled: false },
    { platform_value: "linkedin", platform_text: "LinkedIn", disabled: false },
    { platform_value: "twitter", platform_text: "Twitter", disabled: false },
];

// Yup validation schema for form
const validationSchema = yup.object({
    socialMediaPlatform: yup.string().required("Platform is required"),
    socialMediaUrl: yup.string().url("Enter a valid URL").required("URL is required"),
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
    alignItems: "stretch",
    gap: theme.spacing(2),
}));

// SocialMediasForm component
export default function SocialMediasForm() {
    // Hooks
    const { studentId } = useContext(UserContext);
    const formik = useFormik({
        initialValues: {
            socialMediaPlatform: "",
            socialMediaUrl: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleAddSocialMediaFormSubmit(values);
        },
    });
    const [showAddSocialMediaForm, setShowAddSocialMediaForm] = useState(false);
    const [socialMediasAdded, setSocialMediasAdded] = useState([]);

    // Handler for when delete social media button is clicked
    const handleDeleteSocialMediaClick = async (socialMediaId, socialMediaPlatform) => {
        try {
            // Delete social media
            const deleteSocialMediaResponse = await deleteSocialMedia(socialMediaId);
            const deleteSocialMediaData = await deleteSocialMediaResponse.json();
            if (deleteSocialMediaResponse.status === 400) {
                throw new Error(deleteSocialMediaData.message);
            }

            // Remove social media from socialMediasAdded state
            const newSocialMedias = socialMediasAdded.filter(
                (socialMedia) => socialMedia.social_media_id !== socialMediaId
            );
            setSocialMediasAdded(newSocialMedias);

            // Re-enable social media as option in select field
            const platform = PLATFORMS.find((platform) => platform.platform_value === socialMediaPlatform);
            platform.disabled = false;
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

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
                student_id: studentId,
                social_media_platform: values.socialMediaPlatform,
                social_media_url: values.socialMediaUrl,
            });
            const createSocialMediaData = await createSocialMediaResponse.json();
            if (createSocialMediaResponse.status === 400) {
                throw new Error(createSocialMediaData.message);
            }

            // Add social media to socialMediasAdded state
            setSocialMediasAdded([...socialMediasAdded, createSocialMediaData]);

            // Disable social media as option in select field
            const platform = PLATFORMS.find((platform) => platform.platform_value === values.socialMediaPlatform);
            platform.disabled = true;

            // Close add interest form
            handleCancelAddSocialMediaClick();
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    return (
        <ContentContainer>
            <Typography variant="body1">Social medias</Typography>
            <Grid container spacing={2}>
                {socialMediasAdded.map((socialMedia) => (
                    <Grid key={socialMedia.social_media_id}>
                        <SocialMediaIconWithDelete
                            network={socialMedia.social_media_platform}
                            url={socialMedia.social_media_url}
                            onDelete={() =>
                                handleDeleteSocialMediaClick(
                                    socialMedia.social_media_id,
                                    socialMedia.social_media_platform
                                )
                            }
                        />
                    </Grid>
                ))}
            </Grid>
            {showAddSocialMediaForm ? (
                <FormControl fullWidth component="form" onSubmit={formik.handleSubmit}>
                    <FormContentContainer container>
                        <Grid xs={3}>
                            <DefaultSelectField
                                id="socialMediaPlatform"
                                label="Platform"
                                options={PLATFORMS}
                                optionValueField="platform_value"
                                optionTextField="platform_text"
                                formik={formik}
                            />
                        </Grid>
                        <Grid xs>
                            <DefaultTextField id="socialMediaUrl" label="URL" formik={formik} />
                        </Grid>
                        <Grid sx={{ display: "flex", alignItems: "center" }} xs="auto">
                            <AcceptAndCancelButtons
                                acceptButtonProps={{ type: "submit" }}
                                cancelButtonProps={{ onClick: handleCancelAddSocialMediaClick }}
                            />
                        </Grid>
                    </FormContentContainer>
                </FormControl>
            ) : (
                <AddButtonWithLabel label="Add social media" onClick={handleAddSocialMediaButtonClick} />
            )}
        </ContentContainer>
    );
}
