import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();

  const loginState = useSelector((state) => state.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  function onChange(value) {
    console.log(value);
  }
  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      username,
      password,
    };
  };

  const setInitialState = () => {
    setUsername("");
    setPassword("");
  };

  useEffect(() => {
    if (loginState.status !== "idle" || loginState.status !== "loading") {
      if (loginState.status === "error") {
        // setTimeout(() => , 750);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState.status]);

  useEffect(() => {
    const isAuthenticated = JSON.parse(localStorage.getItem("user-token"));
    if (isAuthenticated) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Flex h={"100vh"} w={"100vw"} bg={"gray.50"}>
      {console.log("trs")}

      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        w={{ base: "100%", md: "100%" }}
      >
        <Flex
          alignItems={"center"}
          flexDir={"column"}
          maxW={"380px"}
          px={"15px"}
          py={"10px"}
          mx={5}
          borderRadius={"10px"}
          bg={"white"}
          boxShadow={"lg"}
        >
          <Text fontWeight={"medium"} mb={"10"} fontSize={20}>
            Ifabula Libray
          </Text>
          <form onSubmit={(e) => handleLogin(e)}>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              size={"lg"}
              mb={5}
              placeholder="Enter username"
            />
            <InputGroup size="lg" mb={1}>
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Box mb={5}>
              <Link
                color={"gray.500"}
              >
                Don't have an Account? Register here
              </Link>
            </Box>
            {loginState.status === "loading" ? (
              <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
                <Spinner size={"xl"} color="green.500" />
              </Flex>
            ) : (
              <Flex flexDir={"column"}>
                <Button
                  type="submit"
                  w={"full"}
                  backgroundColor={"primary.400"}
                  textColor={"white"}
                  _hover={{ background: "primary.300", color: "white" }}
                >
                  Login
                </Button>
              </Flex>
            )}
          </form>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;
