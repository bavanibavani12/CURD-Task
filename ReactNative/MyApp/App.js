import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  Keyboard,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CrudApp = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Add new item to the list
  const addItem = () => {
    if (newItem.trim() === '') {
      Alert.alert('Validation', 'Item cannot be empty!');
      return;
    }

    const id = Math.random().toString(36).substr(2, 9);
    setItems(prevItems => [...prevItems, { id, value: newItem }]);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNewItem('');
    Keyboard.dismiss();
  };

  // Update an existing item
  const updateItem = () => {
    if (editValue.trim() === '') {
      Alert.alert('Validation', 'Item cannot be empty!');
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => (item.id === editId ? { ...item, value: editValue } : item))
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    resetEditState();
  };

  // Delete an item from the list
  const deleteItem = id => {
    Alert.alert('Confirm Deletion', 'Are you sure you want to delete this item?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          setItems(prevItems => prevItems.filter(item => item.id !== id));
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        },
      },
    ]);
  };

  // Reset edit state for modal
  const resetEditState = () => {
    setEditId(null);
    setEditValue('');
    setIsEditModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CRUD Operation </Text>

      {/* Add new item input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new item"
          value={newItem}
          onChangeText={setNewItem}
          returnKeyType="done"
          onSubmitEditing={addItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* List of items */}
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item.value}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={() => {
                    setEditId(item.id);
                    setEditValue(item.value);
                    setIsEditModalVisible(true);
                  }}
                  style={styles.editButton}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteItem(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Edit Item Modal */}
      <Modal visible={isEditModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Item</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Edit item"
              value={editValue}
              onChangeText={setEditValue}
              returnKeyType="done"
              onSubmitEditing={updateItem}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={updateItem} style={styles.modalUpdateButton}>
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={resetEditState}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e0f7fa',
    paddingTop:60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#00796b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#ffd740',
    padding: 8,
    marginRight: 5,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalUpdateButton: {
    backgroundColor: '#00796b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalCancelButton: {
    backgroundColor: '#ff5252',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CrudApp;
