import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";

import { AllRoutes } from "./routes/AllRoutes";
import { Navbar } from "./components/common/Navbar";
import { AddRecipeModal } from "./pages/AddRecipeModal";
import Footer from "./components/Footer";
import { SOCKET_NEW_RECIPE } from "./redux/recipeReducer/actionTypes";

// 🔥 SOCKET INSTANCE
const socket = io(process.env.REACT_APP_API_URL);

function App() {
  const dispatch = useDispatch();

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
