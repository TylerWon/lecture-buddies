import { Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// InterestChip component
export function InterestChip(props) {
    const { ...chipProps } = props;

    return <Chip variant="outlined" {...chipProps} />;
}

// InterestChipWithDelete component
export function InterestChipWithDelete(props) {
    const { ...interestChipProps } = props;

    return <InterestChip deleteIcon={<CloseIcon />} {...interestChipProps} />;
}
