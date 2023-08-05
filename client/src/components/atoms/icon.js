import { Avatar, Badge, IconButton, Paper, Typography } from "@mui/material";
import { SocialIcon } from "react-social-icons";
import { styled } from "@mui/material/styles";

// ProfilePhoto component
export function ProfilePhoto(props) {
    return <Avatar sx={{ width: "125px", height: "125px" }} {...props} />;
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
