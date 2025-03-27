import { configureStore } from '@reduxjs/toolkit'
import api from '../services/api'

const appStore = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
})

export default appStore