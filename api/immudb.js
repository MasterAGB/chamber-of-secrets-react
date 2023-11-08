import classRegistryInstance from '../logic/ClassRegistry';

class ImmuDB {
    constructor(apiKey, ledger, collection) {
        this.API_KEY = apiKey;
        this.LEDGER = ledger;
        this.COLLECTION = collection;
        this.HEADERS = {
            Accept: 'application/json',
            'X-API-Key': this.API_KEY,
            'Content-Type': 'application/json',
        };
        this.BASE_URL = `https://vault.immudb.io/ics/api/v1/ledger/${this.LEDGER}/collection/${this.COLLECTION}`;
    }

    createUniqueFieldIndex = async (field) => {
        const data = {
            fields: [field],
            isUnique: true,
        };
        try {
            const response = await fetch(`${this.BASE_URL}/indexes`, {
                method: 'POST',
                headers: this.HEADERS,
                body: JSON.stringify(data),
            });
            const jsonResponse = await response.json();
            if (response.status === 200) {
                return jsonResponse;
            } else {
                throw new Error('Failed to create unique field index');
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    checkForExistingRecords = async () => {
        const data = {
            page: 1,
            perPage: 1, // We just need to know if at least one record exists
        };
        try {
            const response = await fetch(`${this.BASE_URL}/documents/search`, {
                method: 'POST',
                headers: this.HEADERS,
                body: JSON.stringify(data),
            });
            const jsonResponse = await response.json();
            if (response.status === 200) {
                const revisions = jsonResponse.revisions || [];
                return revisions.length > 0; // True if at least one record exists, else False
            } else {
                console.error('Error fetching existing records:', response);
                return true; // Assume records exist to be safe
            }
        } catch (error) {
            console.error('Error fetching existing records:', error);
            return true; // Assume records exist to be safe
        }
    };


    saveNewVault = async (login, password, key) => {
        const data = {
            login: login,
            password: password,
            key: key,
            table_data: [
                {
                    id: 1,
                    username: `${login}1`,
                    password: 'examplePassword1',
                    website: 'www.example1.com',
                },
                {
                    id: 2,
                    username: `${login}2`,
                    password: 'examplePassword2',
                    website: 'www.example2.com',
                },
                {
                    id: 3,
                    username: `${login}3`,
                    password: 'examplePassword3',
                    website: 'www.example3.com',
                },
            ],
        };
        return this.saveDataToDatabase(data);
    };


    getDataByUserId = async (_id) => {
        const data = {
            page: 1,
            perPage: 100,
            query: {
                expressions: [
                    {
                        fieldComparisons: [
                            {
                                field: '_id',
                                operator: 'EQ',
                                value: _id
                            }
                        ]
                    }
                ]
            }
        };

        try {
            const response = await fetch(`https://vault.immudb.io/ics/api/v1/ledger/${this.LEDGER}/collection/${this.COLLECTION}/documents/search`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': this.API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseJson = await response.json();
            const revisions = responseJson.revisions || [];
            if (revisions.length > 0) {
                return revisions[0];
            }
        } catch (error) {
            console.error("There was an error fetching the user data:", error);
        }

        return null;
    };
    modifyCollectionSchema = async () => {
        const data = {
            fields: [
                {
                    name: 'login',
                    type: 'STRING'
                }
            ],
            indexes: [
                {
                    fields: ['login'],
                    isUnique: true
                }
            ]
        };

        const url = `https://vault.immudb.io/ics/api/v1/ledger/${this.LEDGER}/collection/${this.COLLECTION}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': this.API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error("Error: ", error);
            return null;
        }
    };
    saveDataToDatabase = async (data) => {
        console.log("save_data_to_database");
        const url = `https://vault.immudb.io/ics/api/v1/ledger/${this.LEDGER}/collection/${this.COLLECTION}/document`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': this.API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error("Error: ", error);
            return null;
        }
    };

    fetchCollectionMetadata = async () => {
        const url = `https://vault.immudb.io/ics/api/v1/ledger/${this.LEDGER}/collection/${this.COLLECTION}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': this.API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error("Error: ", error);
            return null;
        }
    };
    getUserDataFromDatabase = async (login) => {
        const collectionInfo = await this.fetchCollectionMetadata();
        if (collectionInfo) {
            console.log("Got to retrieve collection info.");
            console.log(JSON.stringify(collectionInfo, null, 4));
        } else {
            console.log("Failed to retrieve collection info.");
        }

        const data = {
            page: 1,
            perPage: 100,
            query: {
                expressions: [
                    {
                        fieldComparisons: [
                            {
                                field: 'login',
                                operator: 'EQ',
                                value: login
                            }
                        ]
                    }
                ]
            }
        };

        const url = `https://vault.immudb.io/ics/api/v1/ledger/${this.LEDGER}/collection/${this.COLLECTION}/documents/search`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': this.API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(`Yey! ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error: Received status code ${error}`);
            return null;
        }
    };

    loadTableFromDatabase = async () => {

        console.log(classRegistryInstance);
        console.log(classRegistryInstance.getUserId());

        const data = {
            page: 1,
            perPage: 100,
            query: {
                expressions: [
                    {
                        fieldComparisons: [
                            {
                                field: '_id',
                                operator: 'EQ',
                                value: classRegistryInstance.getUserId()
                            }
                        ]
                    }
                ]
            }
        };

        console.log(`Searching for data: ${classRegistryInstance.getUserId()}`);

        const url = `https://vault.immudb.io/ics/api/v1/ledger/${this.LEDGER}/collection/${this.COLLECTION}/documents/search`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.HEADERS,
                body: JSON.stringify(data)
            });


            if (!response.ok && response.status !== 200) {
                console.error("ERROR - status!=200");
                console.log(response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            const jsonResponse = await response.json();
            const revisions = jsonResponse.revisions || [];

            if (revisions.length > 0) {
                const document = revisions[0].document || {};
                const tableData = document.table_data || [];

                console.log("trying to update with tabledata:")
                console.log(tableData)
                return tableData;
            } else {
                console.error("Error: Failed to populate table. Revisions empty.");
            }
        } catch (error) {
            console.error(`Error: Failed to populate table. ${error}`);
        }
    };


    checkStartup = async () => {
        // Only execute if no records exist in the DB
        if (!(await this.checkForExistingRecords())) {
            const updateResult = await this.modifyCollectionSchema();
            if (!updateResult) {
                console.error("Failed to update collection fields.");
            }

            const indexResult = await this.createUniqueFieldIndex('login');
            if (!indexResult) {
                console.error("Failed to create unique index.");
            }
        }
    }

    replaceRecords = async (existingData, userId) => {
        const updateBody = {
            document: existingData.document,
            query: {
                expressions: [{
                    fieldComparisons: [{
                        field: '_id',
                        operator: 'EQ',
                        value: userId
                    }]
                }]
            }
        };

        const url = `https://vault.immudb.io/ics/api/v1/ledger/${this.LEDGER}/collection/${this.COLLECTION}/document`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.HEADERS,
                body: JSON.stringify(updateBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error: ${error}`);
            return null;
        }
    }

    mergeRecords = (existingData, allRows) => {
        // This function is a pure function and does not need to be asynchronous
        existingData.document.table_data = allRows; // Replace only table_data part
        return existingData;
    }


}

const apiKey = 'default.NQ2l9fEGCUAKaPzzZogZtw.3nnnrusNQ1z-_k4zzpmiibr7m_MARH4wDlC_eyu0vvTmS7K7';
const ledger = "default";
const collection = "default";

const immuDBInstance = new ImmuDB(apiKey, ledger, collection);

// Export the instance
export default immuDBInstance;