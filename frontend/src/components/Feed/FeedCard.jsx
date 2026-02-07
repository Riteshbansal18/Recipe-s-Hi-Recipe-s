import React, { useState, useEffect } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { BiLike, BiShare } from "react-icons/bi";
import { Carousel } from "./Carousel";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Avatar,
  Box,
  Heading,
  Tag,
  Text,
  IconButton,
  Button,
  Divider,
  Image,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { updateRecipe, getFeed } from "../../redux/recipeReducer/actions";
import { updateUser } from "../../redux/userReducer/actions";
import { useNavigate } from "react-router-dom";

export default function FeedCard({ recipe }) {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser, token } = useSelector(
    (store) => store.authReducer
  );

  /* =========================
      SAFE IDS
  ========================= */
  const userId = loggedInUser?._id || null;
  const recipeId = recipe?._id || null;

  /* =========================
      STATES (INITIAL)
  ========================= */
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  /* =========================
      SYNC STATE AFTER LOAD
  ========================= */
  useEffect(() => {
    if (!loggedInUser || !recipe) return;

    setLiked(recipe.likes?.includes(userId));
    setSaved(loggedInUser.savedRecipes?.includes(recipeId));
    setComments(recipe.comments || []);
  }, [loggedInUser, recipe, userId, recipeId]);

  /* =========================
      LOADING GUARD
  ========================= */
  if (!loggedInUser || !recipe) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  /* =========================
      LIKE / UNLIKE
  ========================= */
  const addLikeHandler = () => {
    if (liked) return;

    dispatch(
      updateRecipe(
        recipeId,
        { likes: [...recipe.likes, userId] },
        token
      )
    );

    dispatch(
      updateUser(
        userId,
        { likedRecipes: [...loggedInUser.likedRecipes, recipeId] },
        token
      )
    );

    setLiked(true);
  };

  const removeLikeHandler = () => {
    if (!liked) return;

    dispatch(
      updateRecipe(
        recipeId,
        { likes: recipe.likes.filter((id) => id !== userId) },
        token
      )
    );

    dispatch(
      updateUser(
        userId,
        {
          likedRecipes: loggedInUser.likedRecipes.filter(
            (id) => id !== recipeId
          ),
        },
        token
      )
    );

    setLiked(false);
  };

  /* =========================
      SAVE / UNSAVE
  ========================= */
  const saveRecipeHandler = () => {
    if (saved) return;

    dispatch(
      updateUser(
        userId,
        { savedRecipes: [...loggedInUser.savedRecipes, recipeId] },
        token
      )
    );

    setSaved(true);
  };

  const unsaveRecipeHandler = () => {
    if (!saved) return;

    dispatch(
      updateUser(
        userId,
        {
          savedRecipes: loggedInUser.savedRecipes.filter(
            (id) => id !== recipeId
          ),
        },
        token
      )
    );

    setSaved(false);
  };

  /* =========================
      DELETE RECIPE
  ========================= */
  const deleteRecipeHandler = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/recipe/delete/${recipeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Recipe deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      dispatch(getFeed(token));
    } catch {
      toast({
        title: "Failed to delete recipe",
        status: "error",
      });
    }
  };

  /* =========================
      ADD COMMENT
  ========================= */
  const addCommentHandler = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/comment/add`,
        {
          text: newComment,
          recipeId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments([...comments, res.data.comment]);
      setNewComment("");
      dispatch(getFeed(token));
    } catch {
      toast({
        title: "Failed to add comment",
        status: "error",
      });
    }
  };

  /* =========================
      JSX
  ========================= */
  return (
    <Card mb="2rem" boxShadow="md">
      {/* ---------- HEADER ---------- */}
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Flex gap="4" align="center">
            <Avatar src={recipe.userId?.profileImage} />
            <Box>
              <Heading size="md">{recipe.userId?.name}</Heading>
              <Text fontSize="sm">{recipe.caption}</Text>
            </Box>
          </Flex>

          <Flex gap={2}>
            <IconButton
              variant="ghost"
              icon={saved ? <BsBookmarkFill /> : <BsBookmark />}
              onClick={saved ? unsaveRecipeHandler : saveRecipeHandler}
            />

            {userId === recipe.userId?._id && (
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={deleteRecipeHandler}
              >
                Delete
              </Button>
            )}
          </Flex>
        </Flex>
      </CardHeader>

      {/* ---------- BODY ---------- */}
      <CardBody>
        <Carousel images={recipe.images || []} />

        <Flex mt={4} align="center" justify="space-between">
          <Heading size="md">{recipe.title}</Heading>
          <Image
            w="24px"
            src={`/images/${
              recipe.veg ? "veg-icon.png" : "non-veg-icon.png"
            }`}
          />
        </Flex>

        <Text mt={2}>{recipe.description}</Text>

        <Flex mt={3} gap={2} wrap="wrap">
          {recipe.tags?.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </Flex>
      </CardBody>

      {/* ---------- FOOTER ---------- */}
      <CardFooter gap={3}>
        <Button
          onClick={liked ? removeLikeHandler : addLikeHandler}
          leftIcon={<BiLike />}
          variant="outline"
        >
          {recipe.likes.length}
        </Button>

        <Button
          variant="outline"
          leftIcon={<BiShare />}
          onClick={() => navigate(`/recipe/${recipeId}`)}
        >
          View
        </Button>
      </CardFooter>

      <Divider />

      {/* ---------- COMMENTS ---------- */}
      <Box p={4}>
        <Text fontWeight="bold">{comments.length} Comments</Text>

        {comments
          .filter((c) => c.userId)
          .slice(-3)
          .map((comment) => (
            <Flex key={comment._id} mt={3} gap={3}>
              <Avatar size="sm" src={comment.userId.profileImage} />
              <Box>
                <Text fontWeight="bold">{comment.userId.name}</Text>
                <Text fontSize="sm">{comment.text}</Text>
              </Box>
            </Flex>
          ))}

        <Flex mt={3} gap={2}>
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={addCommentHandler}>Post</Button>
        </Flex>
      </Box>
    </Card>
  );
}
