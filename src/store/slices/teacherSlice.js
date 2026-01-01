import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  students: [],
  classes: [],
  currentSession: null,
}

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload
    },
    setClasses: (state, action) => {
      state.classes = action.payload
    },
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload
    },
  },
})

export const { setStudents, setClasses, setCurrentSession } = teacherSlice.actions
export default teacherSlice.reducer
