import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const MEMBERS = ["name1", "name2", "name3", "name4"];

const CreateGroupForm = ({ handleClose }) => {
  const { register, formState, handleSubmit, reset, getValues, control } =
    useForm();
  const { errors } = formState;
  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.log("errro", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} mt={3}>
          <TextField
            id="title"
            fullWidth
            helperText={errors?.title?.message && errors?.title?.message}
            label="Title"
            error={!!errors?.title?.message}
            {...register("title", {
              required: "This field is required",
            })}
          />

          <Controller
            name="members"
            control={control}
            defaultValue={[MEMBERS[0]]}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                options={MEMBERS}
                getOptionLabel={(option) => option}
                onChange={(e, newValue) => onChange(newValue)}
                value={value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Members"
                    placeholder=""
                    helperText={
                      errors?.members?.message && errors?.members?.message
                    }
                    error={!!errors?.members?.message}
                  />
                )}
              />
            )}
            rules={{
              validate: (selectedMembers) =>
                selectedMembers.length >= 2 || "Select at least two members",
            }}
          />
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="end"
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default CreateGroupForm;
