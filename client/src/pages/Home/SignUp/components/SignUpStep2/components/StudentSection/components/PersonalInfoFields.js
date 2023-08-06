import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";

import { getSchools } from "../../../../../../../../utils/apiRequests";

import { DefaultSelectField, DefaultTextArea, DefaultTextField } from "../../../../../../../../components/atoms/input";

// Constants
const YEARS = [{ year: "1st" }, { year: "2nd" }, { year: "3rd" }, { year: "4th" }, { year: "5th" }, { year: "5th+" }];

// PersonalInfoFields component
export default function PersonalInfoFields(props) {
    // Props
    const { formik } = props;

    // Hooks
    const [schools, setSchools] = useState([]);

    // Initializes schools state
    const initSchools = async () => {
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

    // Initializes values
    useEffect(() => {
        initSchools();
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
                <DefaultTextField id="firstName" label="First name" formik={formik} />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultTextField id="lastName" label="Last name" formik={formik} />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultSelectField
                    id="schoolId"
                    label="School"
                    options={schools}
                    optionValueField="school_id"
                    optionTextField="school_name"
                    formik={formik}
                />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultSelectField
                    id="year"
                    label="Year"
                    options={YEARS}
                    optionValueField="year"
                    optionTextField="year"
                    formik={formik}
                />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultTextField id="faculty" label="Faculty" formik={formik} />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultTextField id="major" label="Major" formik={formik} />
            </Grid>
            <Grid xs={12}>
                <DefaultTextArea id="bio" label="Bio" formik={formik} />
            </Grid>
        </Grid>
    );
}
