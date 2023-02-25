import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConnectedPayloadObject } from '../interfaces'

interface MainState {
  isConnected: boolean
}

const initialState: MainState = {
  isConnected: false
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<ConnectedPayloadObject>) => {
      state.isConnected = action.payload.isConnected
    },
  },
})

// Action creators are generated for each case reducer function
export const { setConnected } = mainSlice.actions

export default mainSlice.reducer
