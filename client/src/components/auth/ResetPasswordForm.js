import { Button, Link, Stack, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch, useSelector } from "react-redux";

import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ForgotPassword } from "../../redux/slices/auth";

import { getIsLoadingAuth } from "../../redux/slices/auth";

const ResetPasswordForm = () => {
  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;
  const isLoading = useSelector(getIsLoadingAuth());

  const dispatch = useDispatch();
  const onSubmit = (formData) => {
    dispatch(ForgotPassword(formData));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            disabled={isLoading}
            id="email"
            fullWidth
            helperText={!!errors?.email?.message && errors?.email?.message}
            label="Email"
            error={!!errors?.email?.message}
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address",
              },
            })}
          />
        </Stack>

        <Stack sx={{ my: 2 }} spacing={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            <Link
              to="/auth/register"
              component={RouterLink}
              variant={"subtitle2"}
            >
              I don't have an account
            </Link>
          </Stack>

          {!isLoading ? (
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
                    theme.palette.mode === "light"
                      ? "common.white"
                      : "grey.800",
                },
              }}
            >
              Confirm
            </Button>
          ) : (
            <LoadingButton
              disabled={isLoading}
              loading
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
                    theme.palette.mode === "light"
                      ? "common.white"
                      : "grey.800",
                },
              }}
            >
              Submit
            </LoadingButton>
          )}
        </Stack>
      </form>
    </>
  );
};

export default ResetPasswordForm;
