import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Text,
  useFormControlContext,
} from "@chakra-ui/react";
import TableView from "./TableView";
import React, { useEffect, useState } from "react";
import View from "./View";

const Home = () => {
  return (
    <Flex
      h={"100vh"}
      w={"100vw"}
      bg={"gray.50"}
      direction={"column"}
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
     
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Tables</Tab>
          <Tab>Views</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TableView/>
          </TabPanel>
          <TabPanel>
            <View/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    
    </Flex>
      </Flex>
  );
};

export default Home;
