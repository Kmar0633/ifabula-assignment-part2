import {
    Box,
    Button,
    Checkbox,
    Flex,
    Image,
    InputGroup,
    useDisclosure,
    InputRightElement,
    Link,
    Td,
    FormLabel,
    Switch,
    Tr,
    Table,
    Stack,
    Divider,
    Thead,
    Tbody,
    Th,
    TableContainer,
    IconButton,
    Input,
    Spinner,
    FormControl,
    Text,
  } from "@chakra-ui/react";
  import { FiPlus, FiDelete, FiTrash } from "react-icons/fi";
  import { Select, chakraComponents } from "chakra-react-select";
  
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import useToastHook from "../molecules/ToastHook";
  import { useDispatch, useSelector } from "react-redux";
  import { login } from "../features/loginSlice";
  import { getBook } from "../features/getBookSlice";
  import { getAllCustomers } from "../features/getAllCustomersSlice";
  import { updateBook } from "../features/updateBookSlice";
  import ModalComponent from "../molecules/ModalComponent";
  import TablePaginate from "../molecules/TablePaginate";
  
  import { createTable } from "../features/createTableSlice";
  import { getTable } from "../features/getTableSlice";
  import { createView } from "../features/createViewSlice";
  import { createTableApi } from "../features/createTableApiSlice";
  const TableView = () => {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedTables, setSelectedTables] = useState([]);
    const [viewName, setViewName] = useState("");
    const [joinCondition, setJoinCondition] = useState("");
    const [selectedFields, setSelectedFields] = useState({});
    const [field1, setField1] = useState({ label: "", value: "" });
    const [joinType, setJoinType] = useState({ label: "", value: "" });
    const [field2, setField2] = useState({ label: "", value: "" });
  
    const tables = [
      { label: "books", value: "books" },
      { label: "authors", value: "authors" },
      { label: "other_table", value: "other_table" },
    ];
  
    const fields = {
      books: ["title", "date_created", "author"],
      authors: ["name", "country", "id"],
      other_table: ["field1", "field2"],
    };
    const handleTableChange = (selectedOption) => {
      if (selectedOption.length > 2) {
        return setToast({
          message: `Error: Only a max of 2 tables can a view be created`,
          type: "warning",
        });
      }
      const selectedTableValues = selectedOption.map((option) => option.label);
      setSelectedTables(selectedTableValues);
      const selectedFieldValues = selectedOption.reduce((acc, option) => {
        if (option?.value) {
          const fields = option.value.map((field) => ({
            tableName: option?.label,
            fieldName: field,
            isSelected: true,
          }));
          return acc.concat(fields);
        }
        return acc;
      }, []);
  
      const fields = selectedFieldValues.reduce(
        (acc, { tableName, fieldName, isSelected }) => {
          if (!acc[tableName]) {
            acc[tableName] = [];
          }
  
          // Here, for example, you only want to keep `fieldName` as a full object when the name is 'title'
  
          acc[tableName].push({ fieldName, isSelected });
  
          return acc;
        },
        {}
      );
  
      setSelectedFields(fields);
    };
  
    const handleFieldChange = (name) => {
      setMetadata(prevMetadata => ({
        ...prevMetadata, // Spread the current metadata
        fields: prevMetadata.fields.map(field => 
          field.name === name
            ? { ...field, isSelected: !field.isSelected } // Toggle isSelected
            : field
        )
      }));
    };
    const loginState = useSelector((state) => state.login);
    const getBookState = useSelector((state) => state.getBook);
    const updateBookState = useSelector((state) => state.updateBook);
    const createTableState = useSelector((state) => state.createTable);
    const createViewState = useSelector((state) => state.createView);
  
    const getTableState = useSelector((state) => state.getTable);
    const getAllCustomersState = useSelector((state) => state.getAllCustomers);
    const createTableApiState = useSelector((state) => state.createTableApi);
    const [toast, setToast] = useToastHook();
    const [email, setEmail] = useState("");
    const [isBorrowed, setIsBorrowed] = useState(false);
    const [password, setPassword] = useState("");
    const [tableName, setTableName] = useState("");
    const [logged, setLogged] = useState(false);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [operation, setOperation] = useState("");
    const [metadata, setMetadata] = useState({ id: "", tableName: "" ,fields:[]});
    const [bookStatus, setBookStatus] = useState({});
    const [rows, setRows] = useState([
      { fieldName: "", dataType: "", isPrimaryKey: false },
    ]);
    const itemListHead = [
      "#",
      "Table Name",
      "Fields",
      "Is Api Generated",
      "Action",
    ];
    const handleOperation = () => {
   
      dispatch(createTableApi({ data: metadata }));
    };
  
    const addRow = () => {
      setRows([...rows, { fieldName: "", dataType: "", isPrimaryKey: false }]);
    };
  
    const deleteRow = (index: number) => {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
    };
  
    const handleInputChange = (index: number, key: string, value: string) => {
      const updatedRows = rows.map((row, i) =>
        i === index ? { ...row, [key]: value } : row
      );
      setRows(updatedRows);
    };
  
    const handleSwitchChange = (index: number) => {
      const updatedRows = rows.map((row, i) =>
        i === index ? { ...row, isPrimaryKey: !row.isPrimaryKey } : row
      );
      setRows(updatedRows);
    };
  
    useEffect(() => {
      dispatch(getBook({}));
      dispatch(getAllCustomers({}));
      dispatch(getTable({}));
    }, [dispatch]);
  
    useEffect(() => {
      if (selectedTables.length < 2) {
        setField1({ label: "", value: "" });
        setField2({ label: "", value: "" });
      }
    }, [selectedTables]);
  
    useEffect(() => {
      if (createTableState?.status === "error") {
        setToast({
          message: `Error occurred, ${createTableState?.message}`,
          type: "error",
        });
        dispatch(createTable({ action: "reset" }));
      } else if (createTableState?.status === "loaded") {
        setToast({
          message: `Table Successfully created`,
          type: "success",
        });
        dispatch(createTable({ action: "reset" }));
        setTimeout(() => window.location.reload(), 750);
        onClose();
      }
    }, [dispatch, createTableState, setToast]);

    useEffect(() => {
      if (createTableApiState?.status === "error") {
        setToast({
          message: `Error occurred, ${createTableApiState?.message}`,
          type: "error",
        });
        dispatch(createTableApi({ action: "reset" }));
      } else if (createTableApiState?.status === "loaded") {
        setToast({
          message: `Table Successfully created`,
          type: "success",
        });
        dispatch(createTableApi({ action: "reset" }));
        setTimeout(() => window.location.reload(), 750);
        onClose();
      }
    }, [dispatch, createTableApiState, setToast]);
  
    useEffect(() => {
      if (createViewState?.status === "error") {
        setToast({
          message: `Error occurred, ${createViewState?.message}`,
          type: "error",
        });
        dispatch(createView({ action: "reset" }));
      } else if (createViewState?.status === "loaded") {
        setToast({
          message: `View Successfully created`,
          type: "success",
        });
        dispatch(createView({ action: "reset" }));
        setTimeout(() => window.location.reload(), 750);
        onClose();
      }
    }, [dispatch, createViewState, setToast]);
  
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
          w={"100%"}
          maxW={"1200px"}
          h={"100%"}
          borderRadius={"10px"}
          bg={"white"}
          boxShadow={"lg"}
        >
          <Text fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"} mb={4}>
            Ifabula Database1
          </Text>
          <Flex mb={"10px"} w={"100%"}>
            <Button
              colorScheme={"green"}
              onClick={() => {
                setRows([{ fieldName: "", dataType: "", isPrimaryKey: false }]);
                setTableName("");
                onOpen();
              }}
              ml={3}
            >
              Create New Table
            </Button>
          </Flex>
  
          <Box maxW="800px" mx="auto" p={6}>
            <Text fontSize="2xl" mb={4}>
              View Creation Interface
            </Text>

            <TablePaginate
          tableStatus={getTableState.status}
          tableHead={itemListHead}
          tableItem={getTableState.data && getTableState.data.map((sm, i) => (
            <Tr key={i}>
              <Td textAlign={"center"}>{i + 1}</Td>
              <Td maxW={"100%"}>{`${sm?.tableName ? sm?.tableName : "-"}`}</Td>
              <Td maxW={"100%"}>{`${sm?.fields ? sm?.fields : "-"}`}</Td>

              <Td maxW={"100%"}>{`${
                sm?.isApiGenerated
              }`}</Td>

              <Td textAlign={"center"}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignContent="center"
                  alignItems="center"
                >
                  <Button
                    onClick={() => {
                      setOperation("update");
                      console.log("rec");
                      console.log("tesstt",sm)
                      const output = sm.fields.map(item => ({
                        name: item,
                        isSelected: true
                      }));
                      setMetadata({
                        id: sm.id,
                        tableName: sm.tableName,
                        fields: output,
                      });
                    
                      console.log("metadata", metadata);
                      onOpen();
                    }}
                    size={"md"}
                    color={"white"}
                    bgColor={"#ECC94B"}
                    mr={3}
      
                  >
                    Generate API
                  </Button>
                </Box>
              </Td>
            </Tr>
          ))}
        />
           
          </Box>
  
          <ModalComponent
            title={`CREATE INSERT VALUES API`}
            isOpen={isOpen}
            size={"4xl"}
            onClose={onClose}
            footer={
              <Flex w={"full"} justifyContent={"flex-end"} gap={3}>
                <Button onClick={onClose} colorScheme="red">
                  Cancel
                </Button>
                <Button onClick={handleOperation} colorScheme="twitter">
                  {"CREATE TABLE"}
                </Button>
              </Flex>
            }
          >
            <Flex marginBottom={"10px"} justifyContent={"flex-start"}>
              {console.log("metadata",metadata)}
              <Text>{metadata.tableName}</Text>
              <Stack direction="column" spacing={1}>
              {metadata.fields.length > 0 &&
                        metadata.fields.map((field) => (
                          <Checkbox
                            key={field.name}
                            isChecked={field.isSelected}
                            onChange={() => handleFieldChange(field.name)}
                          >
                            {field.name}
                          </Checkbox>
                        ))}
                        </Stack>
            </Flex>
  
         
          </ModalComponent>
        </Flex>
      </Flex>
    );
  };
  
  export default TableView;
  