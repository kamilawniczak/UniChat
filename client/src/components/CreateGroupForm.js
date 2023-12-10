import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { GetFriends, getFriends } from "../redux/slices/app";
import { useEffect } from "react";
import { socket } from "../socket";
import { getUserId, getUserInfo } from "../redux/slices/auth";

const CreateGroupForm = ({ handleClose, handleImageUpload, isLoading }) => {
  const { register, formState, handleSubmit, reset, control } = useForm();
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
      const { title, about } = data;
      const chosenFriends = data.members.map((fri) => fri._id);

      const image = await handleImageUpload();

      reset();

      socket.emit("start_group_conversation", {
        title,
        about,
        members: chosenFriends,
        user_id: userId,
        image,
      });

      handleClose();
    } catch (error) {
      console.log("errro", error);
    }
  };

  const me = {
    _id: userId,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
  };

  const options = [me, ...friends].filter((user) => user !== null);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} mt={3}>
          <TextField
            id="title"
            disabled={isLoading}
            fullWidth
            helperText={errors?.title?.message && errors?.title?.message}
            label="Title"
            error={!!errors?.title?.message}
            {...register("title", {
              required: "This field is required",
            })}
          />
          <TextField
            id="about"
            fullWidth
            disabled={isLoading}
            helperText={errors?.about?.message && errors?.about?.message}
            label="About"
            error={!!errors?.about?.message}
            inputProps={{ maxLength: 101 }}
            {...register("about", {
              validate: (value) =>
                value.length <= 100 ||
                "About must be less than or equal to 100 characters",
            })}
          />

          <Controller
            name="members"
            control={control}
            disabled={isLoading}
            defaultValue={[options.at(0)]}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                options={options}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName}`
                }
                limitTags={3}
                getOptionDisabled={(option) => option?._id === userId}
                onChange={(e, newValue) =>
                  onChange([
                    options.at(0),
                    ...newValue.filter((option) => option?._id !== userId),
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
            <Button type="submit" variant="contained" disabled={isLoading}>
              Create
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default CreateGroupForm;
