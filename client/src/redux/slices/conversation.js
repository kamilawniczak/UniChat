import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
import { socket } from "../../socket";

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_meessages: [],
    unread_messages: [],
  },
  group_chat: {
    conversations: [],
    current_conversation: null,
    current_meessages: [],
    unread_messages: [],
  },
  isLoading: false,
  isLoadingMsg: false,
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    getDirectConversations(state, action) {
      const user_id = window.localStorage.getItem("user_id");

      const list = action.payload.conversations.map((e) => {
        const this_user = e.members.find(
          (member) => member._id.toString() !== action.payload.userId
        );

        const pinned = e.pinnedBy.includes(user_id);

        return {
          id: e._id,
          user_id: this_user._id,
          img: faker.image.avatar(),
          name: `${this_user.firstName} ${this_user.lastName}`,
          msg: faker.music.songName(),
          time: "9:36",
          unread: 0,
          pinned: pinned,
          online: this_user.status === "Online",
          lastMessage: e.messages.length ? e.messages.at(-1)?.text : "",
        };
      });

      state.direct_chat.conversations = list;

      //send notification to other users

      const chats = list.map((conversation) => {
        return conversation.user_id;
      });
      const friends = chats.flat();

      socket.emit("setStatus", {
        user_id: action.payload.userId,
        friends,
        online: true,
      });
    },

    updateDirectConversation(state, action) {
      const updatedConversation = action.payload.conversation._id;

      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (con) => {
          return con.id === updatedConversation
            ? { ...con, pinned: !con.pinned }
            : con;
        }
      );
    },

    addDirectConversation(state, action) {
      const user_id = window.localStorage.getItem("user_id");
      const this_conversation = action.payload;
      const user = this_conversation.members.find(
        (e) => e._id.toString() !== user_id
      );

      if (
        !state.direct_chat.conversations.some((e) => e.user_id === user._id)
      ) {
        state.direct_chat.conversations.push({
          id: this_conversation._id,
          user_id: user._id,
          img: faker.image.avatar(),
          name: `${user.firstName} ${user.lastName}`,
          msg: faker.music.songName(),
          time: "9:36",
          unread: 0,
          pinned: false,
          online: user.status === "Online",
          lastMessage: "",
        });
      }
    },
    setCurrentConversation(state, action) {
      if (
        state.direct_chat.current_conversation.room_id &&
        state.direct_chat.current_conversation.room_id ===
          action.payload.room_id
      ) {
        state.direct_chat.current_conversation = {
          user_id: null,
          room_id: null,
          userInfo: {
            name: null,
            online: null,
          },
        };
        state.direct_chat.current_meessages = null;
      } else {
        state.isLoadingMsg = true;
        state.direct_chat.current_meessages = null;
        state.direct_chat.current_conversation = action.payload;
      }
      // SetConversation({
      //   user_id,
      //   room_id: id,
      //   userInfo: {
      //     name,
      //     online: online,
      //   },
      // })

      state.isLoadingMsg = true;
    },
    deleteDirectConversation(state, action) {
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (con) => con.id !== action.payload.room_id
      );
    },
    getCurrentMessages(state, action) {
      const user_id = window.localStorage.getItem("user_id");
      const formatted_messages = action.payload.messages.map((el) => {
        return {
          id: el._id,
          type: "msg",
          subtype: el.subtype,
          message: el.text,
          incoming: el.to === user_id,
          outgoing: el.from === user_id,
        };
      });

      state.direct_chat.current_meessages = formatted_messages;
      state.isLoadingMsg = false;
    },
    addDirectMessage(state, action) {
      const array = state?.direct_chat?.current_meessages;

      if (array) {
        const lastMessage = array[array.length - 1];
        if (!lastMessage || lastMessage.id !== action.payload?.id) {
          state.direct_chat.current_meessages.push(action.payload);
        }
      } else {
        state.direct_chat.current_meessages = [action.payload];
      }

      const updatedConversations = state.direct_chat.conversations.map(
        (con) => {
          return con.id === state.direct_chat?.current_conversation?.room_id
            ? { ...con, lastMessage: action.payload.message }
            : con;
        }
      );
      state.direct_chat.conversations = [...updatedConversations];
    },

    addUnreadMessage(state, action) {
      const { room_id, message } = action.payload;
      const array = state.direct_chat.unread_messages;

      if (state.direct_chat.current_conversation.room_id !== room_id) {
        if (array[array.length - 1]?.message?.id !== message?.id) {
          array.push(action.payload);
        }

        const updatedConversations = state.direct_chat.conversations.map(
          (con) => {
            return con.id === room_id
              ? { ...con, lastMessage: message.message }
              : con;
          }
        );
        state.direct_chat.conversations = [...updatedConversations];
      }
    },

    receiveMessages(state, action) {
      const { room_id } = action.payload;
      state.direct_chat.unread_messages =
        state.direct_chat.unread_messages.filter(
          (mess) => mess.room_id !== room_id
        );

      //TODO some emit to chang data in data base read to unread
    },
    clearConversation(state) {
      // const exists = state.direct_chat.conversations.some(
      //   (member) =>
      //     member.id === state.direct_chat?.current_conversation?.room_id
      // );

      // if (!exists) {
      state.direct_chat.current_conversation = {
        user_id: null,
        room_id: null,
        userInfo: {
          name: null,
          online: null,
        },
      };
      state.direct_chat.current_meessages = [];
      state.isLoading = false;
      // }
      // state.direct_chat.conversations = [];
    },
    //-----------------------Group Msg-------------------------------------------------
    getGroupConversations(state, action) {
      const user_id = window.localStorage.getItem("user_id");

      const list = action.payload.conversations.map((e) => {
        const restOfUsers = e.members
          .filter((member) => member._id.toString() !== user_id)
          .map((member) => member._id);

        const pinned = e.pinnedBy.includes(user_id);

        return {
          id: e._id,
          user_id: restOfUsers,
          img: faker.image.avatar(),
          name: e.title,
          msg: "",
          time: "9:36",
          unread: 0,
          pinned: pinned,
          online: false,
          lastMessage: e.messages.length ? e.messages.at(-1)?.text : "",
        };
      });

      state.group_chat.conversations = list;

      //send notification to other users

      const chats = list.map((conversation) => {
        return conversation.user_id;
      });
      const friends = chats.flat();

      socket.emit("setStatus", {
        user_id: action.payload.userId,
        friends,
        online: true,
      });
    },
    updateGroupConversation(state, action) {
      const updatedConversation = action.payload.conversation._id;

      state.group_chat.conversations = state.group_chat.conversations.map(
        (con) => {
          return con.id === updatedConversation
            ? { ...con, pinned: !con.pinned }
            : con;
        }
      );
    },

    addGroupConversation(state, action) {
      // const user_id = window.localStorage.getItem("user_id");
      const this_conversation = action.payload;

      if (
        !state.group_chat.conversations.some(
          (e) => e.id === this_conversation._id
        )
      ) {
        state.group_chat.conversations.push({
          id: this_conversation._id,
          user_id: null,
          img: faker.image.avatar(),
          name: this_conversation.title,
          msg: "",
          time: "9:36",
          unread: 0,
          pinned: false,
          online: false,
          lastMessage: "",
        });
      }
    },
    deleteGroupConversation(state, action) {
      state.group_chat.conversations = state.group_chat.conversations.filter(
        (con) => con.id !== action.payload.room_id
      );
    },
    getCurrentGroupMessages(state, action) {
      const user_id = window.localStorage.getItem("user_id");
      const formatted_messages = action.payload.messages.map((el) => {
        return {
          id: el._id,
          type: "msg",
          subtype: el.subtype,
          message: el.text,
          incoming: el.to === user_id,
          outgoing: el.from === user_id,
        };
      });

      state.group_chat.current_meessages = formatted_messages;
      state.isLoadingMsg = false;
    },
    setCurrentGroupConversation(state, action) {
      if (
        state.group_chat.current_conversation?.room_id &&
        state.group_chat.current_conversation?.room_id ===
          action.payload.room_id
      ) {
        state.group_chat.current_conversation = {
          user_id: null,
          room_id: null,
        };
      } else {
        state.group_chat.current_conversation = action.payload;
      }
      state.group_chat.current_meessages = null;
      state.isLoadingMsg = true;
    },
    addGroupMessage(state, action) {
      const array = state?.group_chat?.current_meessages;

      if (array) {
        const lastMessage = array[array.length - 1];
        if (!lastMessage || lastMessage.id !== action.payload?.id) {
          state.group_chat.current_meessages.push(action.payload);
        }
      } else {
        state.group_chat.current_meessages = [action.payload];
      }

      const updatedConversations = state.group_chat.conversations.map((con) => {
        return con.id === state.group_chat?.current_conversation?.room_id
          ? { ...con, lastMessage: action.payload.message }
          : con;
      });
      state.group_chat.conversations = [...updatedConversations];
    },
    addUnreadGroupMessage(state, action) {
      const { room_id, message } = action.payload;
      const array = state.group_chat.unread_messages;

      if (state.group_chat.current_conversation.room_id !== room_id) {
        if (array[array.length - 1]?.message?.id !== message?.id) {
          array.push(action.payload);
        }

        const updatedConversations = state.group_chat.conversations.map(
          (con) => {
            return con.id === room_id
              ? { ...con, lastMessage: message.message }
              : con;
          }
        );
        state.group_chat.conversations = [...updatedConversations];
      }
    },
    receiveGroupMessages(state, action) {
      const { room_id } = action.payload;
      state.group_chat.unread_messages =
        state.group_chat.unread_messages.filter(
          (mess) => mess.room_id !== room_id
        );

      //TODO some emit to chang data in data base read to unread
    },
    clearGroupConversation(state) {
      // const exists = state.group_chat.conversations.some(
      //   (member) =>
      //     member.id === state.group_chat?.current_conversation?.room_id
      // );

      // if (!exists) {
      state.group_chat.current_conversation = {
        user_id: null,
        room_id: null,
      };
      state.group_chat.current_meessages = [];
      state.isLoading = false;
      // }
      // state.direct_chat.conversations = [];
    },
    //-----------------others-----------------------------------------------------------------------
    updateOnline(state, action) {
      const updatedConversation = action.payload.from;

      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (con) => {
          return con.user_id === updatedConversation
            ? { ...con, online: action.payload.online }
            : con;
        }
      );
    },
    isLoading(state, action) {
      state.isLoading = action.payload;
    },
    isLoadingMsg(state, action) {
      state.isLoadingMsg = action.payload;
    },
  },
});
export default slice.reducer;

export function GetDirectConversations({ conversations }) {
  return async (dispatch, getState) => {
    const userId = await getState().auth.user_id;
    await dispatch(
      slice.actions.getDirectConversations({ conversations, userId })
    );
  };
}
export function UpdateDirectConversation({ conversation }) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateDirectConversation({
        conversation,
        conversations: getState(),
      })
    );
  };
}
export function DeleteDirectConversation({ room_id }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.deleteDirectConversation({ room_id }));
  };
}
export function AddDirectConversation(conversations) {
  return (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation(conversations));
  };
}
export function SetConversation(current_room) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(current_room));
  };
}
export function GetCurrentMessages({ messages }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.getCurrentMessages({ messages }));
  };
}
export function AddDirectMessage(message) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage(message));
  };
}
export function AddUnreadMessage({ room_id, message }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addUnreadMessage({ room_id, message }));
  };
}
export function ReceiveMessages({ room_id }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.receiveMessages({ room_id }));
  };
}
export function ClearConversation() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.clearConversation());
  };
}

//----------------------------------------------------------------------------------------------

export function GetGroupConversations({ conversations }) {
  return async (dispatch, getState) => {
    await dispatch(slice.actions.getGroupConversations({ conversations }));
  };
}
export function AddGroupConversation(conversations) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addGroupConversation(conversations));
  };
}
export function UpdateGroupConversation({ conversation }) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateGroupConversation({
        conversation,
        conversations: getState(),
      })
    );
  };
}
export function DeleteGroupConversation({ room_id }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.deleteGroupConversation({ room_id }));
  };
}
export function SetGroupConversation(current_room) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentGroupConversation(current_room));
  };
}
export function GetCurrentGroupMessages({ messages }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.getCurrentGroupMessages({ messages }));
  };
}
export function AddGroupMessage(message) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addGroupMessage(message));
  };
}
export function AddUnreadGroupMessage({ room_id, message }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addUnreadGroupMessage({ room_id, message }));
  };
}
export function ReceiveGroupMessages({ room_id }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.receiveGroupMessages({ room_id }));
  };
}
export function ClearGroupConversation() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.clearGroupConversation());
  };
}

//-------------------------------------------------------------------------------------------
export function IsLoading(isLoading) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading(isLoading));
  };
}
export function UpdateOnline({ online, from }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateOnline({ from, online }));
  };
}

export function getDirectConversations() {
  return (state) => state.coversations.direct_chat;
}
export function getGroupConversations() {
  return (state) => state.coversations.group_chat;
}
export function getConversations() {
  return (state) => state.coversations;
}
export function getRoomId() {
  return (state) =>
    state.coversations.direct_chat?.current_conversation?.room_id;
}
export function getGroupRoomId() {
  return (state) =>
    state.coversations.group_chat?.current_conversation?.room_id;
}
