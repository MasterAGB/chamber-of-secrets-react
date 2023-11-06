// ClassRegistry.js

class ClassRegistry {
    constructor() {
        if (!ClassRegistry.instance) {
            this._userId = null;
            // ... initialize other properties
            ClassRegistry.instance = this;
        }
        return ClassRegistry.instance;
    }

    get getUserId() {
        return this._userId;
    }

    set setUserId(newUserId) {
        this._userId = newUserId;
    }

    // ... other getters and setters for different properties
}

const classRegistryInstance = new ClassRegistry();
Object.freeze(classRegistryInstance);

export default classRegistryInstance;
