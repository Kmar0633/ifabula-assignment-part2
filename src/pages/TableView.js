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
  const {
    isOpen: isOpenGenerateApi,
    onOpen: onOpenGenerateApi,
    onClose: onCloseGenerateApi,
  } = useDisclosure();
  const {
    isOpen: isOpenCreateTable,
    onOpen: onOpenCreateTable,
    onClose: onCloseCreateTable,
  } = useDisclosure();

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
    setMetadata((prevMetadata) => ({
      ...prevMetadata, // Spread the current metadata
      fields: prevMetadata.fields.map((field) =>
        field.name === name
          ? { ...field, isSelected: !field.isSelected } // Toggle isSelected
          : field
      ),
    }));
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
  const [metadata, setMetadata] = useState({
    id: "",
    tableName: "",
    fields: [],
  });
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
  const handleOperation1 = () => {
    if (tableName === "") {
      return setToast({
        message: `Error: Input a table name`,
        type: "warning",
      });
    }
    if (rows.length < 1) {
      return setToast({
        message: `Error: Input at least one row`,
        type: "warning",
      });
    }
    for (let i = 0; i < rows.length; i++) {
      const { fieldName, dataType, isPrimaryKey } = rows[i];

      if (fieldName === "") {
        return setToast({
          message: `Error: Input all field names`,
          type: "warning",
        });
      }

      if (!dataType || !dataType.id) {
        return setToast({
          message: `Error: Input all data types`,
          type: "warning",
        });
      }

      // Check if isPrimaryKey is true for more than one row
      if (isPrimaryKey && rows.filter((row) => row.isPrimaryKey).length > 1) {
        return setToast({
          message: `Error: Only one primary key is allowed`,
          type: "warning",
        });
      }
    }
    const metadata = { tableName: tableName, data: rows };
    dispatch(createTable({ data: metadata }));
  };
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

  useEffect(() => {

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
    }
  }, [dispatch, createTableApiState, setToast]);


  return (
    
      <Flex
        flexDir={"column"}
        px={"15px"}
        py={"10px"}
        w={"100%"}
        maxW={"1200px"}
        h={"100%"}
        bg={"white"}

      >
        <Flex justifyContent="flex-end"mb={"10px"} w={"100%"}>
          <Button
            colorScheme={"green"}
            onClick={() => {
              setRows([{ fieldName: "", dataType: "", isPrimaryKey: false }]);
              setTableName("");
              onOpenCreateTable();
            }}
            ml={3}
          >
            Create New Table
          </Button>
        </Flex>

          <Text fontSize="2xl" mb={4}>
            Table Creation Interface
          </Text>

          <TablePaginate
            tableStatus={getTableState.status}
            tableHead={itemListHead}
            tableItem={
              getTableState.data &&
              getTableState.data.map((sm, i) => (
                <Tr key={i}>
                  <Td textAlign={"center"}>{i + 1}</Td>
                  <Td maxW={"100%"}>{`${
                    sm?.tableName ? sm?.tableName : "-"
                  }`}</Td>
                  <Td maxW={"100%"}>{`${sm?.fields ? sm?.fields : "-"}`}</Td>

                  <Td maxW={"100%"}>{`${sm?.isApiGenerated}`}</Td>

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
                          console.log("tesstt", sm);
                          const output = sm.fields.map((item) => ({
                            name: item,
                            isSelected: true,
                          }));
                          setMetadata({
                            id: sm.id,
                            tableName: sm.tableName,
                            fields: output,
                          });

                          console.log("metadata", metadata);
                          onOpenGenerateApi();
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
              ))
            }
          />
      

        <ModalComponent
          title={`CREATE INSERT VALUES API`}
          isOpen={isOpenGenerateApi}
          size={"4xl"}
          onClose={onCloseGenerateApi}
          footer={
            <Flex w={"full"} justifyContent={"flex-end"} gap={3}>
              <Button onClick={onCloseGenerateApi} colorScheme="red">
                Cancel
              </Button>
              <Button onClick={handleOperation} colorScheme="twitter">
                {"CREATE TABLE"}
              </Button>
            </Flex>
          }
        >
          <Flex marginBottom={"10px"} justifyContent={"flex-start"}>
            {console.log("metadata", metadata)}
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

        <ModalComponent
          title={`CREATE TABLE`}
          isOpen={isOpenCreateTable}
          size={"4xl"}
          onClose={onCloseCreateTable}
          footer={
            <Flex w={"full"} justifyContent={"flex-end"} gap={3}>
              <Button onClick={onCloseCreateTable} colorScheme="red">
                Cancel
              </Button>
              <Button onClick={handleOperation1} colorScheme="twitter">
                {"CREATE TABLE"}
              </Button>
            </Flex>
          }
        >
          <Flex marginBottom={"10px"} justifyContent={"flex-end"}>
            <Button colorScheme={"blue"} onClick={addRow} ml={3}>
              Add Row
            </Button>
          </Flex>
          <Flex marginBottom={"10px"} justifyContent={"flex-start"}>
            <Input
              width={"250px"}
              value={tableName}
              placeholder="Enter Table Name"
              onChange={(e) => setTableName(e.target.value)}
            />
          </Flex>

          <Flex>
            <TableContainer
              maxHeight={"500px"}
              width="full"
              overflowY={"auto"}
              position={"relative"}
            >
              <Table variant="simple">
                <Thead position="sticky" top={0} bg="gray.100" zIndex={1}>
                  <Tr>
                    <Th>Field Name</Th>
                    <Th>Data Type</Th>
                    <Th>Primary Key?</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rows.map((row, index) => (
                    <Tr key={index}>
                      <Td>
                        <Input
                          value={row.fieldName}
                          placeholder="Field Name"
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "fieldName",
                              e.target.value
                            )
                          }
                        />
                      </Td>
                      <Td>
                        <Select
                          menuPortalTarget={document.body}
                          isClearable={true}
                          
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          options={[
                            { label: "INTEGER", value: "INTEGER" },
                            { label: "TEXT", value: "TEXT" },
                            { label: "DATE", value: "DATE" },
                            { label: "TIMESTAMP ", value: "TIMESTAMP " },
                            { label: "FLOAT", value: "FLOAT" },
                          ]}
                          placeholder="Data Type"
                          onChange={(e) => {
                            handleInputChange(index, "dataType", {
                              id: e?.value,
                              label: e?.label,
                            });
                          }}
                        />
                      </Td>
                      <Td>
                        <Switch
                          isChecked={row.isPrimaryKey}
                          onChange={() => handleSwitchChange(index)}
                        />
                      </Td>
                      <Td>
                        <IconButton
                          colorScheme={"red"}
                          aria-label="Delete Row"
                          icon={<FiTrash />}
                          onClick={() => deleteRow(index)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
        </ModalComponent>
      </Flex>

  );
};

export default TableView;
