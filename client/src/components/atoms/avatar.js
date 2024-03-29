import { Avatar } from "@mui/material";

// ProfilePhoto component
export function BigProfilePhoto(props) {
    return <Avatar sx={{ width: "150px", height: "150px" }} {...props} />;
}

// ProfilePhoto component
export function SmallProfilePhoto(props) {
    return <Avatar sx={{ width: "35px", height: "35px" }} {...props} />;
}
