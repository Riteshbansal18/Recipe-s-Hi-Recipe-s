import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import FeedCard from "./FeedCard";
import { useDispatch, useSelector } from "react-redux";
import { getFeed } from "../../redux/recipeReducer/actions";

export const UserFeed = () => {
  const dispatch = useDispatch();

  const feed = useSelector((store) => store.recipeReducer.feed) || [];
  const isLoading = useSelector((store) => store.recipeReducer.isLoading);

  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    dispatch(getFeed(token));
  }, [dispatch, token]);

  return (
    <Box
      p={5}
      w="50%"
      h="90vh"
      overflowY="scroll"
      className="scroll"
      backgroundColor="white"
      boxShadow="rgba(0, 0, 0, 0.05) 0px 0px 0px 1px"
    >
      {isLoading ? (
        <Flex alignItems="center" justifyContent="center" minH="50vh">
          <Spinner
            w="5rem"
            h="5rem"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="primary.500"
          />
        </Flex>
      ) : feed.length > 0 ? (
        feed.map((recipe) => (
          <FeedCard key={recipe._id} recipe={recipe} />
        ))
      ) : (
        <Flex alignItems="center" justifyContent="center" minH="50vh">
          <Heading size="md" color="gray.500">
            Nothing in your feed yet
          </Heading>
        </Flex>
      )}
    </Box>
  );
};
