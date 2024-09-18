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
import {createUser} from "../features/createUserSlice";
const Register = () => {
  const dispatch = useDispatch();
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const createUserState = useSelector((state) => state.createUser);
  const [validationResults, setValidationResults] = useState({
    hasUppercase: false,
    isAlphanumeric: false,
    isValidLength: false,
    isValid: false
  });
  const [toast, setToast] = useToastHook();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  function onChange(value) {
    console.log(value);
  }

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const isAlphanumeric = /^[A-Za-z0-9]+$/.test(password);
    const isValidLength = password.length >= 8;
  
    return {
      hasUppercase,
      isAlphanumeric,
      isValidLength,
      isValid: hasUppercase && isAlphanumeric && isValidLength
    };
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    if (!email || !password) {
      return setToast({ message: "All field must be filled", type: "warning" });
    }
    if (!email.match(isValidEmail)) {
      return setToast({ message: "Email is not valid", type: "warning" });
    }

    if (!validationResults.isValid) {
      return setToast({ message: "Password is not valid", type: "warning" });
    }
    dispatch(createUser({ data }));
  };

  const setInitialState = () => {
    setEmail("");
    setPassword("");
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    setValidationResults(validatePassword(value));
  };

  useEffect(() => {
    if (createUserState.status !== "idle" || createUserState.status !== "loading") {
      if (createUserState.status === "error") {
        setToast({ message: "Error occurred", type: "error" });
      } else if (createUserState.status === "loaded") {
        setToast({ message: "Sign Up success", type: "success" });
        dispatch(createUser({ action: "reset" }));
        setInitialState();
        setTimeout(() => navigate("/"), 750);
        // setTimeout(() => , 750);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUserState.status]);


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
            Register
          </Text>
          <Text fontWeight={"regular"} mb={"10"} fontSize={16}>
            Sign Up for Ifabula's Online Library
          </Text>
          <form onSubmit={(e) => handleSignUp(e)}>
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
                onChange={handleChange}
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
                Have an Account? Login here
              </Link>
            </Box>
            {createUserState.status === "loading" ? (
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
                  Sign Up
                </Button>
              </Flex>
            )}
          </form>
          <Box mt={2}>
              <Text color={validationResults.hasUppercase ? 'green.500' : 'red.500'}>
                Must contain at least one uppercase letter
              </Text>
              <Text color={validationResults.isAlphanumeric ? 'green.500' : 'red.500'}>
                Must be alphanumeric (no special characters)
              </Text>
              <Text color={validationResults.isValidLength ? 'green.500' : 'red.500'}>
                Must be at least 8 characters long
              </Text>
            </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Register;
