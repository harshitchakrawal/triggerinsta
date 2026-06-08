import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import instagramReducer from './slices/instagramSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    instagram: instagramReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch