import { Flex, Text, Box, Alert, Button } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";


function Error() {
  const { code } = useParams();
  const errorMessage = {};
  const navigate = useNavigate();
  const dispatch = useDispatch;
  switch (code) {
    case "400":
      errorMessage.code = code;
      errorMessage.message = "Not Found";
      errorMessage.data = null;
      break;
    case "401":
      errorMessage.code = code;
      errorMessage.message = "Unauthorized";
      errorMessage.data = <Unauthorized />;
      break;
    case "403":
      errorMessage.code = code;
      errorMessage.message = "Forbidden";
      errorMessage.data = <Forbidden />;
      break;
    case "404":
      errorMessage.code = code;
      errorMessage.message = "Not Found";
      errorMessage.data = null;
      break;
    default:
      errorMessage.code = 500;
      errorMessage.message = "Server error";
      errorMessage.data = null;
      break;
  }

  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
      bg={"gray.50"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
    >
      <Flex h={"50px"} alignItems={"center"}>
        <Text fontSize={"2xl"} fontWeight={"semibold"}>
          {errorMessage.code}
        </Text>
        <Box mx={5} h={"full"} w={"1.5px"} bg={"gray.400"} />
        <Text fontSize={"2xl"} fontWeight={"medium"}>
          {errorMessage.message}
        </Text>
      </Flex>
      <Flex>
        {errorMessage.code !== "500" ? errorMessage.data : ""}
        {errorMessage.code === 500 ? (
          <Button
            onClick={() => {
              navigate("/");
              setTimeout(() => window.location.reload(), 750);
            }}
            colorScheme="gray"
            size="md"
          >
            Reload
          </Button>
        ) : (
          <Flex></Flex>
        )}
      </Flex>
    </Flex>
  );
}

const Unauthorized = ({ message }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("object");
    localStorage.removeItem("user-token");
    return setTimeout(() => navigate(`/login`), 750);
  }, []);
  return (
    <Flex flexDir={"column"} alignItems={"center"} m={5}>
      <Alert status="info" mb={3} fontSize={{ base: 14, sm: 16 }}>
        {message
          ? message
          : "You are not unauthorized to access this page or Session, please login."}
      </Alert>
      <Button
        onClick={() => {
          localStorage.removeItem("user-token");

          return setTimeout(() => navigate(`/login`), 750);
        }}
        colorScheme="gray"
        size="md"
      >
        Back to login page
      </Button>
    </Flex>
  );
};

const Forbidden = ({ message }) => {
  const navigate = useNavigate();
  return (
    <Flex flexDir={"column"} alignItems={"center"} m={5}>
      <Alert status="info" mb={3} fontSize={{ base: 14, sm: 16 }}>
        {message ? message : "You do not have permission to access this page."}
      </Alert>
      <Button onClick={() => navigate("/")} colorScheme="gray" size="md">
        Back to home page
      </Button>
    </Flex>
  );
};

export default Error;
