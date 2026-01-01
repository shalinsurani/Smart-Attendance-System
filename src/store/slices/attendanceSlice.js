import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  records: [],
  filters: {
    startDate: null,
    endDate: null,
    studentId: null,
    classId: null,
  },
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setRecords: (state, action) => {
      state.records = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const { setRecords, setFilters } = attendanceSlice.actions
export default attendanceSlice.reducer
