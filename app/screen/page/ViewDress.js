import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import AddNewDressModal from './AddNewDressModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '../component/axiosInstance'; // Ensure this path is correct
import * as FileSystem from 'expo-file-system'; // Add this for file handling
import { useFocusEffect } from '@react-navigation/native';
export default function ViewDress({ navigation, route }) {
  const { category_id } = route.params || {};
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const baseUrl = 'https://cherryapi.pythonanywhere.com';
  const [searchQuery, setSearchQuery] = useState('');
  const [dresses, setDresses] = useState([]);
  const [categoryName, setCategoryName] = useState(''); // To display category name
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dresses for the specific category
  const fetchDresses = async () => {
    if (!category_id) {
      setError("No category ID provided.");
      setIsLoading(false);
      return;
    }
    console.log("Fetching dresses for category:", category_id);
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/get_specific_category/`,{category_id});
      const data = response.data;
      console.log("data", data);
      
      // Set category name and dresses from response
      setCategoryName(data.name || 'Unknown Category');
      setDresses(data.dresses || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching dresses:", error);
      setError("Failed to load dresses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      // Call the fetchDresses function when the screen comes into focus
      fetchDresses();
    }, []) // Empty dependency array means this effect runs only once when the screen is focused
  );
  useEffect(() => {
   
    const checkAndRequestPermission = async () => {
      if (!permission) return;

      if (!permission.granted) {
        setShowPermissionPrompt(true);
      }
    };

    checkAndRequestPermission();
  }, [permission]);

  const handlePermission = () => {
    if (!permission) return;

    if (permission.granted) {
      setCameraVisible(true);
    } else {
      setShowPermissionPrompt(true);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Optional delay
        setCapturedImage(photo.uri);
        setCameraVisible(false);
        setModalVisible(true);
      } catch (error) {
        console.error('Error capturing photo:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };
  // // const takePicture = async () => {
  // //   if (cameraRef.current) {
  // //     setIsCapturing(true);
  // //     try {
  // //       const photo = await cameraRef.current.takePictureAsync();
  // //       // Save the image to a persistent location
  // //       const fileName = `${FileSystem.documentDirectory}dress_${Date.now()}.jpg`;
  // //       await FileSystem.moveAsync({
  // //         from: photo.uri, // Temporary URI from camera
  // //         to: fileName,    // Persistent location
  // //       });
  // //       await new Promise(resolve => setTimeout(resolve, 1000))
  // //       setCapturedImage(fileName); // Use the new persistent URI
  // //       setCameraVisible(false);
  // //       setModalVisible(true);
  // //     } catch (error) {
  // //       console.error('Error capturing or saving photo:', error);
  // //     } finally {
  // //       setIsCapturing(false);
  // //     }
  // //   }
  // };

  const handleDeleteDress = (dressId) => {
    setDresses(dresses.filter((dress) => dress.id !== dressId));
  };

  const handleAddDress = (newDress) => {
    const newDressId = (dresses.length + 1).toString();
    setDresses([
      ...dresses,
      {
        id: newDressId,
        name: newDress.name,
        size: newDress.size,
        details: newDress.description, // Match API key 'details'
        picture: newDress.image, // Match API key 'picture'
      },
    ]);
  };

  const renderDressItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dressItem}
      onPress={() => navigation.navigate('DressDetailsScreen', { dress: item , categoryName, category_id })}
    >
      <Image
        source={{ uri: `${baseUrl}${item.picture}` }} // Use 'picture' as per API response
        style={styles.dressImage}
        resizeMode="cover"
      />
      <Text style={styles.dressName}>{item.name}</Text>
      <Text style={styles.dressDescription}>{item.details}</Text> {/* Use 'details' as per API */}
    </TouchableOpacity>
  );

  const filteredDresses = dresses.filter(dress =>
    dress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dress.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1E2F" }}>
      {showPermissionPrompt && !permission?.granted ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.message}>We need your permission to access the camera to add new dresses.</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPermissionPrompt(false)}
            style={[styles.permissionButton, { backgroundColor: '#888' }]}
          >
            <Text style={styles.permissionButtonText}>Deny</Text>
          </TouchableOpacity>
        </View>
      ) : !cameraVisible ? (
        <View style={styles.container}>
          {/* Header with Back Arrow and Title */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
             
              <Text style={styles.headerTitle}>{categoryName}</Text>
            </View>
          </View>

          {/* Add New Dress Button */}
          <TouchableOpacity style={styles.addButton} onPress={handlePermission}>
            <Icon name="camera-alt" size={24} color="#FFF" style={styles.icon} />
            <Text style={styles.addButtonText}>Add New Picture</Text>
          </TouchableOpacity>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a outfit"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Dresses Grid */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#FF5555" style={styles.loading} />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchDresses}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredDresses.length > 0 ? (
            <FlatList
              data={filteredDresses}
              renderItem={renderDressItem}
              keyExtractor={(item) => item.id.toString()} // Ensure id is a string
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              style={styles.flatList}
            />
          ) : (
            <Text style={styles.noDataText}>No outfit available in this category</Text>
          )}

          {/* NavigationBar */}
       
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          >
            {isCapturing && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FF5555" />
                <Text style={styles.loadingText}>Capturing...</Text>
              </View>
            )}
            <View style={styles.cameraButtonContainer}>
              <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraFacing}>
                <Icon name="flip-camera-ios" size={30} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraButton} onPress={takePicture} disabled={isCapturing}>
                <Icon name="camera" size={30} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraButton} onPress={() => setCameraVisible(false)}>
                <Icon name="close" size={30} color="#FFF" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}

      {/* Add New Dress Modal */}
      <AddNewDressModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        fetchCateories={fetchDresses}
        preloadedImage={capturedImage}
        category_id={category_id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2F',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#1E1E2F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5555',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#3A3A4C',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    paddingVertical: 10,
  },
  dressItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#2A2A3C',
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
  },
  dressImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  dressName: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  dressDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'left',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 5,
  },
  message: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#FF5555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
    alignItems: 'flex-end',
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 80,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  loading: {
    marginVertical: 20,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  errorText: {
    color: '#FF5555',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#FF5555',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});