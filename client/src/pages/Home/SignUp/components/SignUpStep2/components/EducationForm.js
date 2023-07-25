import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";

import { getSchools } from "../../../../../../utils/requests";

// Constants
const YEARS = [
    { year_id: "1st", year_name: "1st" },
    { year_id: "2nd", year_name: "2nd" },
    { year_id: "3rd", year_name: "3rd" },
    { year_id: "4th", year_name: "4th" },
    { year_id: "5th", year_name: "5th" },
    { year_id: "5th+", year_name: "5th+" },
];

// CustomTextField component
function CustomTextField(props) {
    const { id, label, formik } = props;

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
        />
    );
}

// CustomSelectField component
function CustomSelectField(props) {
    const { id, label, formik, options } = props;

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
                onChange={formik.handleChange}
                error={formik.touched[id] && Boolean(formik.errors[id])}
            >
                {options.map((option) => (
                    <MenuItem key={option[`${id}_id`]} value={option[`${id}_id`]}>
                        {option[`${id}_name`]}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText error={formik.touched[id] && Boolean(formik.errors[id])}>
                {formik.touched[id] && formik.errors[id]}
            </FormHelperText>
        </FormControl>
    );
}

// EducationForm component
function EducationForm(props) {
    // Props
    const { formik } = props;

    // Hooks
    const [schools, setSchools] = useState([]);

    // Initializes values
    const init = async () => {
        try {
            // Get schools
            const getSchoolsResponse = await getSchools();
            const getSchoolsData = await getSchoolsResponse.json();

            // Set schools state
            setSchools(getSchoolsData);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // useEffect for initializing values
    useEffect(() => {
        init();
    }, []);

    return (
        <FormControl fullWidth component="form">
            <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                    <CustomSelectField id="school" label="School" formik={formik} options={schools} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <CustomSelectField id="year" label="Year" formik={formik} options={YEARS} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <CustomTextField id="faculty" label="Faculty" formik={formik} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <CustomTextField id="major" label="Major" formik={formik} />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={5}
                        id="bio"
                        name="bio"
                        label="Bio"
                        value={formik.values.bio}
                        onChange={formik.handleChange}
                        error={formik.touched.bio && Boolean(formik.errors.bio)}
                        helperText={formik.touched.bio && formik.errors.bio}
                    />
                </Grid>
            </Grid>
        </FormControl>
    );
}

export default EducationForm;
