import {
  Autocomplete,
  Avatar,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { GetFriends, OpenSnackBar, getFriends } from "../../redux/slices/app";
import { useEffect } from "react";
import { socket } from "../../socket";
import { getUserId, getUserInfo } from "../../redux/slices/auth";

const CreateGroupForm = ({ handleClose }) => {
  const { register, formState, handleSubmit, reset, getValues, control } =
    useForm();
  const { errors } = formState;
  const dispatch = useDispatch();
  const friends = useSelector(getFriends());
  const userId = useSelector(getUserId());
  const userInfo = useSelector(getUserInfo());

  useEffect(() => {
    dispatch(GetFriends());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      const { title } = data;
      const chosenFriends = data.members.map((fri) => fri._id);
      reset();
      socket.emit("start_group_conversation", {
        title,
        members: chosenFriends,
        user_id: userId,
      });
    } catch (error) {
      console.log("errro", error);
    }
  };

  const me = {
    _id: userId,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
  };

  const options = [me, ...friends];

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
            defaultValue={[options.at(0)]}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                options={options}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName}`
                }
                limitTags={3}
                getOptionDisabled={(option) => option._id === userId}
                onChange={(e, newValue) =>
                  onChange([
                    options.at(0),
                    ...newValue.filter((option) => option._id !== userId),
                  ])
                }
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
