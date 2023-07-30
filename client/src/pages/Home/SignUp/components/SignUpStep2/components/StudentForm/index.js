import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

import { ProfilePictureUpload } from "./components/ProfilePictureUpload";
import TextInputs from "./components/TextInputs";

// Container for content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: theme.spacing(2),
}));

// StudentForm component
export default function StudentForm(props) {
    // Props
    const { formik } = props;

    return (
        <ContentContainer>
            <ProfilePictureUpload formik={formik} />
            <TextInputs formik={formik} />
        </ContentContainer>
    );
}
