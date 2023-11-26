import React, { createContext, useContext, useState } from "react";

const initialState = {
  msgId: { msgId: null, type: null },
  onSetMsgId: () => {},
  onResetMsgId: () => {},
};

const StateContext = createContext(initialState);

const StateProvider = ({ children }) => {
  const [replyInfo, setReplyInfo] = useState({ msgId: null, type: null });

  const onSetMsgId = (id) => {
    setReplyInfo(id);
  };
  const onResetMsgId = () => {
    setReplyInfo({ msgId: null, type: null });
  };

  return (
    <StateContext.Provider
      value={{
        replyMsgId: replyInfo.msgId,
        replyType: replyInfo.type,
        onSetMsgId,
        onResetMsgId,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

const useReplayMsgContext = () => useContext(StateContext);

export { StateProvider, useReplayMsgContext };
