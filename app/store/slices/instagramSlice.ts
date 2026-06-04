import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchInstagramStatus = createAsyncThunk(
  'instagram/fetchStatus',
  async () => {
    const res = await fetch('/api/instagram/status')
    return res.json()
  }
)

export const fetchInstagramMedia = createAsyncThunk(
  'instagram/fetchMedia',
  async () => {
    const res = await fetch('/api/instagram/media')
    return res.json()
  }
)

const instagramSlice = createSlice({
  name: 'instagram',
  initialState: {
    isConnected: false,
    account: null as any,
    media: [],
    rules: [],
    loading: false,
    mediaLoading: false,
  },
  reducers: {
    setDisconnected: (state) => {
      state.isConnected = false
      state.account = null
      state.media = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstagramStatus.fulfilled, (state, action) => {
        state.isConnected = action.payload.isConnected
        state.account = action.payload.account || null
        state.loading = false
      })
      .addCase(fetchInstagramStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchInstagramMedia.fulfilled, (state, action) => {
        state.media = action.payload.media || []
        state.mediaLoading = false
      })
      .addCase(fetchInstagramMedia.pending, (state) => {
        state.mediaLoading = true
      })
  }
})

export const { setDisconnected } = instagramSlice.actions
export default instagramSlice.reducer
