import Router from "./routes";

import ThemeProvider from "./theme";

import ThemeSettings from "./components/settings";
import { Slide, Snackbar } from "@mui/material";
import { forwardRef, useEffect } from "react";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { CloseSnackBar, getSnackBarApp } from "./redux/slices/app";
import { socket } from "./socket";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const { severity, message, open } = useSelector(getSnackBarApp());
  const dispatch = useDispatch();
  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("user_id");
      socket.emit("logout", { user_id: user_id });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <ThemeProvider>
        <ThemeSettings>
          <Router />
        </ThemeSettings>
      </ThemeProvider>
      {message && open && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={() => {
            dispatch(CloseSnackBar());
          }}
          autoHideDuration={4000}
          TransitionComponent={Slide}
          TransitionProps={{
            direction: "down",
          }}
        >
          <Alert
            onClose={() => {
              dispatch(CloseSnackBar());
            }}
            severity={severity}
            sx={{
              width: "100%",
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

export default App;
