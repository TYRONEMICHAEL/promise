import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Squad } from '../services/squads'
import { Match } from '../services/matches'

interface MainState {
  isConnected: boolean
  solBalance: number
  squads: Squad[]
  matches: Match[]
}

const initialState: MainState = {
  isConnected: false,
  solBalance: 0,
  squads: [],
  matches: []
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
    },
    setMatches: (state, action: PayloadAction<MatchesPayloadObject>) => {
      state.matches = action.payload.matches
    }
  },
})

// Action creators are generated for each case reducer function
export const { setConnected, setAccountInfo, setSquads, setMatches } = mainSlice.actions

type ConnectedPayloadObject = {
  isConnected: boolean 
}

type AccountInfoPayloadObject = {
  solBalance: number
}

type SquadsPayloadObject = {
  squads: Squad[]
}

type MatchesPayloadObject = {
  matches: Match[]
}

export default mainSlice.reducer
