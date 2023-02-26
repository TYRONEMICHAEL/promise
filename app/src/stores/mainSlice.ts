import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MainState {
  isConnected: boolean
  solBalance: number
}

const initialState: MainState = {
  isConnected: false,
  solBalance: 0
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<ConnectedPayloadObject>) => {
      state.isConnected = action.payload.isConnected
    },
    setAccountInfo: (state, action: PayloadAction<AccountInfoPayloadObject>) => {
      state.solBalance = action.payload.solBalance
    }
  },
})

// Action creators are generated for each case reducer function
export const { setConnected, setAccountInfo } = mainSlice.actions

type ConnectedPayloadObject = {
  isConnected: boolean 
}

type AccountInfoPayloadObject = {
  solBalance: number
}

export default mainSlice.reducer
