import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";

export default function ModalComponent({
  title,
  children,
  footer,
  isOpen,
  onClose,
  size = "2xl",
}) {
  return (
    <Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontSize={24}
            fontWeight={"bold"}
          >
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          {footer ? <ModalFooter>{footer}</ModalFooter> : <></>}
        </ModalContent>
      </Modal>
    </Box>
  );
}
