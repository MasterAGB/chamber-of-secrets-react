class ClassRegistry {
    constructor() {
        if (!ClassRegistry.instance) {
            this._userId = null;
            // ... initialize other properties
            ClassRegistry.instance = this;
        }
        return ClassRegistry.instance;
    }

    // Change from get to a regular method
    getUserId() {
        return this._userId;
    }

    // Change from set to a regular method
    setUserId(newUserId) {
        this._userId = newUserId;
    }
}

const classRegistryInstance = new ClassRegistry();


export default classRegistryInstance;
