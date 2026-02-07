import { Box, Flex, Text, Image, HStack, Icon } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState } from "react";

export const Carousel = ({ images = [], height = "500px" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = images.length;

  if (!slidesCount) return null;

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  };

  const setSlide = (slide) => setCurrentSlide(slide);

  return (
    <Flex
      width="100%"
      borderRadius="1rem"
      overflow="hidden"
      position="relative"
    >
      <Flex
        width={`${slidesCount * 100}%`}
        transform={`translateX(-${currentSlide * (100 / slidesCount)}%)`}
        transition="all 0.5s ease"
      >
        {images.map((image, index) => (
          <Box key={index} minW="100%" height={height}>
            <Image
              src={image}
              alt={`recipe-${index}`}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Box>
        ))}
      </Flex>

      {/* LEFT */}
      <Icon
        as={ChevronLeftIcon}
        position="absolute"
        left="10px"
        top="50%"
        transform="translateY(-50%)"
        fontSize="30px"
        color="white"
        cursor="pointer"
        onClick={prevSlide}
      />

      {/* RIGHT */}
      <Icon
        as={ChevronRightIcon}
        position="absolute"
        right="10px"
        top="50%"
        transform="translateY(-50%)"
        fontSize="30px"
        color="white"
        cursor="pointer"
        onClick={nextSlide}
      />

      {/* DOTS */}
      <HStack position="absolute" bottom="10px" left="50%" transform="translateX(-50%)">
        {images.map((_, i) => (
          <Box
            key={i}
            w="10px"
            h="10px"
            bg={currentSlide === i ? "white" : "whiteAlpha.600"}
            borderRadius="50%"
            cursor="pointer"
            onClick={() => setSlide(i)}
          />
        ))}
      </HStack>
    </Flex>
  );
};
