import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Carousel } from "../components/Feed/SingleRecipeCarousel";
import { useParams } from "react-router-dom";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Tag,
  Text,
  List,
  ListItem,
  VStack,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import axios from "axios";

function SingleRecipe() {
  const { postId } = useParams();
  const [owner, setOwner] = useState({});
  const [recipe, setRecipe] = useState(null);

  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/recipe/getSingleRecipe/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const data = res.data;

        // 🔥 IMAGE FIX – yahin full URL bana rahe hain
        const fixedRecipe = {
          ...data,
          images: data.images.map(
            (img) => `${process.env.REACT_APP_API_URL}/${img}`
          ),
          userId: {
            ...data.userId,
            profileImage: data.userId?.profileImage
              ? `${process.env.REACT_APP_API_URL}/${data.userId.profileImage}`
              : null,
          },
        };

        setRecipe(fixedRecipe);
        setOwner(fixedRecipe.userId);
      })
      .catch((err) => console.log(err));
  }, [postId, token]);

  if (!recipe) {
    return <h1>Loading...</h1>;
  }

  return (
    <DIV>
      <Flex gap="1rem" justifyContent="space-between" mb="2rem">
        {/* LEFT */}
        <Box width="55%">
          <Carousel height="100%" images={recipe.images} />
          <Divider mt="2rem" />

          <Heading textTransform="uppercase" size="lg" my="2rem">
            Ingredients
          </Heading>

          <VStack align="start">
            <List
              w="100%"
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
              gap={4}
            >
              {recipe.ingredients.map((item, i) => (
                <ListItem key={i} display="flex" alignItems="center">
                  <Box as={CheckIcon} w={4} h={4} color="green.500" mr={2} />
                  <Text fontSize="sm">{item}</Text>
                </ListItem>
              ))}
            </List>
          </VStack>
        </Box>

        {/* RIGHT */}
        <Box width="45%" p="1rem" display="flex" flexDirection="column" gap="1rem">
          <Flex gap="1rem" alignItems="center">
            <Avatar size="xl" src={owner.profileImage} />
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                {owner.name}
              </Text>
              <Text>{owner.city}</Text>
            </Box>
          </Flex>

          <Heading size="lg">{recipe.title}</Heading>
          <Text>{recipe.description}</Text>
          <Text>{recipe.cuisine[0]}</Text>

          <Flex gap={3} wrap="wrap">
            {recipe.tags.map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))}
          </Flex>

          <Divider />

          <Heading size="md">Instructions</Heading>
          <Stepper orientation="vertical">
            {recipe.instructions.map((step, i) => (
              <Step key={i}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <StepSeparator />
                <Box>
                  <StepTitle>{step}</StepTitle>
                </Box>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Flex>
    </DIV>
  );
}

export default SingleRecipe;

const DIV = styled.div`
  width: 90%;
  margin: 5rem auto 10rem auto;
`;
