import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import classRegistryInstance from '../logic/ClassRegistry';
import VaultOperations from '../logic/VaultOperations';

const MainWindow = () => {
    const [newLogin, setNewLogin] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [existingLogin, setExistingLogin] = useState('');
    const [existingPassword, setExistingPassword] = useState('');


    const vaultOps = new VaultOperations({ navigation });
    console.log('displayUserTable0');
    // Function to handle the creation of a new vault
    const createNewVault = () => {
        vaultOps.createNewVault(newLogin, newPassword);
    };

    // Function to handle accessing an existing vault
    const accessExistingVault = () => {
        vaultOps.accessUserVault(existingLogin, existingPassword);
    };
    const displayUserTable = () => {
        console.log('displayUserTable1');
        vaultOps.displayUserTable();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logoLabel}>🪄 Chamber of Secrets 🪄</Text>
            <Text style={styles.logoSubLabel}>A Secure Vault Manager </Text>

            <Text style={styles.label}>Create a new vault:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setNewLogin}
                value={newLogin}
                placeholder="Enter new login"
            />
            <TextInput
                style={styles.input}
                onChangeText={setNewPassword}
                secureTextEntry
                value={newPassword}
                placeholder="Enter new password"
            />
            <Button
                title="Create Vault 🔒"
                onPress={createNewVault}
            />

            <Text style={styles.label}>Access an existing vault:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setExistingLogin}
                value={existingLogin}
                placeholder="Enter existing login"
            />
            <TextInput
                style={styles.input}
                onChangeText={setExistingPassword}
                secureTextEntry
                value={existingPassword}
                placeholder="Enter existing password"
            />
            <Button
                title="Load Key & Access Vault 🔑"
                onPress={accessExistingVault}
            />

            {/* If you have a developer button */}
             <Button
        title="Developer: open table"
        onPress={displayUserTable}
      />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    logoSubLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginTop: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 5,
        borderColor: '#ccc',
    }
});

export default MainWindow;
