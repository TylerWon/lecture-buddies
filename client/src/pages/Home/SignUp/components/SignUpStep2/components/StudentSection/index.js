import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

import ProfilePhotoUpload from "./components/ProfilePhotoUpload";
import PersonalInfoFields from "./components/PersonalInfoFields";

// Container for content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: theme.spacing(2),
}));

// StudentSection component
export default function StudentSection(props) {
    // Props
    const { formik } = props;

    return (
        <ContentContainer>
            <ProfilePhotoUpload formik={formik} />
            <PersonalInfoFields formik={formik} />
        </ContentContainer>
    );
}
