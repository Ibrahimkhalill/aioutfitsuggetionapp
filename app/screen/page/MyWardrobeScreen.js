import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AddNewCategoryScreen from './AddNewCategoryScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationBar from '../component/NavigationBar';
import axiosInstance from '../component/axiosInstance';

export default function MyWardrobeScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/get_all_categories/");
      const data = response.data;

      // Handle different possible response structures
      if (Array.isArray(data)) {
        setCategories(data);
    
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle adding a new category
  const handleAddCategory = (newCategory) => {
    setCategories([...categories, { name: newCategory.name, icon: 'category' }]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1E2F" }}>
      <View style={styles.container}>
        {/* Header with Back Arrow and Title */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Wardrobe</Text>
        </View>

        {/* Categories List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF5555" style={styles.loading} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : categories.length > 0 ? (
          categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryButton}
              onPress={() => navigation.navigate("ViewWearpage", { category_id:  category.id })}
            >
              <Icon
                name={category.icon || 'category'} // Use provided icon or fallback to 'category'
                size={24}
                color="#FFF"
                style={styles.icon}
              />
              <Text style={styles.categoryText}>
                {category.name || category.category_name} {/* Handle different property names */}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No categories available</Text>
        )}

        {/* Add New Category Button */}
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add" size={24} color="#FFF" style={styles.icon} />
          <Text style={styles.categoryText}>Add New Category</Text>
        </TouchableOpacity>

        {/* Add New Category Modal */}
        <AddNewCategoryScreen
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          fetchCategories={fetchCategories}
        />
      </View>
      <NavigationBar navigation={navigation} />
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
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5555',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  addCategoryButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5555',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  icon: {
    marginHorizontal: 10,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 16,
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