import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

import LoginForm from "./components/LoginForm";
import LoginFooter from "./components/LoginFooter";

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "inherit",
}));

// Login component
function Login(props) {
    const { setShowSignUp } = props;

    return (
        <ContentContainer>
            <LoginForm setShowSignUp={setShowSignUp} />
            <LoginFooter />
        </ContentContainer>
    );
}

export default Login;
