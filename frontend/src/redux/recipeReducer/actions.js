import {
  ADDRECIPE_ERROR,
  ADDRECIPE_LOADING,
  ADDRECIPE_SUCCESS,
  GET_FEED_ERROR,
  GET_FEED_LOADING,
  GET_FEED_SUCCESS,
} from "./actionTypes";

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

/* =========================
   ADD NEW RECIPE
========================= */
export const addNewRecipe =
  (token, recipe, toast, navigate, closeModal) => async (dispatch) => {
    dispatch({ type: ADDRECIPE_LOADING });

    try {
      const response = await axios.post(
        `${API_URL}/recipe/add`,
        recipe,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({
        type: ADDRECIPE_SUCCESS,
        payload: response.data.recipe,
      });

      toast({
        title: "Recipe Created",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      closeModal();
      navigate("/feed");
    } catch (err) {
      dispatch({ type: ADDRECIPE_ERROR });

      toast({
        title: "Failed To Add Recipe",
        description:
          err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

/* =========================
   GET USER FEED
========================= */
export const getFeed = (token) => async (dispatch) => {
  dispatch({ type: GET_FEED_LOADING });

  try {
    const res = await axios.get(
      `${API_URL}/recipe/feed`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const recipes = res.data.feed.map((recipe) => ({
      ...recipe,
      images: recipe.images.map(
        (img) => `${API_URL}/${img}`
      ),
      userId: {
        ...recipe.userId,
        profileImage: recipe.userId?.profileImage
          ? `${API_URL}/${recipe.userId.profileImage}`
          : null,
      },
    }));

    dispatch({ type: GET_FEED_SUCCESS, payload: recipes });
  } catch (err) {
    dispatch({ type: GET_FEED_ERROR });
  }
};

/* =========================
   UPDATE RECIPE
========================= */
export const updateRecipe =
  (id, recipe, token, toast) => async (dispatch) => {
    dispatch({ type: ADDRECIPE_LOADING });

    try {
      await axios.patch(
        `${API_URL}/recipe/update/${id}`,
        recipe,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(getFeed(token));
    } catch (err) {
      dispatch({ type: ADDRECIPE_ERROR });

      toast({
        title: "Failed To Update Recipe",
        description:
          err.response?.data?.message || "Update failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

/* =========================
   GET SINGLE RECIPE
========================= */
export const getSingleRecipe = async (token, id) => {
  try {
    const res = await axios.get(
      `${API_URL}/recipe/getSingleRecipe/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
