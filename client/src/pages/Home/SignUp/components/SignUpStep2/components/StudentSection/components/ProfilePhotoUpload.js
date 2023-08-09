import { Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

import { BigProfilePhoto } from "../../../../../../../../components/atoms/avatar";

// Container for content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: theme.spacing(1),
}));

// Container for profile photo upload
const UploadContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// Container for profile photo upload button
const UploadButtonContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(1),
}));

// ProfilePhotoUpload component
export default function ProfilePhotoUpload(props) {
    // Props
    const { formik } = props;

    // Hooks
    const [srcUrlForPreview, setSrcUrlForPreview] = useState("");

    // Creates src url for profile photo preview
    const createSrcUrlForPreview = () => {
        return URL.createObjectURL(formik.values.profilePhoto);
    };

    // Handler for when profile photo uploaded
    const handleProfilePhotoChange = (event) => {
        formik.setFieldValue("profilePhoto", event.target.files[0]);
    };

    // Sets src url for profile photo preview when profile photo changes
    useEffect(() => {
        if (formik.values.profilePhoto) {
            setSrcUrlForPreview(createSrcUrlForPreview());
        }
    }, [formik.values.profilePhoto]);

    return (
        <ContentContainer>
            <Typography variant="body1">Profile photo</Typography>
            <UploadContainer>
                <BigProfilePhoto src={srcUrlForPreview} />
                <UploadButtonContainer>
                    <Button variant="outlined" component="label">
                        Upload
                        <input hidden type="file" accept="image/*" onChange={handleProfilePhotoChange} />
                    </Button>
                    <Typography variant="caption" noWrap sx={{ maxWidth: "200px" }}>
                        {formik.values.profilePhoto ? formik.values.profilePhoto.name : "No file chosen"}
                    </Typography>
                </UploadButtonContainer>
            </UploadContainer>
        </ContentContainer>
    );
}
