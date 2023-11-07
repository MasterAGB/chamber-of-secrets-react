import React, { useState,useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import vaultOperationsInstance from '../logic/VaultOperations';
import immuDBInstance from "../api/immudb";

const UserPasswordTable = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [lastFetchedData, setLastFetchedData] = useState([]); // Store the last fetched data// Add a new state to track unsaved changes
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    vaultOperationsInstance.setNavigation(navigation);

    // This function will be called to fetch data from immudb when the component mounts
    const fetchTableData = async () => {
        try {
            let fetchedData = await immuDBInstance.loadTableFromDatabase(); // Implement this method in immuDBInstance
            // Ensure each item has an id
            fetchedData = fetchedData.map(item => ({
                id: item.id || Date.now() + Math.random(), // Create a unique ID if it's missing
                ...item
            }));
            setData(fetchedData);
            setLastFetchedData(fetchedData); // Store the fetched data as the last fetched state
        } catch (error) {
            console.error('Error fetching data:', error);
            // Optionally, handle the error state in UI, e.g., showing an alert or a message on screen
        }
    };
    // Call fetchTableData when the component mounts
    useEffect(() => {
        fetchTableData();
    }, []); // The empty array means this effect will only run once, similar to componentDidMount


    // This function adds a new entry with empty values.
    const addEntry = () => {
        let newVar = { id: Date.now(), username: '', password: '', website: '' };
        setData([...data ?? [], newVar]);
    };

    // This function removes an entry by id.
    const removeEntry = id => {
        setData(data.filter(item => item.id !== id));
    };

    // Function to log out (Placeholder for actual logic)
    const logout = () => {
        vaultOperationsInstance.displayLoginScreen();
    };

// After data is synced successfully, reset unsaved changes
    const handleSyncPress = async () => {
        await vaultOperationsInstance.synchronizeTableWithDatabase(data);
        setLastFetchedData(data); // Store the fetched data as the last fetched state
        setUnsavedChanges(false); // Reset the unsaved changes
    };

// Also reset unsaved changes when the data is reset to the last fetched state
    const resetTableData = () => {
        setData(lastFetchedData);
        setUnsavedChanges(false); // Reset the unsaved changes
    };

// Modify the input styles to highlight changes
    const inputStyle = (item) => {
        const originalItem = lastFetchedData.find(original => original.id === item.id);
        const itemChanged = originalItem && (
            item.username !== originalItem.username ||
            item.password !== originalItem.password ||
            item.website !== originalItem.website
        );
        return [
            styles.input,
            itemChanged ? styles.inputChanged : null // Apply changed styles if item has been edited
        ];
    };


    // Function to render each row in the table
    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <TextInput
                style={inputStyle(item)}
                onChangeText={text => updateField('username', text, item.id)}
                value={item.username}
                placeholder="Username"
                autoComplete="off" // Add this line
            />
            <TextInput
                style={inputStyle(item)}
                onChangeText={text => updateField('password', text, item.id)}
                secureTextEntry
                value={item.password}
                placeholder="Password"
                autoComplete="off" // Add this line
            />
            <TextInput
                style={inputStyle(item)}
                onChangeText={text => updateField('website', text, item.id)}
                value={item.website}
                placeholder="Website URL"
                autoComplete="off" // Add this line
            />
            <TouchableOpacity onPress={() => removeEntry(item.id)}>
                <Text style={styles.deleteButton}>X</Text>
            </TouchableOpacity>
        </View>
    );

    // Function to update the field in data state
    const updateField = (field, value, id) => {
        const newData = data.map(item => {
            if (item.id === id) {
                setUnsavedChanges(true); // Set unsaved changes to true
                return { ...item, [field]: value };
            }
            return item;
        });
        setData(newData);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={
                    <View>
                        <Text style={styles.header}>Vault Manager</Text>
                        <Button title="Add Entry" onPress={addEntry} />
                    </View>
                }
            />

            {/* Conditionally show the Reset Data button if there are unsaved changes */}
            {unsavedChanges && (
                <Button title="Reset Data" onPress={resetTableData} />
            )}
            {/* Disable the Sync Data button if there are no unsaved changes */}
            <Button title="Sync Data" onPress={handleSyncPress} disabled={!unsavedChanges} />
            <Button title="Sign Out" onPress={logout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff', // Assuming you want a white background
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 10, // Add some padding at the bottom of the header
        borderBottomWidth: 1, // Add a bottom border to the header
        borderColor: '#e1e1e1', // Light grey color for the borders
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1, // Only add bottom border to separate rows
        borderColor: '#e1e1e1', // Light grey color for the borders
        paddingVertical: 2, // Vertical padding to space out rows
    },
    input: {
        flex: 1, // Dynamically allocate remaining space
        borderWidth: 0, // Remove borders
        padding: 8,
        margin: 0,
        marginHorizontal: 2, // Add horizontal margin between inputs
        backgroundColor: '#fff', // Light grey background for inputs
        color: '#333', // Dark grey color for text

        borderLeftWidth: 1, // Only add bottom border to separate rows
        borderColor: '#e1e1e1', // Light grey color for the borders
    },
    inputChanged: {
        backgroundColor: 'orange', // Or any other color to indicate a change
    },
    deleteButton: {
        width: 30, // Set a fixed width for the delete button
        height: 30, // Set a fixed height to make it square
        justifyContent: 'center', // Center the 'X' text vertically
        alignItems: 'center', // Center the 'X' text horizontally
        backgroundColor: 'red',
        color: 'white',
        marginLeft: 5, // Add some margin to the left of the delete button
    },
});

export default UserPasswordTable;