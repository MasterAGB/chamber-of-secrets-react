// VaultOperations.js
import * as Sharing from 'expo-sharing';
import immuDBInstance from '../api/immudb';
import classRegistryInstance from '../logic/ClassRegistry';
import {Alert, Platform} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';


class VaultOperations {

    setNavigation(navigation) {
        this.navigation = navigation;
    }

    generateSecureKey = (length = 32) => {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,-./:;<=>?@[]^_`{|}~";
        let randomCharacters = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomCharacters += charset[randomIndex];
        }
        return randomCharacters;
    };

    async createNewVault(login, password) {
        // Validate input
        if (!login || !password) {
            throw new Error('Login and password fields must not be empty.');
        }

        // Check for existing vault
        const existingData = await immuDBInstance.getUserDataFromDatabase(login);
        if (existingData && existingData.revisions && existingData.revisions.length > 0) {
            throw new Error('A vault with this login already exists.');
        }

        // Generate a secure key
        const key = this.generateSecureKey();

        // Attempt to save the new vault
        const responseJson = await immuDBInstance.saveNewVault(login, password, key);

        console.log("Creating1");
        // Handle the response
        if (!responseJson || !responseJson.documentId) {
            throw new Error('Failed to create a new vault.');
        }
        console.log("Creating2");
        // Set the user ID in your state management system
        classRegistryInstance.setUserId(responseJson.documentId); // Make sure to define setUserId


// Save the key to a file
        const defaultFileName = `${login}_key.txt`;
        console.log("file with key " + defaultFileName);

// Function to save and share the file for Web
        const saveAndShareForWeb = (content, fileName) => {
            // Create a Blob from the content
            const blob = new Blob([content], {type: 'text/plain'});

            // Create a link element
            const link = document.createElement('a');

            // Set the download attribute with the filename
            link.download = fileName;

            // Create a URL for the Blob and set it as the href attribute
            link.href = window.URL.createObjectURL(blob);

            // Append the link to the DOM (it can be invisible)
            document.body.appendChild(link);

            // Simulate a click on the link to trigger the download
            link.click();

            // Remove the link from the DOM
            document.body.removeChild(link);
        };

        // Function to prompt the user to confirm they have saved the key
        const confirmKeySave = () => {
            return new Promise((resolve, reject) => {
                // Here you would implement platform-specific confirmation dialog
                if (Platform.OS === 'web') {
                    if (window.confirm('Please confirm that you have saved the key file.')) {
                        resolve();
                    } else {
                        reject(new Error('The key file must be saved before you can proceed.'));
                    }
                } else {
                    // For Android/iOS, you would use something like React Native's Alert instead
                    Alert.alert(
                        'Confirmation',
                        'Please confirm that you have saved the key file.',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => reject(new Error('The key file must be saved before you can proceed.')),
                                style: 'cancel'
                            },
                            {text: 'I Saved It', onPress: () => resolve()},
                        ],
                        {cancelable: false}
                    );
                }
            });
        };


        try {
            if (Platform.OS === 'web') {
                // Use the web method for downloading the file
                saveAndShareForWeb(key, defaultFileName);
                // Confirm key save for web
                await confirmKeySave();
                vaultOperationsInstance.alert('Success', `Key saved to file: ${defaultFileName}`);
                console.log(`Key saved to file: ${defaultFileName}`);
            } else {
                // Use expo-file-system and expo-sharing for Android/iOS
                const fileUri = FileSystem.documentDirectory + defaultFileName;
                console.log("file url " + fileUri);
                console.log("key " + key);
                await FileSystem.writeAsStringAsync(fileUri, key);
                console.log(`Key writeAsStringAsync: ${defaultFileName}`);

                // After saving the file, use the Sharing API to share the file
                await Sharing.shareAsync(fileUri);
                // Confirm key save for web
                await confirmKeySave();
                vaultOperationsInstance.alert('Success', `Key saved to file: ${defaultFileName}`);
                console.log(`Key saved to file: ${defaultFileName}`);
            }
        } catch (error) {
            throw new Error(`Could not save the key to a file: ${error.message}`);
        }

        // You might want to return something to indicate success, like the new user ID or a success message
        return {success: true, userId: responseJson.documentId};
    }


    accessUserVault = async (login, password) => {
        try {
            let keyFromFile = null;
            try {
                keyFromFile = await this.readKeyFromFile();
                console.log("Key from file:", keyFromFile);
                // Continue your logic here, such as accessing the vault
            } catch (error) {
                throw new Error("An error occurred while reading the key file:" + error);
            }


            // If keyFromFile is undefined or null, that means the file was not picked
            if (!keyFromFile) {
                throw new Error('No file was selected.');
            }


            // Retrieve stored data for the given login
            const storedData = await immuDBInstance.getUserDataFromDatabase(login);
            console.log("Requested data login:", login);
            console.log("Requested data password:", password);
            console.log("Requested data keyFromFile:", keyFromFile);
            console.log("Stored Data:", storedData);

            const revisions = storedData?.revisions || [];

            if (revisions.length === 0) {
                throw new Error('No such vault exists.');
            }

            const firstRevision = revisions[0];
            const document = firstRevision.document || {};

            const loginFromDB = document.login;
            const passwordFromDB = document.password;
            const keyFromDB = document.key;


            if (loginFromDB === login && passwordFromDB === password && keyFromDB === keyFromFile) {
                // If login is successful, save the user ID and navigate to the user table
                let newUserId = document._id;
                console.log(newUserId);
                console.log(classRegistryInstance);
                classRegistryInstance.setUserId(newUserId);
                console.log(classRegistryInstance);
                console.log("User id from data:", classRegistryInstance.getUserId());


                return {success: true, userId: newUserId};
            } else {
                throw new Error('Failed to access the vault. Invalid credentials or key.');
            }
        } catch (error) {
            console.error(`An exception occurred: ${error}`);
            throw new Error(`An error occurred: ${error}`);
        }
    }
    readKeyFromFile = () => {
        return new Promise(async (resolve, reject) => {
            if (Platform.OS === 'web') {
                const input = document.createElement('input');
                input.type = 'file';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) {
                        reject('No file selected');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const keyFromFile = e.target.result;
                        resolve(keyFromFile);
                    };
                    reader.onerror = (err) => {
                        reject(err);
                    };
                    reader.readAsText(file);
                };
                input.click();
            } else {


                try {
                    const result = await DocumentPicker.getDocumentAsync({
                        type: '*/*', // or specify MIME types
                    });

                    if (result.type === 'success') {
                        // Read the file using Expo's FileSystem
                        const keyFromFile = await FileSystem.readAsStringAsync(result.uri);
                        resolve(keyFromFile);
                    } else {
                        reject('User cancelled the picker');
                    }
                } catch (err) {
                    reject(err);
                }


            }
        });
    };


    alert(title, message) {
        // A helper function to determine if the environment is web or not
        const isWeb = () => {
            return Platform.OS === 'web';
        };

// A function that handles alerting and logging, with platform-dependent behavior
        // Log with emojis regardless of the platform
        console.log(`✅ ${title}: ${message}`);

        // Use `alert` for web and `Alert.alert` for Android/iOS
        if (isWeb()) {
            alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }

    }

    // Method to synchronize the table data with the database
    synchronizeTableWithDatabase = async (localData) => {
        try {
            // Fetch existing data from the database
            const existingData = await immuDBInstance.getDataByUserId(classRegistryInstance.getUserId());
            if (existingData === null) {
                console.error("Error: Failed to fetch existing data for user_id:" + classRegistryInstance.getUserId());
                return;
            }

            console.log("Existing data:");
            console.log(existingData);
            console.log("Local data:");
            console.log(localData);

            // Merge records and update the database
            const mergedData = immuDBInstance.mergeRecords(existingData, localData);


            console.log("mergedData:");
            console.log(mergedData);

            const response = await immuDBInstance.replaceRecords(mergedData, classRegistryInstance.getUserId());

            console.log("response:");
            console.log(response);


            if (response.statusCode === 200 || response.transactionId != undefined) {
                // Handle success, update local state if needed
                console.log("Successfully synced the table.");
                // Call a method to update the state in UserPasswordTable component if necessary
            } else {
                console.error(`Error: Received status code ${response.statusCode}`);
            }
        } catch (error) {
            console.error('Error syncing data:', error);
        }
    };
}


const vaultOperationsInstance = new VaultOperations();

export default vaultOperationsInstance;


