import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";

// BaseSelectField component
function BaseSelectField(props) {
    const { id, label, handleChange, options, optionValueField, optionTextField, formik, ...selectFieldProps } = props;

    return (
        <FormControl fullWidth>
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
                fullWidth
                id={id}
                name={id}
                labelId={`${id}-label`}
                label={label}
                value={formik.values[id]}
                onChange={handleChange}
                error={formik.touched[id] && Boolean(formik.errors[id])}
                {...selectFieldProps}
            >
                {options.map((option, index) => (
                    <MenuItem key={index} value={option[optionValueField]} disabled={option["disabled"]}>
                        {option[optionTextField]}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText
                sx={formik.touched[id] && Boolean(formik.errors[id]) ? { display: "block" } : { display: "none" }}
                error={formik.touched[id] && Boolean(formik.errors[id])}
            >
                {formik.touched[id] && formik.errors[id]}
            </FormHelperText>
        </FormControl>
    );
}

// DefaultSelectField component
export function DefaultSelectField(props) {
    const { id, label, options, optionValueField, optionTextField, formik, ...selectFieldProps } = props;

    return (
        <BaseSelectField
            id={id}
            label={label}
            handleChange={formik.handleChange}
            options={options}
            optionValueField={optionValueField}
            optionTextField={optionTextField}
            formik={formik}
            {...selectFieldProps}
        />
    );
}

// SelectFieldWithCustomHandleChange component
export function SelectFieldWithCustomHandleChange(props) {
    const { id, label, handleChange, options, optionValueField, optionTextField, formik, ...selectFieldProps } = props;

    return (
        <BaseSelectField
            id={id}
            label={label}
            handleChange={handleChange}
            options={options}
            optionValueField={optionValueField}
            optionTextField={optionTextField}
            formik={formik}
            {...selectFieldProps}
        />
    );
}

// DefaultTextArea component
export function DefaultTextArea(props) {
    const { id, label, formik } = props;

    return (
        <TextField
            fullWidth
            multiline
            minRows={5}
            id={id}
            name={id}
            label={label}
            value={formik.values[id]}
            onChange={formik.handleChange}
            error={formik.touched[id] && Boolean(formik.errors[id])}
            helperText={formik.touched[id] && formik.errors[id]}
        />
    );
}

// DefaultTextField component
export function DefaultTextField(props) {
    const { id, label, formik, ...textFieldProps } = props;

    return (
        <TextField
            fullWidth
            id={id}
            name={id}
            label={label}
            value={formik.values[id]}
            onChange={formik.handleChange}
            error={formik.touched[id] && Boolean(formik.errors[id])}
            helperText={formik.touched[id] && formik.errors[id]}
            {...textFieldProps}
        />
    );
}
