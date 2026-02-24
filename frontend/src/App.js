import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useToast } from "@chakra-ui/react";

import { AllRoutes } from "./routes/AllRoutes";
import { Navbar } from "./components/common/Navbar";
import { AddRecipeModal } from "./pages/AddRecipeModal";
import Footer from "./components/Footer";
import { SOCKET_NEW_RECIPE } from "./redux/recipeReducer/actionTypes";
import { getUserData } from "./redux/authReducer/actions";

// 🔥 SOCKET INSTANCE
const socket = io(process.env.REACT_APP_API_URL);

function App() {
  const dispatch = useDispatch();
  const toast = useToast();
  const token = useSelector((store) => store.authReducer.token) || localStorage.getItem("token");
  const loggedInUser = useSelector((store) => store.authReducer.loggedInUser);

  // 🔥 FIX: Load user data on app mount if token exists
  useEffect(() => {
    if (token && !loggedInUser) {
      dispatch(getUserData(token, toast));
    }
  }, [token, loggedInUser, dispatch, toast]);

  useEffect(() => {
    // listen for real-time recipe
    socket.on("new-recipe", (recipe) => {
      dispatch({ type: SOCKET_NEW_RECIPE, payload: recipe });
    });

    return () => {
      socket.off("new-recipe");
    };
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <AllRoutes />
      <AddRecipeModal />
      <Footer />
    </div>
  );
}

export default App;
