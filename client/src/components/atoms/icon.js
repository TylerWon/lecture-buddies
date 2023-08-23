import { Badge, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { SocialIcon } from "react-social-icons";
import PeopleIcon from "@mui/icons-material/People";

// FriendsIcon component
export function FriendsIcon(props) {
    return (
        <Tooltip title="Friends">
            <PeopleIcon color="primary" size="small" />
        </Tooltip>
    );
}

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
                    <Paper
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            alignItems: "center",
                            width: "20px",
                            height: "20px",
                            borderRadius: "100%",
                        }}
                    >
                        <Typography variant="body1">x</Typography>
                    </Paper>
                </IconButton>
            }
            overlap="circular"
        >
            <SocialMediaIcon network={network} url={url} />
        </Badge>
    );
}
