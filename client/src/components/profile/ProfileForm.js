import { Button, CircularProgress, Stack, TextField } from "@mui/material";

import { useForm } from "react-hook-form";

import { useProfileContext } from "../../contexts/ProfileContext";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../redux/slices/auth";

const ProfileForm = () => {
  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;
  const { handleFormSubmit, isLoading } = useProfileContext();
  const { firstName, lastName, phone, about } = useSelector(getUserInfo());

  const fullName = `${firstName} ${lastName}`;

  const onSubmit = async (data) => {
    handleFormSubmit(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            id="fullName"
            fullWidth
            defaultValue={fullName}
            disabled={isLoading}
            helperText={
              errors?.fullName?.message
                ? errors?.fullName?.message
                : "This full name is visible to your contacts"
            }
            label="Full name"
            error={!!errors?.fullName?.message}
            {...register("fullName", {
              required: "This field is required",
              pattern: {
                value:
                  /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+(?: [A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+)+$/,
                message: "Please provide a valid full Name",
              },
            })}
          />
          <TextField
            id="phone"
            fullWidth
            defaultValue={phone}
            disabled={isLoading}
            helperText={
              errors?.phone?.message
                ? errors?.phone?.message
                : "This phone is visible to your contacts"
            }
            label="Phone"
            error={!!errors?.phone?.message}
            {...register("phone", {
              pattern: {
                value: /^(?:\+\w{1,4}\s?)?\d{9}$/,
                message: "Please provide a valid phone",
              },
            })}
          />
          <TextField
            id="about"
            multiline
            fullWidth
            defaultValue={about}
            disabled={isLoading}
            minRows={3}
            maxRows={5}
            inputProps={{ maxLength: 101 }}
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
            disabled={isLoading}
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
            {isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default ProfileForm;
