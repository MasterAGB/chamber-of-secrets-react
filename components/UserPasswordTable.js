import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const UserPasswordTable = () => {
    const [data, setData] = useState([]);

    // This function adds a new entry with empty values.
    const addEntry = () => {
        setData([...data, { id: Date.now(), username: '', password: '', website: '' }]);
    };

    // This function removes an entry by id.
    const removeEntry = id => {
        setData(data.filter(item => item.id !== id));
    };

    // Function to log out (Placeholder for actual logic)
    const logout = () => {
        // Logout logic here
    };

    // Function to render each row in the table
    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <TextInput
                style={styles.input}
                onChangeText={text => updateField('username', text, item.id)}
                value={item.username}
                placeholder="Username"
            />
            <TextInput
                style={styles.input}
                onChangeText={text => updateField('password', text, item.id)}
                secureTextEntry
                value={item.password}
                placeholder="Password"
            />
            <TextInput
                style={styles.input}
                onChangeText={text => updateField('website', text, item.id)}
                value={item.website}
                placeholder="Website URL"
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
            <Button title="Sync Data" onPress={() => {}} />
            <Button title="Reset Data" onPress={() => {}} />
            <Button title="Sign Out" onPress={logout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        padding: 8,
        marginRight: 5,
        borderRadius: 4,
    },
    deleteButton: {
        padding: 8,
        backgroundColor: 'red',
        color: 'white',
    }
});

export default UserPasswordTable;