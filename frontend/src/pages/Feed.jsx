import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { UserFeed } from "../components/Feed/UserFeed";
import { FriendCard } from "../components/Feed/MiniCard";
import styled from "@emotion/styled";
import { BsSearch } from "react-icons/bs";
import { NonFriends } from "../components/Feed/NonFriends";
import { Requests } from "../components/Feed/Requests";
import { useDispatch, useSelector } from "react-redux";
import { getFriends } from "../redux/userReducer/actions";

export const Feed = () => {
  const dispatch = useDispatch();

  const friends = useSelector((store) => store.userReducer.friends);
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    dispatch(getFriends(token));
  }, [dispatch, token]);

  return (
    <DIV>
      <Flex direction="row" gap={4}>
        {/* LEFT SIDEBAR */}
        <Box
          p={5}
          w="26%"
          h="90vh"
          overflowY="scroll"
          className="scroll"
          backgroundColor="white"
          boxShadow="rgba(0, 0, 0, 0.05) 0px 0px 0px 1px"
        >
          <Heading size="md" mb="2rem" textTransform="uppercase">
            People Who Want To Know You
          </Heading>

          <Requests />

          <Divider my={5} />

          <Heading size="md" mb="2rem" textTransform="uppercase">
            Your Friends
          </Heading>

          <InputGroup mb="10px">
            <InputLeftElement pointerEvents="none">
              <BsSearch color="gray.300" />
            </InputLeftElement>
            <Input type="search" placeholder="Search" />
          </InputGroup>

          {friends && friends.length > 0 ? (
            friends.map((friend) => (
              <FriendCard friend={friend} key={friend._id} />
            ))
          ) : (
            <Box fontSize="sm" color="gray.500">
              No friends yet
            </Box>
          )}
        </Box>

        {/* CENTER FEED */}
        <UserFeed />

        {/* RIGHT SIDEBAR */}
        <Box
          p={5}
          w="24%"
          overflowY="scroll"
          className="scroll"
          backgroundColor="white"
          boxShadow="rgba(0, 0, 0, 0.05) 0px 0px 0px 1px"
        >
          <Heading size="md" mb="1rem" textTransform="uppercase">
            Find New Friends
          </Heading>
          <NonFriends />
        </Box>
      </Flex>
    </DIV>
  );
};

const DIV = styled.div`
  background-color: #f7fbfc;
  min-height: 100vh;

  .scroll::-webkit-scrollbar {
    display: none;
  }
`;
