import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  IconButton,
  InputGroup,
  useDisclosure,
  InputRightElement,
  Link,
  Td,
  FormLabel,
  Tr,
  Spinner,
  FormControl,
  Text,
} from "@chakra-ui/react";
import { FiEdit, FiLock, FiUnlock } from "react-icons/fi";

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useToastHook from "../molecules/ToastHook";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/loginSlice";
import { getBook } from "../features/getBookSlice";
import ModalComponent from "../molecules/ModalComponent";
import TablePaginate from "../molecules/TablePaginate";
const Home = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loginState = useSelector((state) => state.login);
  const getBookState = useSelector((state) => state.getBook);
  const [toast, setToast] = useToastHook();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [operation, setOperation] = useState("");
  const [metadata, setMetadata] = useState({});
  const handleClick = () => setShow(!show);
  const getStatus = (dateBorrowed,dueDate) => {
    if(!dateBorrowed){
      return "Available"
    }
    else if (dateBorrowed<=dueDate && new Date()<new Date(dueDate)){
      return "Borrowed"
    }
    else if (new Date()>new Date(dueDate)){
      return "Overdue"
    }
  };
  useEffect(() => {
    dispatch(getBook({}));
  }, [dispatch]);
  const itemListHead = [
    "#",
    "Title",
    "Author",
    "Description",
    "Borrowed Date",
    "Borrowed Due Date",
    "Status",
    "Action"
  ];
  const filteredItem = useMemo(() => {
    if (getBookState.data && getBookState.data.length > 0) {
      return getBookState.data;
    }
    return [];
  }, [getBookState]);
  return (
    <Flex h={"100vh"} w={"100vw"} bg={"gray.50"} justifyContent={"center"} alignItems={"center"}>
    <Flex
      flexDir={"column"}
      px={"15px"}
      py={"10px"}
      w={"100%"}  // Ensure the Flex takes full width
      maxW={"1200px"}  // Optionally, set a max width if you want to limit it
      h={"100%"}  // Ensure the Flex takes full height
      borderRadius={"10px"}
      bg={"white"}
      boxShadow={"lg"}
    >
      <Text fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"} mb={4}>
      Ifabula Online Library
    </Text>
      <TablePaginate
        tableStatus={getBookState.status}
        tableHead={itemListHead}
        tableItem={filteredItem.map((sm, i) => (
          <Tr key={i}>
            <Td textAlign={"center"}>{i + 1}</Td>
            <Td maxW={"100%"}>{`${sm?.title? sm?.title : "-"}`}</Td>
            <Td maxW={"100%"}>{`${sm?.author ? sm?.author: "-"}`}</Td>
            <Td maxW={"100%"}>{`${sm?.description ? sm?.description : "-"}`}</Td>
            <Td maxW={"100%"}>{`${sm?.borrowedDate? new Date(sm?.borrowedDate).toDateString():"-"}`}</Td>
            <Td maxW={"100%"}>{`${sm?.dueDate? new Date(sm?.dueDate).toDateString() : "-"}`} </Td>
            <Td maxW={"100%"}>{getStatus(sm?.borrowedDate,sm?.dueDate)}</Td>
            <Td textAlign={"center"}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignContent="center"
                  alignItems="center"
                >
                  <IconButton
                    onClick={() => {
                      setOperation("update");
                      setMetadata(sm);
                      onOpen();
                    }}
            
                    size={"md"}
                    color={"white"}
                    bgColor={"#ECC94B"}
                    mr={3}
                    icon={<FiEdit />}
                  />
                 
                </Box>
              </Td>
          </Tr>
        ))}
      />
         <ModalComponent
        title={`UPDATE BORROW STATUS`}
        isOpen={isOpen}
        onClose={onClose}
        footer={
          <Flex w={"full"} justifyContent={"flex-end"} gap={3}>
            <Button
              onClick={onClose}
              colorScheme="red"
              
            >
              Cancel
            </Button>
            <Button
              colorScheme="twitter"
    
            >
              {"UPDATE"}
            </Button>
          </Flex>
        }
      >
        <Text
          mb={3}
          textAlign={"center"}
          display={
            ["activate", "inactivate"].includes(operation) ? "block" : "none"
          }
        >
          Are you sure you want to <b>{operation.toUpperCase()}</b> this LOB?
        </Text>
        <Flex flexDir={"column"} gap={2}>
          <FormControl
            display={"flex"}
            alignItems={"center"}
            isRequired={!["activate", "inactivate"].includes(operation)}
            isDisabled={true}
          >
            <FormLabel w={"20vw"}>Title</FormLabel>
            <Input
              w={"full"}
              placeholder="Book Title"
              value={metadata.title ? metadata.title : ""}
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  title: e.target.value?.toUpperCase(),
                });
              }}
            />
          </FormControl>
          <FormControl
            display={"flex"}
            alignItems={"center"}
            isRequired={!["activate", "inactivate"].includes(operation)}
            isDisabled={true}
          >
            <FormLabel w={"20vw"}>Author</FormLabel>
            <Input
              w={"full"}
              placeholder="Book author"
              value={metadata.author ? metadata.author : ""}
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  author: e.target.value?.toUpperCase(),
                });
              }}
            />
          </FormControl>

          <FormControl
            display={"flex"}
            alignItems={"center"}
            isRequired={!["activate", "inactivate"].includes(operation)}
            isDisabled={true}
          >
            <FormLabel w={"20vw"}>Description</FormLabel>
            <Input
              w={"full"}
              placeholder="Book Description"
              value={metadata.description ? metadata.description : ""}
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  description: e.target.value?.toUpperCase(),
                });
              }}
            />
          </FormControl>

          <FormControl
            display={"flex"}
            alignItems={"center"}
            isRequired={!["activate", "inactivate"].includes(operation)}
            isDisabled={true}
          >
            <FormLabel w={"20vw"}>Borrowed Date</FormLabel>
            <Input
              w={"full"}
              placeholder="Book author"
              value={metadata.borrowedDate ? new Date(metadata?.borrowedDate).toDateString() : ""}
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  borrowedDate: e.target.value,
                });
              }}
            />
          </FormControl>
          <FormControl
            display={"flex"}
            alignItems={"center"}
            isRequired={!["activate", "inactivate"].includes(operation)}
            isDisabled={true}
          >
            <FormLabel w={"20vw"}>Borrowed Due Date</FormLabel>
            <Input
              w={"full"}
              placeholder="Book author"
              value={metadata.dueDate ?  new Date(metadata?.dueDate).toDateString(): ""}
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  dueDate: e.target.value?.toUpperCase(),
                });
              }}
            />
          </FormControl>
        </Flex>
      </ModalComponent>
    </Flex>
  </Flex>
  
  );
};

export default Home;
