import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance from '../component/axiosInstance'; // Ensure this path is correct

export default function AddNewCategoryScreen({ visible, onClose, fetchCategories }) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDetails, setCategoryDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!categoryName.trim() || !categoryDetails.trim()) {
      Alert.alert("Error", "Please fill in both category name and details.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/create_category/', {
        name: categoryName.trim(),
        details: categoryDetails.trim(),
      });

      // Assuming the API returns the created category data
      if (response.status === 201 || response.data.success) {
        const newCategory = {
          name: categoryName,
          details: categoryDetails,
        };
      
        setCategoryName('');
        setCategoryDetails('');
        fetchCategories()
        onClose();
        Alert.alert("Success", "Category created successfully!");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      if (error.response) {
        Alert.alert("Error", error.response.data.message || "Failed to create category.");
      } else if (error.request) {
        Alert.alert("Error", "Network error. Please check your connection.");
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCategoryName('');
    setCategoryDetails('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header with Checkmark and Close Button */}
          <View style={styles.header}>
            <Icon name="check-circle" size={40} color="#00FF00" />
            <TouchableOpacity onPress={onClose} disabled={isLoading}>
              <Icon name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Title and Description */}
          <Text style={styles.title}>Add New Category</Text>
          <Text style={styles.description}>
            Your wardrobe is getting more collection, keep adding, who does not like more clothes!
          </Text>

          {/* Name of Category Input */}
          <Text style={styles.inputLabel}>Name of Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter category name"
            placeholderTextColor="#888"
            value={categoryName}
            onChangeText={setCategoryName}
            editable={!isLoading}
          />

          {/* Category Details Input */}
          <Text style={styles.inputLabel}>Give us some details of this category *</Text>
          <TextInput
            style={[styles.input, styles.detailsInput]}
            placeholder="Enter details"
            placeholderTextColor="#888"
            value={categoryDetails}
            onChangeText={setCategoryDetails}
            multiline
            editable={!isLoading}
          />

          {/* Confirm and Cancel Buttons */}
          <TouchableOpacity
            style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Creating..." : "Confirm"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#2A2A3C', // Dark background for the modal
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#3A3A4C',
    borderRadius: 10,
    padding: 10,
    color: '#FFF',
    marginBottom: 20,
  },
  detailsInput: {
    height: 100,
    textAlignVertical: 'top', // For multiline input
  },
  confirmButton: {
    backgroundColor: '#FF5555', // Red button color
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  cancelButton: {
    backgroundColor: '#FFF', // White button color
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});