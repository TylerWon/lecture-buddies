import { Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";

import { getSchools } from "../../../../../../utils/requests";

import { DefaultSelectField, DefaultTextArea, DefaultTextField } from "../../../../../../components/atoms/input";
import { ProfilePicture } from "../../../../../../components/atoms/icon";

// Constants
const YEARS = [
    { year_id: "1st", year_name: "1st" },
    { year_id: "2nd", year_name: "2nd" },
    { year_id: "3rd", year_name: "3rd" },
    { year_id: "4th", year_name: "4th" },
    { year_id: "5th", year_name: "5th" },
    { year_id: "5th+", year_name: "5th+" },
];

// Container for content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: theme.spacing(2),
}));

// Container for profile picture upload
const ProfilePictureUploadContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: theme.spacing(1),
}));

// Container for profile picture upload content
const ProfilePictureUploadContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(2),
}));

// Container for profile picture upload button
const ProfilePictureUploadButtonContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: theme.spacing(1),
}));

// ProfilePictureUploadButton component
function ProfilePictureUploadButton(props) {
    // Props
    const { formik } = props;

    // Handler for when profile picture uploaded
    const handleProfilePictureChange = (event) => {
        formik.setFieldValue("profilePicture", event.target.files[0]);
    };

    return (
        <ProfilePictureUploadButtonContainer>
            <Button variant="outlined" component="label">
                Upload
                <input hidden type="file" accept="image/*" onChange={handleProfilePictureChange} />
            </Button>
            <Typography variant="caption" noWrap sx={{ maxWidth: "200px" }}>
                {formik.values.profilePicture ? formik.values.profilePicture.name : "No file chosen"}
            </Typography>
        </ProfilePictureUploadButtonContainer>
    );
}

// ProfilePictureUpload component
function ProfilePictureUpload(props) {
    // Props
    const { formik } = props;

    // Hooks
    const [srcUrl, setSrcUrl] = useState("");

    // Creates src url for profile picture preview
    const createSrcUrl = () => {
        return URL.createObjectURL(formik.values.profilePicture);
    };

    // Sets src url for profile picture preview when profile picture changes
    useEffect(() => {
        if (formik.values.profilePicture) {
            setSrcUrl(createSrcUrl());
        }
    }, [formik.values.profilePicture]);

    return (
        <ProfilePictureUploadContainer>
            <Typography variant="body1">Profile picture</Typography>
            <ProfilePictureUploadContentContainer>
                {formik.values.profilePicture ? <ProfilePicture src={srcUrl} /> : <ProfilePicture />}
                <ProfilePictureUploadButton formik={formik} />
            </ProfilePictureUploadContentContainer>
        </ProfilePictureUploadContainer>
    );
}

// StudentForm component
export default function StudentForm(props) {
    // Props
    const { formik } = props;

    // Hooks
    const [schools, setSchools] = useState([]);

    // Initializes values
    const init = async () => {
        try {
            // Get schools
            const getSchoolsResponse = await getSchools();
            const getSchoolsData = await getSchoolsResponse.json();

            // Set schools state
            setSchools(getSchoolsData);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Initializes values
    useEffect(() => {
        init();
    }, []);

    return (
        <ContentContainer>
            <ProfilePictureUpload formik={formik} />
            <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                    <DefaultTextField id="firstName" label="First name" formik={formik} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <DefaultTextField id="lastName" label="Last name" formik={formik} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <DefaultSelectField id="school" label="School" formik={formik} options={schools} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <DefaultSelectField id="year" label="Year" formik={formik} options={YEARS} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <DefaultTextField id="faculty" label="Faculty" formik={formik} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <DefaultTextField id="major" label="Major" formik={formik} />
                </Grid>
                <Grid xs={12}>
                    <DefaultTextArea id="bio" label="Bio" formik={formik} />
                </Grid>
            </Grid>
        </ContentContainer>
    );
}
