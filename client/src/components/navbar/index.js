import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import DesktopNavbar from "./components/DesktopNavbar";
import TabletNavbar from "./components/TabletNavbar";

// Constants
const DESKTOP_NAVBAR_WIDTH = "115px";

// Navbar component
export default function Navbar() {
    // Hooks
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            {isTablet ? <TabletNavbar /> : <DesktopNavbar navbarWidth={DESKTOP_NAVBAR_WIDTH} />}
            <Box sx={{ paddingLeft: isTablet ? "0px" : DESKTOP_NAVBAR_WIDTH }}>
                <Outlet />
            </Box>
        </>
    );
}
