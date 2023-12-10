import React, { useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Stack,
} from "@mui/material";

import CreateGroupForm from "./CreateGroupForm";
import { X } from "@phosphor-icons/react";

import { supabase } from "../utils/supabase";
import { useSelector } from "react-redux";
import { getUserId } from "../redux/slices/auth";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const VisuallyHiddenInput = ({ type, onChange }) => (
  <input
    type={type}
    style={{
      display: "none",
    }}
    onChange={onChange}
  />
);

const CreateGroup = ({ open, handleClose }) => {
  const [image, setImage] = useState(null);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const user_id = useSelector(getUserId());

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleImageUpload = async () => {
    if (isSendingImage || !image) return;

    setIsSendingImage(true);
    const token =
      user_id +
      "/" +
      "avarar" +
      "/" +
      Date.now() +
      crypto.randomUUID() +
      "$$$" +
      image.name;
    await supabase.storage.from("files").upload(token, image);
    const newAvatar = `https://aywtluyvoneczbqctdfk.supabase.co/storage/v1/object/public/files/${token}`;

    setIsSendingImage(false);

    return newAvatar;
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
    >
      <DialogTitle textAlign={"center"}>Create New Group</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={3}>
          <Stack
            position="relative"
            alignItems="center"
            sx={{
              borderRadius: "100%",
              ":hover #button": {
                opacity: 1,
                transition: "opacity .5s ease",
              },
            }}
          >
            <Button
              id="button"
              component="label"
              disabled={isSendingImage}
              variant="contained"
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                opacity: 0,
              }}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>

            <Avatar
              sx={{
                height: "20rem",
                width: "20rem",
                objectFit: "cover",
              }}
              src={image && URL.createObjectURL(image)}
              alt="prifile image"
            />
            {image && (
              <Stack
                spacing={2}
                direction="row"
                position="absolute"
                sx={{
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <IconButton
                  disabled={isSendingImage}
                  onClick={() => setImage(null)}
                >
                  <X
                    size={52}
                    color={isSendingImage ? "#787878" : "#c93636"}
                    weight="fill"
                  />
                </IconButton>
              </Stack>
            )}
          </Stack>
          <CreateGroupForm
            handleClose={handleClose}
            handleImageUpload={handleImageUpload}
            isLoading={isSendingImage}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
