import { AppBar, Divider, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { StudentContext } from "../../../contexts/StudentContext";
import { logout } from "../../../utils/apiRequests";

// Container for navbar items
const NavbarItemsContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
}));

// Custom React Router DOM Link component
const CustomLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: theme.palette.common.black,
}));

// NavbarItem component
function NavbarItem(props) {
    // Props
    const { path, text, setIsMenuOpen } = props;

    // Handler for when item is clicked
    const handleItemClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <MenuItem>
            <CustomLink to={path} onClick={handleItemClick}>
                <Typography variant="body1">{text}</Typography>
            </CustomLink>
        </MenuItem>
    );
}

// TabletNavbar component
export default function TabletNavbar() {
    // Hooks
    const theme = useTheme();
    const { setStudent, setIsLoggedIn } = useContext(StudentContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    // Handler for when menu is opened
    const handleOpenMenu = (event) => {
        setMenuAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
    };

    // Handler for when menu is closed
    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
        setIsMenuOpen(false);
    };

    // Handler for when logout navbar item is clicked
    const handleLogoutClick = async () => {
        try {
            // Log user out
            await logout();

            // Update student context
            setStudent(null);
            setIsLoggedIn(false);

            // Navigate to home page
            navigate("/");
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    return (
        <>
            <AppBar sx={{ backgroundColor: theme.palette.common.black }}>
                <Toolbar>
                    <IconButton onClick={handleOpenMenu}>
                        <MenuOutlinedIcon sx={{ color: theme.palette.common.white }} />
                    </IconButton>
                    <Menu
                        PaperProps={{ sx: { width: "125px" } }}
                        anchorEl={menuAnchorEl}
                        open={isMenuOpen}
                        onClose={handleCloseMenu}
                    >
                        <NavbarItemsContainer>
                            <NavbarItem path="/profile" text="Profile" setIsMenuOpen={setIsMenuOpen} />
                            <NavbarItem path="/courses" text="Courses" setIsMenuOpen={setIsMenuOpen} />
                            <NavbarItem path="/buddies" text="Buddies" setIsMenuOpen={setIsMenuOpen} />
                            <NavbarItem path="/messages" text="Messages" setIsMenuOpen={setIsMenuOpen} />
                            <Divider />
                            <MenuItem onClick={handleLogoutClick}>
                                <Typography variant="body1">Logout</Typography>
                            </MenuItem>
                        </NavbarItemsContainer>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    );
}
