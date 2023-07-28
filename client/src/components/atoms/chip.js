import { Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// InterestChip component
export function InterestChip(props) {
    return <Chip variant="outlined" {...props} />;
}

// InterestChipWithDelete component
export function InterestChipWithDelete(props) {
    return <InterestChip deleteIcon={<CloseIcon />} {...props} />;
}
