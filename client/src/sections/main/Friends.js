import { Dialog, DialogContent, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetFriendRequests,
  GetFriends,
  GetUsers,
  getFriendRequests,
  getFriends,
  getUsers,
} from "../../redux/slices/app";
import {
  FriendElement,
  FriendRequestElement,
  UserElement,
} from "../../components/UserComponents";

const UserList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUsers());
  }, []);

  const users = useSelector(getUsers());
  console.log(users);

  return (
    <>
      {users.map((e, i) => {
        return <UserElement {...e} key={i} />;
      })}
    </>
  );
};
const FriendsList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetFriends());
  }, []);

  const friends = useSelector(getFriends());

  return (
    <>
      {friends.map((e, i) => {
        return <FriendElement {...e} key={i} />;
      })}
    </>
  );
};
const FriendRequestsList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetFriendRequests());
  }, []);

  const friendRequests = useSelector(getFriendRequests());

  return (
    <>
      {friendRequests.map((e, i) => {
        return <FriendRequestElement {...e.sender} id={e._id} key={i} />;
      })}
    </>
  );
};

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = useState(0);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        keepMounted
        onClose={handleClose}
        sx={{
          p: 4,
        }}
      >
        <Stack p={2} sx={{ width: "100%" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Explore" />
            <Tab label="Friends" />
            <Tab label="Request" />
          </Tabs>
        </Stack>
        <DialogContent>
          <Stack sx={{ height: "100%" }}>
            <Stack spacing={3}>
              {(() => {
                switch (value) {
                  case 0:
                    return <UserList />;

                  case 1:
                    return <FriendsList />;

                  case 2:
                    return <FriendRequestsList />;

                  default:
                    return;
                }
              })()}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Friends;
