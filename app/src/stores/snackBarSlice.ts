import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SnackBarMessage, SnackBarPushedMessage } from '../interfaces/premium'

interface SnackBarState {
  messages: SnackBarMessage[]
}

const initialState: SnackBarState = {
  messages: [],
}

export const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    pushMessage: (state, action: PayloadAction<SnackBarPushedMessage>) => {
      state.messages.push({
        timestamp: Date.now(),
        ...action.payload,
      })
    },
    cancelMessage: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter((message) => message.timestamp !== action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { pushMessage, cancelMessage } = snackBarSlice.actions

export default snackBarSlice.reducer
