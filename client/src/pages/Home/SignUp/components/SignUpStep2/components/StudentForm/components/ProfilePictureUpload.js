import { Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

import { ProfilePicture } from "../../../../../../../../components/atoms/icon";

// Container for content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: theme.spacing(1),
}));

// Container for profile picture upload
const UploadContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// Container for profile picture upload button
const UploadButtonContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(1),
}));

// ProfilePictureUpload component
export function ProfilePictureUpload(props) {
    // Props
    const { formik } = props;

    // Hooks
    const [srcUrlForPreview, setSrcUrlForPreview] = useState("");

    // Creates src url for profile picture preview
    const createSrcUrlForPreview = () => {
        return URL.createObjectURL(formik.values.profilePicture);
    };

    // Handler for when profile picture uploaded
    const handleProfilePictureChange = (event) => {
        formik.setFieldValue("profilePicture", event.target.files[0]);
    };

    // Sets src url for profile picture preview when profile picture changes
    useEffect(() => {
        if (formik.values.profilePicture) {
            setSrcUrlForPreview(createSrcUrlForPreview());
        }
    }, [formik.values.profilePicture]);

    return (
        <ContentContainer>
            <Typography variant="body1">Profile picture</Typography>
            <UploadContainer>
                {formik.values.profilePicture ? <ProfilePicture src={srcUrlForPreview} /> : <ProfilePicture />}
                <UploadButtonContainer>
                    <Button variant="outlined" component="label">
                        Upload
                        <input hidden type="file" accept="image/*" onChange={handleProfilePictureChange} />
                    </Button>
                    <Typography variant="caption" noWrap sx={{ maxWidth: "200px" }}>
                        {formik.values.profilePicture ? formik.values.profilePicture.name : "No file chosen"}
                    </Typography>
                </UploadButtonContainer>
            </UploadContainer>
        </ContentContainer>
    );
}
