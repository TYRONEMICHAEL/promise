import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Squad } from '../services/squads'

interface MainState {
  isConnected: boolean
  solBalance: number
  squads: Squad[]
}

const initialState: MainState = {
  isConnected: false,
  solBalance: 0,
  squads: []
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
    },
    setSquads: (state, action: PayloadAction<SquadsPayloadObject>) => {
      state.squads = action.payload.squads
    }
  },
})

// Action creators are generated for each case reducer function
export const { setConnected, setAccountInfo, setSquads } = mainSlice.actions

type ConnectedPayloadObject = {
  isConnected: boolean 
}

type AccountInfoPayloadObject = {
  solBalance: number
}

type SquadsPayloadObject = {
  squads: Squad[]
}

export default mainSlice.reducer
