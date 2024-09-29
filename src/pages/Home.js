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
import TableView from "./TableView";
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
const Home = () => {
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

  const handleFieldChange = (table, fieldToUpdate) => {
    setSelectedFields((prevFields) => ({
      ...prevFields,
      [table]: prevFields[table].map((field) =>
        field.fieldName === fieldToUpdate.fieldName
          ? { ...field, isSelected: !field.isSelected }
          : field
      ),
    }));
  };
  const loginState = useSelector((state) => state.login);
  const getBookState = useSelector((state) => state.getBook);
  const updateBookState = useSelector((state) => state.updateBook);
  const createTableState = useSelector((state) => state.createTable);
  const createViewState = useSelector((state) => state.createView);

  const getTableState = useSelector((state) => state.getTable);
  const getAllCustomersState = useSelector((state) => state.getAllCustomers);
  const [toast, setToast] = useToastHook();
  const [email, setEmail] = useState("");
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [password, setPassword] = useState("");
  const [tableName, setTableName] = useState("");
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [operation, setOperation] = useState("");
  const [metadata, setMetadata] = useState({ fieldName: "", dataType: "" });
  const [bookStatus, setBookStatus] = useState({});
  const [rows, setRows] = useState([
    { fieldName: "", dataType: "", isPrimaryKey: false },
  ]);

  const handleOperation = () => {
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
          Ifabula Database
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

        <TableView />
        <Box maxW="800px" mx="auto" p={6}>
          <Text fontSize="2xl" mb={4}>
            View Creation Interface
          </Text>
          <Stack spacing={4}>
            {/* View Name Input */}
            <Box>
              <FormLabel>View Name:</FormLabel>
              <Input
                placeholder="Enter view name"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
              />
            </Box>

            {/* Select Tables to Join using react-select */}
            <Box>
              <FormLabel>Select Tables to Join:</FormLabel>
              <Select
                menuPortalTarget={document.body}
                isMulti
                isClearable
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                options={
                  selectedTables.length >= 2
                    ? []
                    : getTableState.data && getTableState.data.length > 0
                    ? getTableState.data.map((curr) => ({
                        label: curr.tableName,
                        value: curr.fields,
                      }))
                    : []
                }
                placeholder="Select tables"
                onChange={handleTableChange}
              />
            </Box>

            {/* Field Selection from Tables */}
            <Box>
              <FormLabel>Select Fields from Tables:</FormLabel>
              <Stack direction="row" spacing={6}>
                {selectedTables.length > 0 &&
                  selectedTables.map((table) => (
                    <Box key={table}>
                      <Text fontWeight="bold">{table}</Text>

                      {selectedFields[table]?.length > 0 &&
                        selectedFields[table].map((field) => (
                          <Checkbox
                            key={field.fieldName}
                            isChecked={field.isSelected}
                            onChange={() => handleFieldChange(table, field)}
                          >
                            {field.fieldName}
                          </Checkbox>
                        ))}
                    </Box>
                  ))}
              </Stack>
            </Box>

            {/* Configure Join Condition */}
            {selectedTables.length >= 2 && (
              <>
                <Flex>
                  <Select
                    menuPortalTarget={document.body}
                    isClearable={false}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    options={
                      selectedTables.length > 0 &&
                      selectedFields[selectedTables[0]]
                        ? selectedFields[selectedTables[0]].map((curr) => ({
                            label: curr.fieldName,
                            value: curr.fieldName,
                          }))
                        : []
                    }
                    value={{
                      label: field1?.label,
                      value: field1?.value,
                    }}
                    onChange={(e) => {
                      setField1({ label: e.label, value: e.value });
                    }}
                    placeholder="Data Type"
                  />

                  <Select
                    menuPortalTarget={document.body}
                    isClearable={false}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    options={
                      selectedTables.length > 1 &&
                      selectedFields[selectedTables[1]]
                        ? selectedFields[selectedTables[1]].map((curr) => ({
                            label: curr.fieldName,
                            value: curr.fieldName,
                          }))
                        : []
                    }
                    value={{
                      label: field2?.label,
                      value: field2?.value,
                    }}
                    onChange={(e) => {
                      setField2({ label: e.label, value: e.value });
                    }}
                    placeholder="Data Type"
                  />
                </Flex>
                <Box>
                  <FormLabel>Configure Join Condition:</FormLabel>
                  <Select
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    options={[
                      { label: "INNER JOIN", value: "INNER JOIN" },
                      { label: "LEFT JOIN", value: "LEFT JOIN" },
                      { label: "RIGHT JOIN", value: "RIGHT JOIN" },
                      { label: "FULL JOIN ", value: "FULL JOIN" },
                      { label: "CROSS JOIN", value: "CROSS JOIN" },
                      { label: "SELF JOIN", value: "SELF   JOIN" },
                    ]}
                    onChange={(e) => {
                      setJoinType({ label: e.label, value: e.value });
                    }}
                    placeholder="Data Type"
                  />
                </Box>
              </>
            )}

            <Divider />

            {/* Save View Button */}
            <Button
              colorScheme="teal"
              onClick={() => {
                if (viewName === "") {
                  return setToast({
                    message: `Error: Input View Name`,
                    type: "warning",
                  });
                }

                if (selectedTables?.length === 0) {
                  return setToast({
                    message: `Error: No tables were selected`,
                    type: "warning",
                  });
                }

                if (selectedTables?.length > 1) {
                  if (!field1.value || !field2.value) {
                    return setToast({
                      message: `Error: Input both field names for join selected`,
                      type: "warning",
                    });
                  }
                  if (!joinType.value) {
                    return setToast({
                      message: `Error: Join type not selected`,
                      type: "warning",
                    });
                  }
                }
                const metadata = {
                  viewName: viewName,
                  tableNames: selectedTables,
                  fields: selectedFields,
                  joinType: joinType,
                  field1: field1,
                  field2: field2,
                };
                console.log("metadata", metadata);
                dispatch(createView({ data: metadata }));
              }}
            >
              Create View
            </Button>
          </Stack>
        </Box>

        <ModalComponent
          title={`CREATE TABLE`}
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
    </Flex>
  );
};

export default Home;
