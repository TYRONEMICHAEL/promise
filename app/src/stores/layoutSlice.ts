import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LayoutState {
  isAsideMobileExpanded: boolean
  isAsideLgActive: boolean
  isXl: boolean
  isLg: boolean
  isMd: boolean
}

const initialState: LayoutState = {
  isAsideMobileExpanded: false,
  isAsideLgActive: true,

  /* Breakpoints */
  isXl: false,
  isLg: false,
  isMd: false,
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    asideMobileToggle: (state) => {
      state.isAsideMobileExpanded = !state.isAsideMobileExpanded
    },
    setIsAsideMobileExpanded: (state, action: PayloadAction<boolean>) => {
      state.isAsideMobileExpanded = action.payload
    },
    asideLgToggle: (state) => {
      state.isAsideLgActive = !state.isAsideLgActive
    },
    responsiveLayoutControl: (state) => {
      state.isXl = window.innerWidth >= 1280
      state.isLg = window.innerWidth >= 1024
      state.isMd = window.innerWidth >= 768
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  asideMobileToggle,
  setIsAsideMobileExpanded,
  asideLgToggle,
  responsiveLayoutControl,
} = layoutSlice.actions

export default layoutSlice.reducer
