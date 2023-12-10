import { Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { socket } from "../../socket";
import {
  LogoutUser,
  UpdateIsLoading,
  getIsLoadingAuth,
  getUserId,
  getUserInfo,
} from "../../redux/slices/auth";
import { OpenSnackBar } from "../../redux/slices/app";

const RemoveUserForm = ({ handleClose }) => {
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();
  const { email } = useSelector(getUserInfo());
  const userId = useSelector(getUserId());

  const isLoading = useSelector(getIsLoadingAuth());

  const onSubmit = async (data) => {
    const { password } = data;
    try {
      dispatch(UpdateIsLoading({ isLoading: true }));
      await axios.post(
        "/auth/login",
        { password, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!userId) handleClose();
      socket.emit(
        "removeUser",
        { user_id: userId },
        ({ severity, message }) => {
          dispatch(OpenSnackBar({ severity, message }));

          dispatch(UpdateIsLoading({ isLoading: false }));
        }
      );
      handleClose();
      dispatch(LogoutUser());
    } catch (error) {
      dispatch(
        OpenSnackBar({ severity: "error", message: "Passwor incorrect" })
      );
      dispatch(UpdateIsLoading({ isLoading: false }));
      reset();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} mt={3}>
          <TextField
            id="password"
            fullWidth
            disabled={isLoading}
            helperText={errors?.password?.message && errors?.password?.message}
            label="Password"
            type={"password"}
            error={!!errors?.password?.message}
            {...register("password", { required: "This field is required" })}
          />

          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="end"
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              Remove
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default RemoveUserForm;
