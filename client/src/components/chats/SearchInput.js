import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SelectRoom } from "../../redux/slices/app";
import {
  SetConversation,
  SetGroupConversation,
} from "../../redux/slices/conversation";
import { Autocomplete, Stack, TextField } from "@mui/material";

const SearchInput = ({ conversations, isGroupChat }) => {
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const user_id = window.localStorage.getItem("user_id");

  const matchingObjects = conversations.filter((con) =>
    con.name.toLowerCase().includes(searchText?.toLowerCase())
  );

  const handleChange = (e, value) => {
    setSearchText(value);
  };
  const handleConversationSelection = (e, value) => {
    if (!!value !== true) return;

    const conversation = conversations
      .filter((e) => !e.isBlocked)
      .find((e) => e.name === value);

    if (conversation === null || conversation === undefined) return;

    if (isGroupChat) {
      dispatch(SelectRoom({ room_id: conversation.id, isGroupChat: true }));
      dispatch(
        SetGroupConversation({
          user_id,
          room_id: conversation.id,
        })
      );
    } else {
      dispatch(SelectRoom({ room_id: conversation.id }));
      dispatch(
        SetConversation({
          user_id,
          room_id: conversation.id,
          userInfo: {
            name: `${conversation.user_info.firstName} ${conversation.user_info.lastName}`,
            online: conversation.user_info.status,
          },
        })
      );
    }
  };

  return (
    <Stack>
      <Autocomplete
        value={searchText || null}
        onChange={handleConversationSelection}
        inputValue={searchText}
        onInputChange={handleChange}
        options={matchingObjects.map((object) => object.name)}
        renderInput={(params) => (
          <TextField {...params} label="Search..." variant="outlined" />
        )}
      />
    </Stack>
  );
};

export default SearchInput;
