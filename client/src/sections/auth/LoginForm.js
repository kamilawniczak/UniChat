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

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const onSubmit = () => {};

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            id="email"
            fullWidth
            helperText={errors?.email?.message && errors?.email?.message}
            label="Email"
            error={errors?.email?.message}
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address",
              },
            })}
          />
          <TextField
            id="password"
            fullWidth
            helperText={errors?.password?.message && errors?.password?.message}
            label="Password"
            type={showPassword ? "text" : "password"}
            error={errors?.password?.message}
            {...register("password", { required: "This field is required" })}
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Link
              to="/auth/register"
              component={RouterLink}
              variant={"subtitle2"}
            >
              I don't have an account
            </Link>
            <Link
              component={RouterLink}
              to="/auth/reset-password"
              variant="body2"
              color="inherit"
              underline="always"
            >
              Forgot password?
            </Link>
          </Stack>

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
            Login
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default LoginForm;
