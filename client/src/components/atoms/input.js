import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";

// BaseSelectField component
function BaseSelectField(props) {
    const { id, label, handleChange, options, optionValueField, optionAsValue, optionTextField, formik } = props;

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
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={index}
                        value={optionAsValue ? option : option[optionValueField]}
                        disabled={option["disabled"]}
                    >
                        {option[optionTextField]}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText
                sx={{ display: formik.touched[id] && Boolean(formik.errors[id]) ? "block" : "none" }}
                error={formik.touched[id] && Boolean(formik.errors[id])}
            >
                {formik.touched[id] && formik.errors[id]}
            </FormHelperText>
        </FormControl>
    );
}

// DefaultSelectField component
export function DefaultSelectField(props) {
    const { id, label, options, optionValueField, optionAsValue, optionTextField, formik } = props;

    return (
        <BaseSelectField
            id={id}
            label={label}
            handleChange={formik.handleChange}
            options={options}
            optionValueField={optionValueField}
            optionTextField={optionTextField}
            optionAsValue={optionAsValue}
            formik={formik}
        />
    );
}

// SelectFieldWithCustomHandleChange component
export function SelectFieldWithCustomHandleChange(props) {
    const { id, label, handleChange, options, optionValueField, optionAsValue, optionTextField, formik } = props;

    return (
        <BaseSelectField
            id={id}
            label={label}
            handleChange={handleChange}
            options={options}
            optionValueField={optionValueField}
            optionTextField={optionTextField}
            optionAsValue={optionAsValue}
            formik={formik}
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
