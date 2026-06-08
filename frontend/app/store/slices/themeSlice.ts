import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: { dark: false },
  reducers: {
    toggleTheme: (state) => {
      state.dark = !state.dark
      if (state.dark) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    },
    initTheme: (state) => {
      const saved = localStorage.getItem('theme')
      state.dark = saved === 'dark'
      if (state.dark) document.documentElement.classList.add('dark')
    }
  }
})

export const { toggleTheme, initTheme } = themeSlice.actions
export default themeSlice.reducer
