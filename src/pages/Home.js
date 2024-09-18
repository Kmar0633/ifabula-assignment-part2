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
  Switch,
  Tr,
  Spinner,
  FormControl,
  Text,
} from "@chakra-ui/react";
import { FiEdit, FiLock, FiUnlock } from "react-icons/fi";
import { Select, chakraComponents } from "chakra-react-select";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useToastHook from "../molecules/ToastHook";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/loginSlice";
import { getBook } from "../features/getBookSlice";
import { getAllCustomers } from "../features/getAllCustomersSlice";
import { updateBook } from "../features/updateBookSlice";
import ModalComponent from "../molecules/ModalComponent";
import TablePaginate from "../molecules/TablePaginate";
const Home = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loginState = useSelector((state) => state.login);
  const getBookState = useSelector((state) => state.getBook);
  const updateBookState = useSelector((state) => state.updateBook);
  const getAllCustomersState = useSelector((state) => state.getAllCustomers);
  const [toast, setToast] = useToastHook();
  const [email, setEmail] = useState("");
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [operation, setOperation] = useState("");
  const [metadata, setMetadata] = useState({});
  const [bookStatus, setBookStatus] = useState({});
  const dateToDateInputFormat = (string) => {
    const date = new Date(string);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };
  const handleOperation = () => {
    if (
      (!metadata.dueDate || !metadata.borrowedDate || !metadata.user) &&
      isBorrowed === true
    ) {
      return setToast({
        message:
          "Book due date, borrowed date and user date must be filled if the user borrows a book",
        type: "warning",
      });
    }
    console.log(metadata);
    const modifiedMetadata = {
      ...metadata,
      isBorrowed: isBorrowed,
    };

    dispatch(updateBook({ id: modifiedMetadata.id, data: modifiedMetadata }));
  };

  const handleSwitchChange = () => {
    const newBorrowedState = !isBorrowed;
    setIsBorrowed(newBorrowedState);

    if (!newBorrowedState) {
      // Reset dueDate and user when the switch is turned off (book is not borrowed)
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        borrowedDate: "",
        dueDate: "",
        user: "",
      }));
    }
  };

  const getStatus = (dateBorrowed, dueDate) => {
    if (!dateBorrowed) {
      return "Available";
    } else if (dateBorrowed <= dueDate && new Date() < new Date(dueDate)) {
      return "Borrowed";
    } else if (new Date() > new Date(dueDate)) {
      return "Overdue";
    }
  };
  useEffect(() => {
    dispatch(getBook({}));
    dispatch(getAllCustomers({}));
  }, [dispatch]);

  useEffect(() => {
    // Added check for addDoctorState
    if (
      updateBookState?.status !== "idle" ||
      updateBookState?.status !== "loading"
    ) {
      if (updateBookState?.status === "error") {
        setToast({
          message: `Error occurred, ${updateBookState?.data?.message}`,
          type: "error",
        });
        dispatch(updateBook({ action: "reset" }));
      } else if (updateBookState?.status === "loaded") {
        setToast({
          message: `Book Status Successfully Updated`,
          type: "success",
        });
        dispatch(updateBook({ action: "reset" }));
        setTimeout(() => dispatch(getBook({})), 750);
        onClose();
      }
    }
  }, [dispatch, updateBookState, setToast]);
  const itemListHead = [
    "#",
    "Title",
    "Author",
    "Description",
    "Borrowed Date",
    "Borrowed Due Date",
    "Status",
    "Action",
  ];
  const filteredItem = useMemo(() => {
    console.log(bookStatus)
    if (getBookState.data && getBookState.data.length > 0) {
      return getBookState.data.filter(book => {
        // Ensure dateBorrowed and dueDate are valid
        if (book.dateBorrowed && book.dueDate) {
          const status = getStatus(book.dateBorrowed, book.dueDate);
          // Filter based on desiredStatus if it's not null
          return bookStatus.value ? status === bookStatus.value : true;
        }
        // If dateBorrowed or dueDate is null, consider the book in the results
        return true;
      });
    }
    return [];
  }, [getBookState.data, bookStatus.value]);
  

  return (
    <Flex
      h={"100vh"}
      w={"100vw"}
      bg={"gray.50"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Flex
        flexDir={"column"}
        px={"15px"}
        py={"10px"}
        w={"100%"} // Ensure the Flex takes full width
        maxW={"1200px"} // Optionally, set a max width if you want to limit it
        h={"100%"} // Ensure the Flex takes full height
        borderRadius={"10px"}
        bg={"white"}
        boxShadow={"lg"}
      >
        <Text fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"} mb={4}>
          Ifabula Online Library
        </Text>
        <Flex mb={"10px"} w={"100%"}>
          <Select
            menuPortalTarget={document.body}
            isClearable={true}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            options={[
              {
                label: "Available",
                value: "Available",
                // The option color scheme overrides the global
              },
              {
                label: "Overdue",
                value: "Overdue",
              },
              {
                label: "Borrowed",
                value: "Borrowed",
              },
            ]}
            placeholder="Book Status"
            onChange={(e) => {
              setBookStatus({ id: e?.value, name: e?.label });
            }}
          />
        </Flex>
        <TablePaginate
          tableStatus={getBookState.status}
          tableHead={itemListHead}
          tableItem={filteredItem.map((sm, i) => (
            <Tr key={i}>
              <Td textAlign={"center"}>{i + 1}</Td>
              <Td maxW={"100%"}>{`${sm?.title ? sm?.title : "-"}`}</Td>
              <Td maxW={"100%"}>{`${sm?.author ? sm?.author : "-"}`}</Td>
              <Td maxW={"100%"}>{`${
                sm?.description ? sm?.description : "-"
              }`}</Td>
              <Td maxW={"100%"}>{`${
                sm?.borrowedDate
                  ? new Date(sm?.borrowedDate).toDateString()
                  : "-"
              }`}</Td>
              <Td maxW={"100%"}>
                {`${sm?.dueDate ? new Date(sm?.dueDate).toDateString() : "-"}`}{" "}
              </Td>
              <Td maxW={"100%"}>{getStatus(sm?.borrowedDate, sm?.dueDate)}</Td>
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
                      console.log("rec");
                      setMetadata({
                        ...sm,
                        id: sm.id,
                        title: sm.title,
                        author: sm.author,
                        description: sm.description,
                        borrowedDate: sm.borrowedDate
                          ? dateToDateInputFormat(sm.borrowedDate)
                          : "",
                        dueDate: sm.dueDate
                          ? dateToDateInputFormat(sm.dueDate)
                          : "",
                        user: {
                          id: sm?.MasterUser[0]?.id,
                          email: sm?.MasterUser[0]?.email,
                        },
                      });
                      if (
                        sm.borrowedDate &&
                        sm.dueDate &&
                        sm.MasterUser.length > 0
                      ) {
                        setIsBorrowed(true);
                      }
                      console.log("metadata", metadata);
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
              <Button onClick={onClose} colorScheme="red">
                Cancel
              </Button>
              <Button onClick={handleOperation} colorScheme="twitter">
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
            Are you sure you want to Update
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
              isDisabled={false}
            >
              <FormLabel w={"20vw"}>Is Book Borrowed</FormLabel>
              <Switch
                w={"full"}
                isChecked={isBorrowed}
                onChange={handleSwitchChange}
                size={"lg"}
                colorScheme="red"
              />
            </FormControl>
            <FormControl
              display={"flex"}
              alignItems={"center"}
              isRequired={!["activate", "inactivate"].includes(operation)}
              isDisabled={!isBorrowed}
            >
              <FormLabel w={"20vw"}>Borrowed Date</FormLabel>
              <Input
                w={"full"}
                placeholder="Borrowed Date"
                type="date"
                value={metadata.borrowedDate ? metadata?.borrowedDate : ""}
                onChange={(e) => {
                  if (e.target.value > metadata.dueDate && metadata.dueDate) {
                    console.log("test", e.target.value);
                    console.log("test12", metadata.dueDate);
                    setToast({
                      message: "Borrowed Date cannot be after due date",
                      type: "warning",
                    });
                  } else {
                    setMetadata({
                      ...metadata,
                      borrowedDate: e.target.value,
                    });
                  }
                }}
              />
            </FormControl>
            <FormControl
              display={"flex"}
              alignItems={"center"}
              isRequired={!["activate", "inactivate"].includes(operation)}
              isDisabled={!isBorrowed}
            >
              <FormLabel w={"20vw"}>Borrowed Due Date</FormLabel>
              <Input
                w={"full"}
                type="date"
                placeholder="Borrowed Due Date"
                value={metadata.dueDate ? metadata?.dueDate : ""}
                onChange={(e) => {
                  if (
                    new Date(e.target.value) <
                      new Date(metadata.borrowedDate) &&
                    metadata.borrowedDate
                  ) {
                    setToast({
                      message: "Due date cannot be before borrowed date",
                      type: "warning",
                    });
                  } else {
                    setMetadata({
                      ...metadata,
                      dueDate: e.target.value,
                    });
                  }
                }}
              />
            </FormControl>
            <FormControl
              display={"flex"}
              alignItems={"center"}
              isRequired={!["activate", "inactivate"].includes(operation)}
              isDisabled={!isBorrowed}
            >
              <FormLabel w={"20vw"}>Customer</FormLabel>
              <Select
                w={"full"}
                type="date"
                chakraStyles={{
                  container: (provided, state) => ({
                    ...provided,
                    w: "full",
                  }),
                }}
                options={
                  getAllCustomersState.data &&
                  getAllCustomersState.data.length > 0
                    ? getAllCustomersState.data.map((item) => {
                        return {
                          value: item.id,
                          label: item.email,
                        };
                      })
                    : []
                }
                placeholder="Borrower Email"
                value={
                  metadata && metadata.user
                    ? {
                        value: metadata.user.id,
                        label: metadata.user.email,
                      }
                    : null
                }
                onChange={(e) => {
                  setMetadata({
                    ...metadata,
                    user: { id: e.value, email: e.label },
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
