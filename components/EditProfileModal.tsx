import React from "react";
import { Modal } from "react-native";
import { EditProfileForm } from "./auth";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onProfileUpdated,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <EditProfileForm onClose={onClose} onProfileUpdated={onProfileUpdated} />
    </Modal>
  );
};
