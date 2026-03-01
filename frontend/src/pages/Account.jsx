import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Image,
  Text,
  Grid,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Editable,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
  IconButton,
  EditableInput,
  Textarea,
  Heading,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, updateUserDetails } from "../redux/authReducer/actions";
import { getImageUrl } from "../utils/imageHelper";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

export const Account = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [showRecipe, setShowRecipe] = useState("recipes");
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");
  // console.log(token)
  const user = useSelector((store) => store.authReducer.loggedInUser);
  // const recipes = useSelector((store) => store.authReducer.recipes);
  const [recipes, setRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [userName, setUserName] = useState(user?.name);
  const [userBio, setUserBio] = useState(user?.bio);
  const [userCity, setUserCity] = useState(user?.city);

  // Function to edit profile
  const handleEditProfile = () => {
    const newUserName = userName || user?.name;
    const newUserBio = userBio || user?.bio;
    const newUserCity = userCity || user?.city;

    const data = {
      name: newUserName,
      bio: newUserBio,
      city: newUserCity,
    };
    console.log("Data that i wanter to get updated", data);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    dispatch(updateUserDetails(user?._id, data, headers, toast));
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      dispatch(getUserData(token, toast));
    }
  }, []);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/recipe/getMyRecipe?populate=${showRecipe}&`,
        config
      )
      .then((response) => {
        setRecipes(response.data.recipes);
        setLikedRecipes(response.data.likedRecipes);
        setSavedRecipes(response.data.savedRecipes);
      })
      .catch((error) => {
        console.error("Error fetching user recipes:", error);
      });
  }, [showRecipe]);

  return (
    <Box bg="#EEF2F7" minH="100vh" py={8}>
      {/* Modal for editing profile */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="2xl">
          <ModalHeader 
            textTransform="uppercase" 
            fontSize="xl" 
            fontWeight="bold"
            color="text"
          >
            Edit Profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box mb={5}>
              <Text fontWeight="semibold" mb={2} color="secondary" fontSize="sm" textTransform="uppercase">
                Name
              </Text>
              <Editable
                textAlign="left"
                defaultValue={user?.name}
                fontSize="md"
                isPreviewFocusable={false}
                onChange={(newUserName) => setUserName(newUserName)}
              >
                <EditablePreview 
                  py={2} 
                  px={3} 
                  borderRadius="md" 
                  _hover={{ bg: "gray.50" }}
                />
                <Textarea 
                  as={EditableInput} 
                  py={2} 
                  px={3}
                  borderRadius="md"
                  focusBorderColor="primary.500"
                />
                <EditableControls />
              </Editable>
            </Box>

            <Box mb={5}>
              <Text fontWeight="semibold" mb={2} color="secondary" fontSize="sm" textTransform="uppercase">
                City
              </Text>
              <Editable
                textAlign="left"
                defaultValue={user?.city}
                fontSize="md"
                isPreviewFocusable={false}
                onChange={(newUserCity) => setUserCity(newUserCity)}
              >
                <EditablePreview 
                  py={2} 
                  px={3} 
                  borderRadius="md" 
                  _hover={{ bg: "gray.50" }}
                />
                <Textarea 
                  as={EditableInput} 
                  py={2} 
                  px={3}
                  borderRadius="md"
                  focusBorderColor="primary.500"
                />
                <EditableControls />
              </Editable>
            </Box>

            <Box mb={4}>
              <Text fontWeight="semibold" mb={2} color="secondary" fontSize="sm" textTransform="uppercase">
                Biography
              </Text>
              <Editable
                textAlign="left"
                defaultValue={user?.bio}
                fontSize="md"
                isPreviewFocusable={false}
                onChange={(newUserBio) => setUserBio(newUserBio)}
              >
                <EditablePreview 
                  py={2} 
                  px={3} 
                  borderRadius="md" 
                  _hover={{ bg: "gray.50" }}
                />
                <Textarea 
                  as={EditableInput} 
                  py={2} 
                  px={3}
                  minH="100px"
                  borderRadius="md"
                  focusBorderColor="primary.500"
                />
                <EditableControls />
              </Editable>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="outline" 
              mr={3} 
              onClick={onClose}
              borderColor="secondary"
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              variant="solid"
              onClick={handleEditProfile}
              px={8}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        {/* Profile Header Card */}
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          overflow="hidden"
          mb={6}
        >
          <Box px={{ base: 6, md: 10 }} py={8}>
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "center", md: "flex-start" }}
              gap={6}
            >
              {/* Profile Image */}
              <Box
                position="relative"
                mb={{ base: 4, md: 0 }}
              >
                <Box
                  p={1.5}
                  border="3px solid"
                  borderColor="accent"
                  borderRadius="full"
                  boxShadow="md"
                  bg="gray.100"
                >
                  <Image
                    w={{ base: "140px", md: "180px" }}
                    h={{ base: "140px", md: "180px" }}
                    borderRadius="full"
                    objectFit="cover"
                    src={getImageUrl(user?.profileImage)}
                    alt=""
                    fallback={
                      <Center
                        w={{ base: "140px", md: "180px" }}
                        h={{ base: "140px", md: "180px" }}
                        borderRadius="full"
                        bg="primary.100"
                      >
                        <Text fontSize="4xl" fontWeight="bold" color="primary.500">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </Text>
                      </Center>
                    }
                  />
                </Box>
              </Box>

              {/* Profile Info */}
              <Box 
                flex="1" 
                textAlign={{ base: "center", md: "left" }}
              >
                <Flex 
                  direction={{ base: "column", md: "row" }}
                  align={{ base: "center", md: "center" }}
                  justify={{ base: "center", md: "space-between" }}
                  mb={4}
                >
                  <Box>
                    <Heading 
                      size="xl" 
                      mb={2}
                      color="text"
                      textTransform="uppercase"
                      fontWeight="800"
                    >
                      {user?.name}
                    </Heading>
                    <Text color="secondary" fontSize="md" fontWeight="500">
                      {user?.city}
                    </Text>
                  </Box>
                  <Button
                    variant="outline"
                    onClick={onOpen}
                    mt={{ base: 4, md: 0 }}
                    leftIcon={<EditIcon />}
                    size="md"
                  >
                    Edit Profile
                  </Button>
                </Flex>

                <Text 
                  color="text" 
                  fontSize="md" 
                  mb={6}
                  maxW="2xl"
                >
                  {user?.bio || "No bio yet"}
                </Text>

                {/* Stats */}
                <Grid
                  templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
                  gap={4}
                  maxW="2xl"
                >
                  <Box
                    bg="primary.50"
                    p={4}
                    borderRadius="md"
                    textAlign="center"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                  >
                    <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                      {user?.recipes.length}
                    </Text>
                    <Text fontSize="sm" color="secondary" fontWeight="600" textTransform="uppercase">
                      Posts
                    </Text>
                  </Box>
                  <Box
                    bg="primary.50"
                    p={4}
                    borderRadius="md"
                    textAlign="center"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                  >
                    <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                      {user?.friends.length}
                    </Text>
                    <Text fontSize="sm" color="secondary" fontWeight="600" textTransform="uppercase">
                      Friends
                    </Text>
                  </Box>
                  <Box
                    bg="primary.50"
                    p={4}
                    borderRadius="md"
                    textAlign="center"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                  >
                    <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                      {user?.savedRecipes.length}
                    </Text>
                    <Text fontSize="sm" color="secondary" fontWeight="600" textTransform="uppercase">
                      Saved
                    </Text>
                  </Box>
                  <Box
                    bg="primary.50"
                    p={4}
                    borderRadius="md"
                    textAlign="center"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                  >
                    <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                      {user?.likedRecipes.length}
                    </Text>
                    <Text fontSize="sm" color="secondary" fontWeight="600" textTransform="uppercase">
                      Likes
                    </Text>
                  </Box>
                </Grid>
              </Box>
            </Flex>
          </Box>
        </Box>

        {/* Recipes Section */}
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          overflow="hidden"
        >
          <Tabs colorScheme="primary" variant="line">
            <TabList borderBottom="2px solid" borderColor="gray.200">
              <Tab 
                onClick={() => setShowRecipe("recipes")}
                fontWeight="600"
                textTransform="uppercase"
                fontSize="sm"
                _selected={{ 
                  color: "primary.500", 
                  borderColor: "primary.500"
                }}
              >
                My Posts
              </Tab>
              <Tab 
                onClick={() => setShowRecipe("savedRecipes")}
                fontWeight="600"
                textTransform="uppercase"
                fontSize="sm"
                _selected={{ 
                  color: "primary.500", 
                  borderColor: "primary.500"
                }}
              >
                Saved Recipes
              </Tab>
              <Tab 
                onClick={() => setShowRecipe("likedRecipes")}
                fontWeight="600"
                textTransform="uppercase"
                fontSize="sm"
                _selected={{ 
                  color: "primary.500", 
                  borderColor: "primary.500"
                }}
              >
                Liked Recipes
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={6}>
                {recipes?.length > 0 ? (
                  <Grid 
                    templateColumns={{ 
                      base: "repeat(2, 1fr)", 
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)" 
                    }} 
                    gap={4}
                  >
                    {recipes.map((ele, index) => (
                      <Box
                        key={index}
                        position="relative"
                        borderRadius="md"
                        overflow="hidden"
                        cursor="pointer"
                        transition="all 0.2s"
                        boxShadow="md"
                        _hover={{ 
                          transform: "scale(1.02)", 
                          boxShadow: "xl" 
                        }}
                        onClick={() => navigate(`/recipe/${ele._id}`)}
                      >
                        <Image
                          src={getImageUrl(ele.images[0])}
                          alt="Recipe"
                          w="100%"
                          h="250px"
                          objectFit="cover"
                        />
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          right={0}
                          bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
                          p={3}
                        >
                          <HStack spacing={3} color="white" fontSize="sm">
                            <Text>{ele?.likes?.length} Likes</Text>
                            <Text>{ele?.comments?.length} Comments</Text>
                          </HStack>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                ) : (
                  <Center py={12}>
                    <Text color="secondary" fontSize="lg">
                      No posts yet
                    </Text>
                  </Center>
                )}
              </TabPanel>

              <TabPanel p={6}>
                {savedRecipes?.length > 0 ? (
                  <Grid 
                    templateColumns={{ 
                      base: "repeat(2, 1fr)", 
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)" 
                    }} 
                    gap={4}
                  >
                    {savedRecipes.map((ele, index) => (
                      <Box
                        key={index}
                        position="relative"
                        borderRadius="md"
                        overflow="hidden"
                        cursor="pointer"
                        transition="all 0.2s"
                        boxShadow="md"
                        _hover={{ 
                          transform: "scale(1.02)", 
                          boxShadow: "xl" 
                        }}
                        onClick={() => navigate(`/recipe/${ele._id}`)}
                      >
                        <Image
                          src={getImageUrl(ele.images[0])}
                          alt="Recipe"
                          w="100%"
                          h="250px"
                          objectFit="cover"
                        />
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          right={0}
                          bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
                          p={3}
                        >
                          <HStack spacing={3} color="white" fontSize="sm">
                            <Text>{ele?.likes?.length} Likes</Text>
                            <Text>{ele?.comments?.length} Comments</Text>
                          </HStack>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                ) : (
                  <Center py={12}>
                    <Text color="secondary" fontSize="lg">
                      No saved recipes yet
                    </Text>
                  </Center>
                )}
              </TabPanel>

              <TabPanel p={6}>
                {likedRecipes?.length > 0 ? (
                  <Grid 
                    templateColumns={{ 
                      base: "repeat(2, 1fr)", 
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)" 
                    }} 
                    gap={4}
                  >
                    {likedRecipes.map((ele, index) => (
                      <Box
                        key={index}
                        position="relative"
                        borderRadius="md"
                        overflow="hidden"
                        cursor="pointer"
                        transition="all 0.2s"
                        boxShadow="md"
                        _hover={{ 
                          transform: "scale(1.02)", 
                          boxShadow: "xl" 
                        }}
                        onClick={() => navigate(`/recipe/${ele._id}`)}
                      >
                        <Image
                          src={getImageUrl(ele.images[0])}
                          alt="Recipe"
                          w="100%"
                          h="250px"
                          objectFit="cover"
                        />
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          right={0}
                          bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
                          p={3}
                        >
                          <HStack spacing={3} color="white" fontSize="sm">
                            <Text>{ele?.likes?.length} Likes</Text>
                            <Text>{ele?.comments?.length} Comments</Text>
                          </HStack>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                ) : (
                  <Center py={12}>
                    <Text color="secondary" fontSize="lg">
                      No liked recipes yet
                    </Text>
                  </Center>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
};

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
    </Flex>
  );
}
