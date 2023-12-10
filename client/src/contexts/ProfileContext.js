import React, { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUserInfo, getUserId } from "../redux/slices/auth";
import { socket } from "../socket";
import { OpenSnackBar } from "../redux/slices/app";
import { supabase } from "../utils/supabase";
import { isImage } from "../utils/checkFile";

const initialState = {
  handleFormSubmit: () => {},
  handleFileChange: () => {},
  handleImageChage: () => {},
  setIsLoading: () => {},
  setIsSendingImage: () => {},
  setImage: () => {},
  image: null,
  isLoading: false,
  isSendingImage: false,
};

const StateContext = createContext(initialState);

const StateProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingImage, setIsSendingImage] = useState(false);

  const dispatch = useDispatch();
  const user_id = useSelector(getUserId());

  const handleFormSubmit = ({ phone, fullName, about }) => {
    const spliFullName = fullName.trim().split(" ");

    const firstName = spliFullName.at(0);
    const lastName = spliFullName.slice(1).join(" ");

    setIsLoading(true);

    socket.emit(
      "editUser",
      {
        user_id,
        firstName,
        lastName,
        phone,
        about,
      },
      ({ success, message }) => {
        if (success) {
          dispatch(OpenSnackBar({ severity: "success", message }));
          dispatch(UpdateUserInfo({ phone, firstName, lastName, about }));
        } else {
          dispatch(OpenSnackBar({ severity: "error", message }));
        }
        setIsLoading(false);
      }
    );
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const fileSize = file.size;
    const maxSizeInBytes = 20 * 1024 * 1024;

    if (!file?.name) {
      dispatch(
        OpenSnackBar({
          severity: "error",
          message: "Some error accrued",
        })
      );
      return;
    }

    if (!isImage(file.name)) {
      dispatch(
        OpenSnackBar({
          severity: "warning",
          message: "Only images allowed",
        })
      );
      return;
    }
    if (fileSize > maxSizeInBytes) {
      dispatch(
        OpenSnackBar({
          severity: "warning",
          message: `Total size exceeds 20MB, currently ${Math.round(
            fileSize / (1024 * 1024)
          )} MB`,
        })
      );
      return;
    }

    setImage(file);
  };

  const handleImageChage = async () => {
    if (isSendingImage) return;
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

    socket.emit(
      "editUser",
      {
        user_id,
        avatar: newAvatar,
      },
      ({ success, message }) => {
        if (success) {
          dispatch(OpenSnackBar({ severity: "success", message }));
          dispatch(UpdateUserInfo({ avatar: newAvatar }));
          setImage(null);
        } else {
          dispatch(OpenSnackBar({ severity: "error", message }));
        }
      }
    );
    dispatch(UpdateUserInfo({ avatar: newAvatar }));
    setIsSendingImage(false);
  };

  return (
    <StateContext.Provider
      value={{
        handleFormSubmit,
        handleFileChange,
        handleImageChage,
        setIsLoading,
        setIsSendingImage,
        setImage,
        image,
        isLoading,
        isSendingImage,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

const useProfileContext = () => {
  const contextValue = useContext(StateContext);

  if (!contextValue) {
    console.log("useProfileContext must be used within a ProfileProvider.");
  }

  return contextValue;
};

export { StateProvider, useProfileContext };
