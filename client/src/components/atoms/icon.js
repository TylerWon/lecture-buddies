import { Badge, IconButton, Paper, Typography } from "@mui/material";
import { SocialIcon } from "react-social-icons";
import { styled } from "@mui/material/styles";

// Container for the SocialMediaIconWithDelete button content
const SocialMediaIconWithDeleteButtonContentContainer = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "end",
    alignItems: "center",
    width: "20px",
    height: "20px",
    borderRadius: "100%",
}));

// SocialMediaIcon component
export function SocialMediaIcon(props) {
    const { network, url } = props;

    return <SocialIcon network={network} url={url} />;
}

// SocialMediaIconWithDelete component
export function SocialMediaIconWithDelete(props) {
    const { network, url, onDelete } = props;

    return (
        <Badge
            badgeContent={
                <IconButton size="small" onClick={onDelete}>
                    <SocialMediaIconWithDeleteButtonContentContainer>
                        <Typography variant="body1">x</Typography>
                    </SocialMediaIconWithDeleteButtonContentContainer>
                </IconButton>
            }
            overlap="circular"
        >
            <SocialMediaIcon network={network} url={url} />
        </Badge>
    );
}
