import { IconButton, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ChatIcon from "@mui/icons-material/Chat";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { createConversation, createFriendship } from "../../utils/apiRequests";

// AcceptButton component
export function AcceptButton(props) {
    const { ...iconButtonProps } = props;

    return (
        <Tooltip title="Accept">
            <IconButton color="secondary" size="small" {...iconButtonProps}>
                <CheckCircleIcon />
            </IconButton>
        </Tooltip>
    );
}

// AcceptAndCancelButtons component
export function AcceptAndCancelButtons(props) {
    const { acceptButtonProps, cancelButtonProps } = props;

    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <AcceptButton {...acceptButtonProps} />
            <CancelButton {...cancelButtonProps} />
        </Stack>
    );
}

// AddButton component
export function AddButton(props) {
    const { onClick } = props;

    return (
        <IconButton color="primary" size="small" onClick={onClick}>
            <AddCircleIcon />
        </IconButton>
    );
}

// AddButtonWithLabel component
export function AddButtonWithLabel(props) {
    const { label, onClick } = props;

    return (
        <Stack direction="column" justifyContent="center" alignItems="center">
            <AddButton onClick={onClick} />
            <Typography variant="body1">{label}</Typography>
        </Stack>
    );
}

// AddFriendButton component
export function AddFriendButton(props) {
    // Props
    const { requestorId, requesteeId, onSuccess } = props;

    // Hooks
    const [showNotification, setShowNotification] = useState(false);

    // Handler for when add friend button is clicked
    const handleAddFriendClick = async () => {
        try {
            // Create friendship
            await createFriendship({
                requestor_id: requestorId,
                requestee_id: requesteeId,
            });

            // Show notification
            setShowNotification(true);

            // Call onSuccess
            onSuccess();
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Handler for when notification is closed
    const handleNotificationClose = () => {
        setShowNotification(false);
    };

    return (
        <>
            <Tooltip title="Add friend">
                <IconButton color="primary" size="small" onClick={handleAddFriendClick}>
                    <PersonAddIcon />
                </IconButton>
            </Tooltip>
            <Snackbar
                open={showNotification}
                autoHideDuration={5000}
                onClose={handleNotificationClose}
                message="Friend request sent"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
        </>
    );
}

// CancelButton component
export function CancelButton(props) {
    const { onClick } = props;

    return (
        <Tooltip title="Cancel">
            <IconButton color="grey" size="small" onClick={onClick}>
                <CancelIcon />
            </IconButton>
        </Tooltip>
    );
}

// MessageButton component
export function MessageButton(props) {
    // Props
    const { studentId1, studentId2 } = props;

    // Hooks
    const navigate = useNavigate();

    // Handler for when message button is clicked
    const handleMessageClick = async () => {
        try {
            // Create conversation
            await createConversation({
                student_id_1: studentId1,
                student_id_2: studentId2,
            });

            // Navigate to conversation
            navigate(`/messages/${studentId1}/${studentId2}`);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    return (
        <Tooltip title="Message">
            <IconButton color="primary" size="small" onClick={handleMessageClick}>
                <ChatIcon />
            </IconButton>
        </Tooltip>
    );
}
