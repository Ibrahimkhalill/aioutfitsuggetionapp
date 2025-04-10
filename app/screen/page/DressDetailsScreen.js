import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import NavigationBar from '../component/NavigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '../component/axiosInstance'; // Ensure this path is correct

const baseUrl = 'https://cherryapi.pythonanywhere.com';

export default function DressDetailsScreen({ navigation }) {
  const route = useRoute();
  const { dress, categoryName, category_id } = route.params || {};

  const [size, setSize] = useState(dress.size);
  const [name, setName] = useState(dress.name);
  const [description, setDescription] = useState(dress.details); // Use 'details' to match API
  const [isEditingSize, setIsEditingSize] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('Dress:', dress);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/delete_dress/', {
        dress_id: dress.id,
      });

      if (response.status === 200 ) {
        navigation.navigate("ViewWearpage", { category_id });
        Alert.alert('Success', 'Dress deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting dress:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to delete dress.');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSize = async () => {
   
    const formData = new FormData();
    formData.append('dress_id', dress.id);
    formData.append('size', size.trim());
    formData.append('name', dress.name);
    formData.append('details', dress.details);

    try {
      const response = await axiosInstance.patch('/edit_dress/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.data.success) {
        dress.size = size; // Update local dress object
        setIsEditingSize(false);
        Alert.alert('Success', 'Size updated successfully!');
      }
    } catch (error) {
      console.error('Error updating size:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to update size.');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } 
  };

  const handleCancelSize = () => {
    setSize(dress.size);
    setIsEditingSize(false);
  };

  const handleSaveName = async () => {
   
    const formData = new FormData();
    formData.append('dress_id', dress.id);
    formData.append('name', name.trim());
    formData.append('size', dress.size);
    formData.append('details', dress.details);

    try {
      const response = await axiosInstance.patch('/edit_dress/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.data.success) {
        dress.name = name; // Update local dress object
        setIsEditingName(false);
        Alert.alert('Success', 'Name updated successfully!');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to update name.');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } f
  };

  const handleCancelName = () => {
    setName(dress.name);
    setIsEditingName(false);
  };

  const handleSaveDescription = async () => {
   
    const formData = new FormData();
    formData.append('dress_id', dress.id);
    formData.append('details', description.trim());
    formData.append('name', dress.name);
    formData.append('size', dress.size);

    try {
      const response = await axiosInstance.patch('/edit_dress/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 ) {
        dress.details = description; // Update local dress object
        setIsEditingDescription(false);
        Alert.alert('Success', 'Description updated successfully!');
      }
    } catch (error) {
      console.error('Error updating description:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to update description.');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  const handleCancelDescription = () => {
    setDescription(dress.details);
    setIsEditingDescription(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1E2F" }}>
      <View style={styles.container}>
        {/* Header with Back Arrow and Title */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Icon name="calendar-today" size={24} color="#FFF" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>{categoryName}</Text>
          </View>
        </View>
    <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Dress Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${baseUrl}${dress.picture}` }}
            style={styles.dressImage}
            resizeMode="contain"
          />
        </View>

        {/* Dress Details with Edit Buttons */}
        <View style={styles.fieldContainer}>
          {isEditingSize ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={size}
                onChangeText={setSize}
                placeholder="Enter size"
                placeholderTextColor="#888"
                editable={!isLoading}
              />
              <TouchableOpacity onPress={handleSaveSize} style={styles.actionButton} disabled={isLoading}>
                <Icon name="check" size={20} color="#00FF00" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelSize} style={styles.actionButton} disabled={isLoading}>
                <Icon name="close" size={20} color="#FF5555" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fieldRow}>
              <Text style={styles.sizeText}>Size: {size}</Text>
              <TouchableOpacity onPress={() => setIsEditingSize(true)} disabled={isLoading}>
                <Feather name="edit" size={20} color="#FFF" style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          {isEditingName ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor="#888"
                editable={!isLoading}
              />
              <TouchableOpacity onPress={handleSaveName} style={styles.actionButton} disabled={isLoading}>
                <Icon name="check" size={20} color="#00FF00" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelName} style={styles.actionButton} disabled={isLoading}>
                <Icon name="close" size={20} color="#FF5555" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fieldRow}>
              <Text style={styles.nameText}>{name}</Text>
              <TouchableOpacity onPress={() => setIsEditingName(true)} disabled={isLoading}>
                <Feather name="edit" size={20} color="#FFF" style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.descriptionLabel}>Description</Text>
          {isEditingDescription ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor="#888"
                multiline
                editable={!isLoading}
              />
              <TouchableOpacity onPress={handleSaveDescription} style={styles.actionButton} disabled={isLoading}>
                <Icon name="check" size={20} color="#00FF00" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelDescription} style={styles.actionButton} disabled={isLoading}>
                <Icon name="close" size={20} color="#FF5555" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fieldRow}>
              <Text style={styles.descriptionText}>{description}</Text>
              <TouchableOpacity onPress={() => setIsEditingDescription(true)} disabled={isLoading}>
                <Feather name="edit" size={20} color="#FFF" style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.deleteButton, isLoading && styles.buttonDisabled]}
          onPress={handleDelete}
          disabled={isLoading}
        >
          <Text style={styles.deleteButtonText}>{isLoading ? 'Deleting...' : 'DELETE'}</Text>
        </TouchableOpacity>
    </ScrollView>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2F',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerIcon: {
    marginRight: 5,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 20,
  },
  dressImage: {
    width: '100%',
    height: '100%',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sizeText: {
    fontSize: 15,
    color: '#FFF',
  },
  nameText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  descriptionLabel: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  editIcon: {
    marginLeft: 10,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#3A3A4C',
    borderRadius: 10,
    padding: 10,
    color: '#FFF',
    marginRight: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  actionButton: {
    padding: 5,
  },
  deleteButton: {
    backgroundColor: '#FF5555',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});