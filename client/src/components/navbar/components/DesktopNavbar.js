import { Drawer, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { StudentContext } from "../../../contexts/StudentContext";

import { SmallProfilePhoto } from "../../atoms/avatar";
import { Link } from "react-router-dom";

// Container for content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(3),
}));

// Container for navbar items
const NavbarItemsContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(3),
}));

// Container for navbar item
const NavbarItemContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
}));

// Container for settings icon
const SettingsIconContainer = styled(Stack)(({ theme }) => ({
    position: "absolute",
    bottom: theme.spacing(3),
}));

// Custom Link component
const CustomLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
}));

// Styles for navbar item icon
const iconStyle = {
    color: "white",
    width: "35px",
    height: "35px",
};

// NavbarItem component
function NavbarItem(props) {
    // Props
    const { icon, path, text } = props;

    return (
        <CustomLink to={path}>
            <NavbarItemContainer>
                {icon}
                <Typography color="white" variant="body1">
                    {text}
                </Typography>
            </NavbarItemContainer>
        </CustomLink>
    );
}

// DesktopNavbar component
export default function DesktopNavbar() {
    // Hooks
    const { student } = useContext(StudentContext);

    return (
        <Drawer
            PaperProps={{ sx: { backgroundColor: "black", width: "125px", height: "100vh" } }}
            variant="permanent"
            anchor="left"
        >
            <ContentContainer>
                <NavbarItemsContainer>
                    <NavbarItem
                        icon={<SmallProfilePhoto src={student.profile_photo_url} />}
                        path="/profile"
                        text={`${student.first_name} ${student.last_name}`}
                    />
                    <NavbarItem icon={<LibraryBooksOutlinedIcon sx={iconStyle} />} path="/courses" text="Courses" />
                    <NavbarItem icon={<PeopleOutlinedIcon sx={iconStyle} />} path="/buddies" text="Buddies" />
                    <NavbarItem icon={<ChatOutlinedIcon sx={iconStyle} />} path="/messages" text="Messages" />
                </NavbarItemsContainer>
                <SettingsIconContainer>
                    <SettingsOutlinedIcon sx={iconStyle} />
                </SettingsIconContainer>
            </ContentContainer>
        </Drawer>
    );
}
