import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Image, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance from '../component/axiosInstance'; // Ensure this path is correct


export default function AddNewOutfitModal({ visible, onClose, fetchCateories, preloadedImage, category_id }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim() || !size.trim() || !description.trim() || !preloadedImage || !category_id) {
      Alert.alert('Error', 'Please fill in all required fields and ensure a category is selected.');
      return;
    }

    setIsLoading(true);

    // Create FormData object
    const formData = new FormData();
    formData.append('category_id', category_id);
    formData.append('name', name.trim());
    formData.append('size', size.trim());
    formData.append('details', description.trim()); // Match API key 'details'
    
    // Append the image file
    const imageFile = {
      uri: preloadedImage,
      type: 'image/jpeg', // Adjust type based on your image format
      name: `Outfit_${Date.now()}.jpg`, // Unique filename
    };
    formData.append('picture', imageFile);

    try {
      const response = await axiosInstance.post('/add_new_dress/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
       
       
        setName('');
        setSize('');
        setDescription('');
        onClose();
        fetchCateories()
        Alert.alert('Success', 'Outfit added successfully!');
      }
    } catch (error) {
      console.error('Error adding Outfit:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to add Outfit.');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setSize('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
        <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              >

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header with Checkmark and Close Button */}
            <View style={styles.header}>
              <Icon name="check-circle" size={40} color="#00FF00" />
              <TouchableOpacity onPress={onClose} disabled={isLoading}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Title and Description */}
            <Text style={styles.title}>Add New outfit to your wardrobe</Text>
            <Text style={styles.description}>
              Your wardrobe is getting more collection, keep adding, who does not like more clothes!
            </Text>

            {/* Display Captured Image */}
            {preloadedImage && (
              <Image source={{ uri: preloadedImage }} style={styles.previewImage} resizeMode="cover" />
            )}

            {/* Name of Outfit Input */}
            <Text style={styles.inputLabel}>Type of Outfit *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Outfit name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />

            {/* Size Input */}
            <Text style={styles.inputLabel}>Size *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter size"
              placeholderTextColor="#888"
              value={size}
              onChangeText={setSize}
              editable={!isLoading}
            />

            {/* Description Input */}
            <Text style={styles.inputLabel}>
              Give us some details of this outfit (eg. When you would like to wear it, color of the outfit, any tiny details!) *
            </Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter details"
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
              multiline
              editable={!isLoading}
            />

            {/* Add and Cancel Buttons */}
            <TouchableOpacity
              style={[styles.addButton, isLoading && styles.buttonDisabled]}
              onPress={handleAdd}
              disabled={isLoading}
            >
              <Text style={styles.AdbuttonText}>{isLoading ? 'Adding...' : 'Add'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
              </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#2A2A3C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  scrollContent: {
    paddingBottom: 20,
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
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
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
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#FF5555',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  AdbuttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});