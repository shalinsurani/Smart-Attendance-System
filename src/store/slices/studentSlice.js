import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  attendance: [],
  stats: null,
}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setAttendance: (state, action) => {
      state.attendance = action.payload
    },
    setStudentStats: (state, action) => {
      state.stats = action.payload
    },
  },
})

export const { setAttendance, setStudentStats } = studentSlice.actions
export default studentSlice.reducer
