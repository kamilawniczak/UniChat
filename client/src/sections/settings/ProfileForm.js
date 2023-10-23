import { Button, Link, Stack, TextField } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCallback } from "react";

const ProfileForm = () => {
  const {
    register,
    formState,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
  } = useForm();
  const { errors } = formState;

  const values = watch();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue("avatarURL", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = async (data) => {
    try {
      console.log("Data", data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            id="name"
            fullWidth
            helperText={
              errors?.name?.message
                ? errors?.name?.message
                : "This name is visible to your contacts"
            }
            label="Name"
            error={!!errors?.name?.message}
            {...register("name", {
              required: "This field is required",
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: "Please provide a valid name",
              },
            })}
          />
          <TextField
            id="about"
            multiline
            fullWidth
            rows={3}
            maxRows={5}
            helperText={
              errors?.about?.message
                ? errors?.about?.message
                : "This is visible to your contacts"
            }
            label="About"
            error={!!errors?.about?.message}
            {...register("about", {
              maxLength: { value: 100, message: "Max 100 characters" },
            })}
          />
        </Stack>

        <Stack sx={{ my: 2 }} spacing={1}>
          <Button
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
              "&hover": {
                bgcolor: "text.primary",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
              },
            }}
          >
            Save
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default ProfileForm;
