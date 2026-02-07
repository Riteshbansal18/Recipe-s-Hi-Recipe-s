import {
  ADDRECIPE_ERROR,
  ADDRECIPE_LOADING,
  ADDRECIPE_SUCCESS,
  GET_FEED_ERROR,
  GET_FEED_LOADING,
  GET_FEED_SUCCESS,
  UPDATE_RECIPE_SUCCESS,
  SOCKET_NEW_RECIPE,
} from "./actionTypes";

const initState = {
  isLoading: false,
  isError: false,
  recipes: [],
  feed: [],
};

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case ADDRECIPE_LOADING:
      return { ...state, isLoading: true, isError: false };

    case ADDRECIPE_ERROR:
      return { ...state, isLoading: false, isError: true };

    case ADDRECIPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        recipes: [...state.recipes, action.payload],
        feed: [action.payload, ...state.feed],
      };

    case GET_FEED_LOADING:
      return { ...state, isLoading: true };

    case GET_FEED_ERROR:
      return { ...state, isLoading: false, isError: true };

    case GET_FEED_SUCCESS:
      return { ...state, isLoading: false, feed: action.payload };

    // 🔥 SOCKET REAL-TIME PUSH
    case SOCKET_NEW_RECIPE:
      return {
        ...state,
        feed: [action.payload, ...state.feed],
      };

    case UPDATE_RECIPE_SUCCESS:
      return {
        ...state,
        recipes: state.recipes.map((r) =>
          r._id === action.payload._id ? action.payload : r
        ),
        feed: state.feed.map((r) =>
          r._id === action.payload._id ? action.payload : r
        ),
      };

    default:
      return state;
  }
};
