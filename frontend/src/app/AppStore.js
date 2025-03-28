import { configureStore } from '@reduxjs/toolkit'
import {api, apiProfile } from '../services/api'
import storageSlice from '../services/storageSlice'

const appStore = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        [apiProfile.reducerPath]: apiProfile.reducer,
        storage: storageSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware, apiProfile.middleware)
})

export default appStore