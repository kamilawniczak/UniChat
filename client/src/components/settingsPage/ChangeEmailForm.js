import { Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { socket } from "../../socket";
import {
  UpdateEmail,
  UpdateIsLoading,
  getIsLoadingAuth,
  getUserId,
  getUserInfo,
} from "../../redux/slices/auth";
import { OpenSnackBar } from "../../redux/slices/app";
import { useState } from "react";

const ChangeEmailForm = ({ handleClose }) => {
  const [open, setOpen] = useState(false);

  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();
  const { email } = useSelector(getUserInfo());
  const userId = useSelector(getUserId());

  const isLoading = useSelector(getIsLoadingAuth());

  const onSubmit = async (data) => {
    if (open) {
      const { email: newEmail } = data;
      dispatch(UpdateIsLoading({ isLoading: true }));
      socket.emit(
        "editEmail",
        { user_id: userId, newEmail },
        ({ severity, message }) => {
          dispatch(OpenSnackBar({ severity, message }));
          dispatch(UpdateEmail({ email: newEmail }));
        }
      );
      dispatch(UpdateIsLoading({ isLoading: false }));

      handleClose();
    } else {
      const { password } = data;

      dispatch(UpdateIsLoading({ isLoading: true }));
      try {
        await axios.post(
          "/auth/login",
          { password, email },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!userId) {
          handleClose();
        }

        dispatch(UpdateIsLoading({ isLoading: false }));
        dispatch(
          OpenSnackBar({ severity: "success", message: "Password correct" })
        );
        setOpen(true);
      } catch (error) {
        dispatch(UpdateIsLoading({ isLoading: false }));
        dispatch(
          OpenSnackBar({ severity: "error", message: "Password incorrect" })
        );
      }
      reset();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} mt={3}>
          {open ? (
            <TextField
              id="email"
              fullWidth
              disabled={isLoading}
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
          ) : (
            <TextField
              id="password"
              fullWidth
              disabled={isLoading}
              helperText={
                errors?.password?.message && errors?.password?.message
              }
              label="Password"
              type="password"
              error={!!errors?.password?.message}
              {...register("password", {
                required: "This field is required",
              })}
            />
          )}

          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="end"
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              Edit
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default ChangeEmailForm;
