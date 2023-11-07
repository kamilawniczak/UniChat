import {
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import React from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RegisterNewUser, getIsLoadingAuth } from "../../redux/slices/auth";
import LoadingButton from "@mui/lab/LoadingButton";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoadingAuth());

  const onSubmit = (formData) => {
    dispatch(RegisterNewUser(formData));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Stack spacing={2} direction="row" sx={{ mb: 3 }}>
          <TextField
            disabled={isLoading}
            id="firstName"
            fullWidth
            helperText={
              errors?.firstName?.message && errors?.firstName?.message
            }
            label="First Name"
            error={!!errors?.firstName?.message}
            {...register("firstName", {
              required: "This field is required",
              pattern: {
                value: /^[\p{L}]+$/u,
                message: "Please enter only letters",
              },
            })}
          />
          <TextField
            disabled={isLoading}
            id="lastName"
            fullWidth
            helperText={errors?.lastName?.message && errors?.lastName?.message}
            label="Last Name"
            error={!!errors?.lastName?.message}
            {...register("lastName", {
              required: "This field is required",
              pattern: {
                value: /^[\p{L}]+$/u,
                message: "Please enter only letters",
              },
            })}
          />
        </Stack>
        <Stack spacing={3}>
          <TextField
            disabled={isLoading}
            id="email"
            fullWidth
            helperText={errors?.email?.message && errors?.email?.message}
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
          <TextField
            disabled={isLoading}
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
                    {showPassword && !isLoading ? <Eye /> : <EyeSlash />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            disabled={isLoading}
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
                    {showPassword && !isLoading ? <Eye /> : <EyeSlash />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
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
          <Link to="/auth/login" component={RouterLink} variant={"subtitle2"}>
            I already have an account
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
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
              },
            }}
          >
            Sign Up
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
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
              },
            }}
          >
            Submit
          </LoadingButton>
        )}
      </Stack>
    </form>
  );
};

export default RegisterForm;
