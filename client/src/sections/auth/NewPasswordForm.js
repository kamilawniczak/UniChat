import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useSearchParams } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { NewPassword } from "../../redux/slices/auth";

const NewPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const disaptch = useDispatch();
  const [params] = useSearchParams();

  const onSubmit = (formData) => {
    try {
      disaptch(NewPassword({ ...formData, token: params.get("token") }));
    } catch (error) {
      reset();
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          id="password"
          fullWidth
          helperText={errors?.password?.message && errors?.password?.message}
          label="Password"
          type={showPassword ? "text" : "password"}
          error={!!errors?.password?.message}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="passwordConfirmed"
          fullWidth
          helperText={
            errors?.passwordConfirmed?.message &&
            errors?.passwordConfirmed?.message
          }
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          error={!!errors?.passwordConfirmed?.message}
          {...register("passwordConfirmed", {
            required: "This field is required",
            validate: (value) => {
              return (
                value === getValues().password || "Passwords need to match"
              );
            },
          })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          Sign up
        </Button>
      </Stack>
    </form>
  );
};

export default NewPasswordForm;
