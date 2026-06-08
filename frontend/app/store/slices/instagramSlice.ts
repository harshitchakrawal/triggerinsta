import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { backendUrl } from '@/app/lib/backend'

export const fetchInstagramStatus = createAsyncThunk(
  'instagram/fetchStatus',
  async () => {
    const res = await fetch(backendUrl('/instagram/status'))
    return res.json()
  }
)

export const fetchInstagramMedia = createAsyncThunk(
  'instagram/fetchMedia',
  async () => {
    const res = await fetch(backendUrl('/instagram/media'))
    return res.json()
  }
)

interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

const instagramSlice = createSlice({
  name: 'instagram',
  initialState: {
    isConnected: false,
    account: null as any,
    media: [] as InstagramMedia[],
    rules: [] as any[],
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
