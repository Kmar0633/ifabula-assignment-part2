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
const View = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTables, setSelectedTables] = useState([]);
  const [viewName, setViewName] = useState("");
  const [joinCondition, setJoinCondition] = useState("");
  const [selectedFields, setSelectedFields] = useState({});
  const [field1, setField1] = useState({ label: "", value: "" });
  const [joinType, setJoinType] = useState({ label: "", value: "" });
  const [field2, setField2] = useState({ label: "", value: "" });
  const {
    isOpen: isOpenGenerateApi,
    onOpen: onOpenGenerateApi,
    onClose: onCloseGenerateApi,
  } = useDisclosure();
  const {
    isOpen: isOpenCreateView,
    onOpen: onOpenCreateView,
    onClose: onCloseCreateView,
  } = useDisclosure();
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
      flexDir={"column"}
      px={"15px"}
      py={"10px"}
      w={"100%"}
      maxW={"1200px"}
      h={"100%"}
      bg={"white"}
    >
      <Flex>
        <Button
          colorScheme={"green"}
          onClick={() => {
            setViewName("");
            setTableName("");
            setSelectedTables([])
            setJoinType({ label: "", value: "" })
            setJoinCondition("")
            setSelectedFields({})
            setField1({ label: "", value: "" })
            setField2({ label: "", value: "" })
            onOpenCreateView();
          }}
          ml={3}
        >
          Create New View
        </Button>
      </Flex>

      <ModalComponent
        title={`CREATE VIEW`}
        isOpen={isOpenCreateView}
        size={"4xl"}
        onClose={onCloseCreateView}
        footer={
          <Flex w={"full"} justifyContent={"flex-end"} gap={3}>
            <Button onClick={onCloseCreateView} colorScheme="red">
              Cancel
            </Button>
            <Button onClick={handleOperation} colorScheme="twitter">
              {"CREATE VIEW"}
            </Button>
          </Flex>
        }
      >
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
              <Flex w={"full"} justifyContent={"center"} gap={6}>
                <Flex w={"full"} direction={"column"}>
                  <Text fontWeight="bold">Select Field to Join</Text>

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
                    chakraStyles={{
                      container: (provided, state) => ({
                        ...provided,
                        w: "full",
                      }),
                    }}
                    placeholder="Data Type"
                  />
                </Flex>

                <Flex w={"full"} direction={"column"}>
                  <Text fontWeight="bold">Select Field to Join</Text>
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
                  chakraStyles={{
                    container: (provided, state) => ({
                      ...provided,
                      w: "full",
                    }),
                    valueContainer: (provided, state) => ({
                      ...provided,
                    }),
                  }}
                  onChange={(e) => {
                    setField2({ label: e.label, value: e.value });
                  }}
                  placeholder="Data Type"
                />
              </Flex>
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
        </Stack>
      </ModalComponent>
    </Flex>
  );
};

export default View;
