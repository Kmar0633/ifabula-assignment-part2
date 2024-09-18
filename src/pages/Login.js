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
import { useNavigate } from "react-router-dom";
import useToastHook from "../molecules/ToastHook";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/loginSlice";
const Login = () => {
  const dispatch = useDispatch();

  const loginState = useSelector((state) => state.login);
  const [toast, setToast] = useToastHook();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  function onChange(value) {
    console.log(value);
  }
  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    if (!email || !password) {
      return setToast({ message: "All field must be filled", type: "warning" });
    }

    dispatch(login({ data }));
  };

  const setInitialState = () => {
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    if (loginState.status !== "idle" || loginState.status !== "loading") {
      if (loginState.status === "error") {
        setToast({ message: `Error occurred ${loginState?.message}`, type: "error" });
      } else if (loginState.status === "loaded") {
        setToast({ message: "Login success", type: "success" });
        /*     localStorage.setItem(
          "user-token",
          JSON.stringify(loginState.data.data)
        ); */
        console.log("success", loginState.data);
        dispatch(login({ action: "reset" }));
        navigate(`/Home`);
        // setTimeout(() => , 750);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState.status]);

  useEffect(() => {
    /*   const isAuthenticated = JSON.parse(localStorage.getItem("user-token"));
    if (isAuthenticated) {
      navigate("/");
    } */
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
          <Text fontWeight={"bold"} mb={"5"} fontSize={30}>
            Log In
          </Text>
          <Text fontWeight={"regular"} mb={"10"} fontSize={16}>
            Sign in to Ifabula's Online Library
          </Text>
          <form onSubmit={(e) => handleLogin(e)}>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              size={"lg"}
              mb={5}
              placeholder="Enter email"
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
              <Link href={"#/signup"}>
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
