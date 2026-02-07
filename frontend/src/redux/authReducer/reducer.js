import {
  CREATE_USER_LOADING,
  CREATE_USER_ERROR,
  CREATE_USER_SUCCESS,
  LOGIN_USER_LOADING,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  POST_DISLIKE_SUCCESS,
  POST_LIKE_SUCCESS,
  RESET,
  UPDATE_USER_DETAILS,
  GET_LOGGEDUSER_LOADING,
  GET_LOGGEDUSER_SUCCESS,
  GET_LOGGEDUSER_ERROR,
} from "./actionTypes";

const tokenFromStorage = localStorage.getItem("token");

const initState = {
  isLoading: false,
  isError: false,
  isAuth: tokenFromStorage ? true : false,
  token: tokenFromStorage || null,
  loggedInUser: null,
  recipes: null,
};

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case CREATE_USER_LOADING:
    case LOGIN_USER_LOADING:
    case GET_LOGGEDUSER_LOADING:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case CREATE_USER_ERROR:
    case LOGIN_USER_ERROR:
    case GET_LOGGEDUSER_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case LOGIN_USER_SUCCESS:
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        isLoading: false,
        isAuth: true,
        token: action.payload,
      };

    case GET_LOGGEDUSER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        loggedInUser: action.payload,
      };

    case UPDATE_USER_DETAILS:
      return {
        ...state,
        loggedInUser: action.payload,
      };

    case POST_LIKE_SUCCESS:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          likedRecipes: [...state.loggedInUser.likedRecipes, action.payload],
        },
      };

    case POST_DISLIKE_SUCCESS:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          likedRecipes: state.loggedInUser.likedRecipes.filter(
            (id) => id !== action.payload
          ),
        },
      };

    case "GET_USER_RECIPES":
      return {
        ...state,
        recipes: action.payload,
      };

    case RESET:
      localStorage.removeItem("token");
      return {
        ...initState,
        token: null,
        isAuth: false,
      };

    default:
      return state;
  }
};
