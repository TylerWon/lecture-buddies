import { AppBar, Drawer, IconButton, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useState } from "react";
import { Link } from "react-router-dom";

// Container for navbar items
const NavbarItemsContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
    padding: theme.spacing(2),
}));

// Custom Link component
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
        <CustomLink to={path} onClick={handleItemClick}>
            <Typography variant="body1">{text}</Typography>
        </CustomLink>
    );
}

// TabletNavbar component
export default function TabletNavbar() {
    // Hooks
    const theme = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Handler for when menu icon is clicked
    const handleMenuClick = () => {
        setIsMenuOpen(true);
    };

    // Handler for when close icon is clicked
    const handleCloseClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <AppBar sx={{ backgroundColor: theme.palette.common.black }}>
                <Toolbar>
                    {isMenuOpen ? (
                        <IconButton onClick={handleCloseClick}>
                            <CloseOutlinedIcon sx={{ color: theme.palette.common.white }} />
                        </IconButton>
                    ) : (
                        <IconButton onClick={handleMenuClick}>
                            <MenuOutlinedIcon sx={{ color: theme.palette.common.white }} />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Drawer PaperProps={{ sx: { zIndex: 1 } }} open={isMenuOpen} anchor="top" variant="persistent">
                <Toolbar />
                <NavbarItemsContainer>
                    <NavbarItem path="/profile" text="Profile" setIsMenuOpen={setIsMenuOpen} />
                    <NavbarItem path="/courses" text="Courses" setIsMenuOpen={setIsMenuOpen} />
                    <NavbarItem path="/buddies" text="Buddies" setIsMenuOpen={setIsMenuOpen} />
                    <NavbarItem path="/messages" text="Messages" setIsMenuOpen={setIsMenuOpen} />
                </NavbarItemsContainer>
            </Drawer>
        </>
    );
}
