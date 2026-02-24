import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const token = useSelector((store) => store.authReducer.token);
  const location = useLocation();

  // 🔥 FIX: Check both Redux state AND localStorage
  const hasToken = token || localStorage.getItem("token");

  if (!isAuth && !hasToken) {
    return (
      <Navigate
        to="/login"
        state={{ pathname: location.pathname }}
        replace={true}
      />
    );
  }

  return children;
};
