import { createSlice } from '@reduxjs/toolkit'
import appStorage from '../app/Storage'

const initialState = {
    user: appStorage.getLoggedinUser(),
}

const storageSlice = createSlice({
    name: 'storage',
    initialState,
    reducers: {
        updateEmail(state, action) {
            const user = state?.user;
            if (user) {
                appStorage.putLoggedinUser(user);
                user.email = action.payload.email;
            }
        },

        updateUser(state, action) {
            const user = state?.user;
            if (user) {
                const updated = { ...user, ...action.payload};
                appStorage.putLoggedinUser(updated);
                state.user = updated;
            }
        },

        setUser(state, action) {
            const user = action.payload?.user;
            appStorage.putLoggedinUser(user);
            state.user = user;
        },

        removeUser(state, action) {
            appStorage.clearCurrentLogin();
            state.user = null;
        },
    }
})

export default storageSlice;

export const { updateEmail, updateUser, setUser, removeUser, } = storageSlice.actions;