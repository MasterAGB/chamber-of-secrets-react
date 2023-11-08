import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import vaultOperationsInstance from '../logic/VaultOperations';

const MainWindow = ({ navigation }) => {
    const [newLogin, setNewLogin] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [existingLogin, setExistingLogin] = useState('');
    const [existingPassword, setExistingPassword] = useState('');

    // State to hold error messages
    const [errorRegister, setErrorRegister] = useState('');
    const [errorLogin, setErrorLogin] = useState('');


    // Function to handle the creation of a new vault
    const createNewVault = () => {
        vaultOperationsInstance.createNewVault(newLogin, newPassword)
            .then(() => {
                setNewLogin('');
                setNewPassword('');
                setErrorLogin('');
                setErrorRegister('');
                navigation.navigate('UserPasswordTable');
            })
            .catch((e) => {
                setErrorRegister(e.message);
            });
    };

    // Function to handle accessing an existing vault
    const accessExistingVault = () => {
        vaultOperationsInstance.accessUserVault(existingLogin, existingPassword)
            .then(() => {
                setExistingLogin('');
                setExistingPassword('');
                setErrorLogin('');
                setErrorRegister('');
                navigation.navigate('UserPasswordTable');
            })
            .catch((e) => {
                setErrorLogin(e.message);
            });
    };
    const displayUserTable = () => {
        console.log('displayUserTable1');
        navigation.navigate('UserPasswordTable');
    };

    return (
        <View style={styles.container} autoComplete="off">
            <Text style={styles.logoLabel}>🪄 Chamber of Secrets 🪄</Text>
            <Text style={styles.logoSubLabel}>A Secure Vault Manager</Text>

            <Text style={styles.label}>Create a new vault:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setNewLogin}
                value={newLogin}
                placeholder="Enter new login"
                autoComplete="off" // Add this line
            />
            <TextInput
                style={styles.input}
                onChangeText={setNewPassword}
                secureTextEntry
                value={newPassword}
                placeholder="Enter new password"
                autoComplete="off" // Add this line
            />
            <Button
                title="Create Vault 🔒"
                onPress={createNewVault}
            />
            {/* Error message display */}
            {errorRegister !== '' && (
                <Text style={styles.errorText}>{errorRegister}</Text>
            )}

            <Text style={styles.label}>Access an existing vault:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setExistingLogin}
                value={existingLogin}
                placeholder="Enter existing login"
                autoComplete="off" // Add this line
            />
            <TextInput
                style={styles.input}
                onChangeText={setExistingPassword}
                secureTextEntry
                value={existingPassword}
                placeholder="Enter existing password"
                autoComplete="off" // Add this line
            />
            <Button
                title="Load Key & Access Vault 🔑"
                onPress={accessExistingVault}
            />
            {/* Error message display */}
            {errorLogin !== '' && (
                <Text style={styles.errorText}>{errorLogin}</Text>
            )}

            {/* If you have a developer button
             <Button
        title="Developer: open table"
        onPress={displayUserTable}
      />*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        maxWidth: '100%', // Maximum width is 100% of the screen width
        aspectRatio: 1, // Ensures that the width and height are equal
        alignSelf: 'center', // Centers the square container
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
    },
    // Style for the error text
    errorText: {
        color: 'red',
        textAlign: 'center',
    }
});

export default MainWindow;
