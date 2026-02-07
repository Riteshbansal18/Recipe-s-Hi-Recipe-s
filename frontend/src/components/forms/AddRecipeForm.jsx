import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Image,
  Grid,
  Select,
  HStack,
  Tag,
  TagCloseButton,
  RadioGroup,
  Radio,
  useToast,
  Flex,
  Divider,
} from "@chakra-ui/react";
import {
  Step,
  StepIcon,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  Text,
} from "@chakra-ui/react";
import { addNewRecipe } from "../../redux/recipeReducer/actions";

const cuisines = [
  "Mexican",
  "Italian",
  "Chinese",
  "Indian",
  "German",
  "Greek",
  "Filipino",
  "Japanese",
  "Other",
];

const tags = [
  "Healthy",
  "Vegan",
  "Dessert",
  "Spicy",
  "Quick",
  "Pasta",
  "Sea food",
  "Chicken",
  "Main Dish",
  "Appetizer",
  "Curry",
  "Salad",
  "Soup",
];

const steps = [
  { title: "First", description: "Add Basic Recipe Information" },
  { title: "Second", description: "Add Ingredients & Instructions" },
  { title: "Third", description: "Add Recipe Images" },
  { title: "Fourth", description: "Add Tags & Caption" },
];

export const AddRecipeForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");

  const [step, setStep] = useState(1);
  const activeStepText = steps[step - 1].description;

  const [ingredient, setIngredient] = useState("");
  const [instruction, setInstruction] = useState("");

  const [recipeData, setRecipeData] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    images: [],
    cuisine: [],
    tags: [],
    veg: false,
    caption: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCuisineChange = (e) => {
    if (!recipeData.cuisine.includes(e.target.value)) {
      setRecipeData((prev) => ({
        ...prev,
        cuisine: [...prev.cuisine, e.target.value],
      }));
    }
  };

  const handleCuisineRemove = (cuisine) => {
    setRecipeData((prev) => ({
      ...prev,
      cuisine: prev.cuisine.filter((c) => c !== cuisine),
    }));
  };

  const handleTagsChange = (e) => {
    if (!recipeData.tags.includes(e.target.value)) {
      setRecipeData((prev) => ({
        ...prev,
        tags: [...prev.tags, e.target.value],
      }));
    }
  };

  const handleTagRemove = (tag) => {
    setRecipeData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleVegChange = (value) => {
    setRecipeData((prev) => ({
      ...prev,
      veg: value === "true",
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setRecipeData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleAddIngredient = () => {
    if (!ingredient) return;
    setRecipeData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient],
    }));
    setIngredient("");
  };

  const handleAddInstruction = () => {
    if (!instruction) return;
    setRecipeData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, instruction],
    }));
    setInstruction("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recipeData.title || recipeData.images.length === 0) {
      toast({
        title: "Missing required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();

    Object.entries(recipeData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });

    dispatch(addNewRecipe(token, formData, toast, navigate, closeModal));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input name="title" onChange={handleInputChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" onChange={handleInputChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Cuisine</FormLabel>
              <Select onChange={handleCuisineChange}>
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              <HStack mt={2}>
                {recipeData.cuisine.map((c) => (
                  <Tag key={c}>
                    {c}
                    <TagCloseButton onClick={() => handleCuisineRemove(c)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>

            <RadioGroup onChange={handleVegChange}>
              <HStack>
                <Radio value="true">Veg</Radio>
                <Radio value="false">Non-Veg</Radio>
              </HStack>
            </RadioGroup>

            <Flex justify="space-between">
              <Button onClick={closeModal}>Close</Button>
              <Button onClick={() => setStep(2)}>Next</Button>
            </Flex>
          </>
        );

      case 2:
        return (
          <>
            <Input
              placeholder="Ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />
            <Button onClick={handleAddIngredient}>Add</Button>

            <Textarea
              placeholder="Instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
            <Button onClick={handleAddInstruction}>Add</Button>

            <Flex justify="space-between">
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </Flex>
          </>
        );

      case 3:
        return (
          <>
            <input type="file" multiple onChange={handleFileChange} />
            <Grid templateColumns="repeat(2,1fr)" gap={2}>
              {recipeData.images.map((img, i) => (
                <Image key={i} src={URL.createObjectURL(img)} />
              ))}
            </Grid>

            <Flex justify="space-between">
              <Button onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)}>Next</Button>
            </Flex>
          </>
        );

      case 4:
        return (
          <>
            <Select onChange={handleTagsChange}>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>

            <Textarea
              name="caption"
              placeholder="Caption"
              onChange={handleInputChange}
            />

            <Flex justify="space-between">
              <Button onClick={() => setStep(3)}>Back</Button>
              <Button colorScheme="green" onClick={handleSubmit}>
                Post Recipe
              </Button>
            </Flex>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Stepper index={step - 1}>
        {steps.map((_, i) => (
          <Step key={i}>
            <StepIndicator>
              <StepStatus complete={<StepIcon />} />
            </StepIndicator>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Text mt={2}>
        Step {step}: <b>{activeStepText}</b>
      </Text>

      <Stack mt={4}>{renderStep()}</Stack>
    </>
  );
};
