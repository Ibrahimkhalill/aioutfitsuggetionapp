import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationBar from '../component/NavigationBar';
import axiosInstance from '../component/axiosInstance'; // Ensure this path is correct
import { useAuth } from '../authentication/Auth';

export default function ProfileScreen({ navigation }) {
  const [preferredDressSize, setPreferredDressSize] = useState('');
  const [preferredShoeSize, setPreferredShoeSize] = useState('');
  const [preferredDressColor, setPreferredDressColor] = useState('');
  const [others, setOthers] = useState('');
  const [profileImage, setProfileImage] = useState(null); // Default to null
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');

  const insets = useSafeAreaInsets();
  const {logout} = useAuth();

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/auth/get_user_profile/');
        const data = response.data;
        console.log("Profile data:", data);
        
        setUsername(data.username);
        setPreferredDressSize(data.dress_size || '');
        setPreferredShoeSize(data.shoe_size || '');
        setPreferredDressColor(data.dress_color || '');
        setOthers(data.others || '');
        setProfileImage(data.profile_picture ? `http://192.168.20.201:8112${data.profile_picture}` : 'https://img.freepik.com/free-photo/little-girl-studio_1303-5617.jpg?t=st=1742894046~exp=1742897646~hmac=69ce8f5315238e9115b53e655b4289d966310693fee80bc5a5610c2dc0dbb86b&w=740');
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('dress_size', preferredDressSize.trim());
    formData.append('shoe_size', preferredShoeSize.trim());
    formData.append('dress_color', preferredDressColor.trim());
    formData.append('others', others.trim());

    // Append profile picture if it’s a local URI (not the default URL)
    if (profileImage && !profileImage.startsWith('http')) {
      const imageFile = {
        uri: profileImage,
        type: 'image/jpeg', // Adjust based on your image format
        name: `profile_${Date.now()}.jpg`,
      };
      formData.append('profile_picture', imageFile);
    }

    try {
      const response = await axiosInstance.patch('/auth/update_user_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.data.success) {
        Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to update profile.');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have been logged out.');
    logout();
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingBottom: 80 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Back Arrow, Title, and Logout Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={handleLogout} disabled={isLoading}>
              <Icon name="logout" size={24} color="#FF5555" />
            </TouchableOpacity>
          </View>

          {/* Profile Picture and Username */}
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={pickImage} disabled={isLoading}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.editIconContainer}>
                <Icon name="edit" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.username}>{username}</Text>
          </View>

          {/* Input Fields */}
        
    
              <Text style={styles.inputLabel}>Preferred Outfit Size *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your preferred Outfit size"
                placeholderTextColor="#888"
                value={preferredDressSize}
                onChangeText={setPreferredDressSize}
                editable={!isLoading}
              />

              <Text style={styles.inputLabel}>Preferred Shoe Size *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your preferred shoe size"
                placeholderTextColor="#888"
                value={preferredShoeSize}
                onChangeText={setPreferredShoeSize}
                editable={!isLoading}
              />

              <Text style={styles.inputLabel}>Preferred Outfit Color *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your preferred outfit color"
                placeholderTextColor="#888"
                value={preferredDressColor}
                onChangeText={setPreferredDressColor}
                editable={!isLoading}
              />

              <Text style={styles.inputLabel}>Others *</Text>
              <TextInput
                style={[styles.input, styles.othersInput]}
                placeholder="Any other preferences"
                placeholderTextColor="#888"
                value={others}
                onChangeText={setOthers}
                multiline
                editable={!isLoading}
              />
        

          {/* Update Profile Button */}
          <TouchableOpacity
            style={[styles.updateButton, isLoading && styles.buttonDisabled]}
            onPress={handleUpdateProfile}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}> 
               {isLoading ? (
            
              <ActivityIndicator size="large" color="#FF5555" />
            
            
          ) : ( 'Update Profile')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E2F',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: '#FF5555',
    borderRadius: 15,
    padding: 5,
  },
  username: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
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
    fontSize: 16,
  },
  othersInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#FF5555',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});