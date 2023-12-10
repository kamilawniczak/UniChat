import {
  ChatCircleDots,
  Gear,
  GearSix,
  SignOut,
  User,
  Users,
} from "@phosphor-icons/react";

const Profile_Menu = [
  {
    title: "Profile",
    icon: <User />,
  },
  {
    title: "Settings",
    icon: <Gear />,
  },
  {
    title: "Logout",
    icon: <SignOut />,
  },
];

const Nav_Buttons = [
  {
    index: 0,
    icon: <ChatCircleDots />,
  },
  {
    index: 1,
    icon: <Users />,
  },
];

const Nav_Setting = [
  {
    index: 3,
    icon: <GearSix />,
  },
];

const Message_options = [
  {
    id: "save",
    title: "Save",
  },
  {
    id: "replay",
    title: "Reply",
  },
  {
    id: "reactToMsg",
    title: "React to message",
  },
  {
    id: "deleteMsg",
    title: "Delete Message",
  },
];

export { Profile_Menu, Nav_Setting, Nav_Buttons, Message_options };
