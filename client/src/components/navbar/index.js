import { Box, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

import DesktopNavbar from "./components/DesktopNavbar";
import TabletNavbar from "./components/TabletNavbar";

// Constants
const DESKTOP_NAVBAR_WIDTH = 115;
const PADDING = 24;

// Navbar component
export default function Navbar() {
    // Hooks
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    // Container for content
    const ContentContainer = styled(Box)(({ theme }) => ({
        padding: isTablet
            ? `${PADDING}px`
            : `${PADDING}px ${PADDING}px ${PADDING}px ${PADDING + DESKTOP_NAVBAR_WIDTH}px`,
    }));

    return (
        <>
            {isTablet ? <TabletNavbar /> : <DesktopNavbar navbarWidth={DESKTOP_NAVBAR_WIDTH} />}
            <ContentContainer>
                <Outlet />
            </ContentContainer>
        </>
    );
}
