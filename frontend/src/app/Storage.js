class LocalStorage {

    put(key, value) {
        let serialized;
        if (null === value || undefined === value) {
            serialized = null;
        }
        else {
            serialized = JSON.stringify(value);
        }
        localStorage.setItem(key, serialized);
    }

    get(key) {
        return localStorage.getItem(key);
    }

    getAsNumber(key) {
        const val = localStorage.getItem(key);
        return null === val ? null : Number(val);
    }

    getAsObject(key) {
        const val = localStorage.getItem(key);
        return null === val ? null : JSON.parse(val);
    }

    remove(key) {
        localStorage.removeItem(key);
    } 
}

class AppStorage {
    
    constructor() {
        this.storage = new LocalStorage();
    }

    putAccessToken(token, expire) {
        const storage = this.storage;
        storage.put('access-token:token', token);
        storage.put('access-token:expire', expire);
    }

    getAccessToken() {
        return this.storage.get('access-token:token');
    }

    isAccessTokenExpired() {
        const now = Math.floor(Date.now()/1000);
        const expire = this.storage.getAsNumber('access-token:expire');
        return now > expire;
    }
    
    putRefreshToken(token) {
        this.storage.put('refresh-token:token',token);
    }

    getRefreshToken() {
        return this.storage.get('refresh-token:token');
    }

    putLoggedinUser(user) {
        this.storage.put('user:loggedin', user);
    }

    getLoggedinUser() {
        return this.storage.getAsObject('user:loggedin');
    }

    hasLoggedinUser() {
        return null !== this.getLoggedinUser();
    }

    clearCurrentLogin() {
        const storage = this.storage;
        storage.remove('access-token:token');
        storage.remove('access-token:expire');
        storage.remove('refresh-token:token');
        storage.remove('user:loggedin');
    }
}

const appStorage = new AppStorage();

export default appStorage;