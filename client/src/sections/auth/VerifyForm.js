import React, { createRef } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { LENGTH_OF_OTP } from "../../config";
import { VerifyEmail } from "../../redux/slices/auth";

const VerifyForm = () => {
  const { register, formState, handleSubmit, setValue, reset } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();
  const inputRefs = Array(LENGTH_OF_OTP)
    .fill(null)
    .map(() => createRef());

  const onSubmit = (formData) => {
    const otp = Object.values(formData).join().replaceAll(",", "");
    try {
      dispatch(VerifyEmail({ otp }));
    } catch (error) {
      reset();
    }
  };

  const handleInputChange = (e, i) => {
    const { maxLength, value } = e.target;
    if (+value.length > +maxLength) {
      e.target.value = +value[0];
    }

    if (value && i < LENGTH_OF_OTP - 1) {
      inputRefs[i + 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    if (pastedData.length <= LENGTH_OF_OTP) {
      for (let i = 0; i < pastedData.length; i++) {
        setValue(`char${i}`, pastedData[i]);
      }
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && i > 0) {
      e.preventDefault();

      inputRefs[i - 1].current.focus();
      inputRefs[i].current.value = null;
      inputRefs[i - 1].current.value = null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" justifyContent="space-evenly" alignItems="center">
        {inputRefs.map((e, i) => (
          <TextField
            key={i}
            type="text"
            placeholder="-"
            autoFocus={i === 0}
            error={!!errors?.[`char${i}`]?.message}
            inputRef={inputRefs[i]}
            {...register(`char${i}`, {
              required: "This field is required",
              maxLength: {
                value: 1,
                message: "Only one character is allowed.",
              },
            })}
            onChange={(event) => handleInputChange(event, i)}
            onFocus={(event) => event.currentTarget.select()}
            onPaste={handlePaste}
            onKeyDown={(event) => handleKeyDown(event, i)}
            InputProps={{
              sx: {
                width: { xs: 36, sm: 56 },
                height: { xs: 36, sm: 56 },
                "& input": {
                  p: 0,
                  textAlign: "center",
                },
              },
            }}
            inputProps={{ maxLength: 1, type: "number" }}
          />
        ))}
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

export default VerifyForm;
