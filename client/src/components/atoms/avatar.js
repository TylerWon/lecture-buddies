import { Avatar } from "@mui/material";

// ProfilePhoto component
export function BigProfilePhoto(props) {
    return <Avatar sx={{ width: "125px", height: "125px" }} {...props} />;
}

// ProfilePhoto component
export function SmallProfilePhoto(props) {
    return <Avatar sx={{ width: "50px", height: "50px" }} {...props} />;
}
