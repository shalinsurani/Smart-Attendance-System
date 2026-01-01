import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  organization: null,
  teachers: [],
  stats: null,
}

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganization: (state, action) => {
      state.organization = action.payload
    },
    setTeachers: (state, action) => {
      state.teachers = action.payload
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
  },
})

export const { setOrganization, setTeachers, setStats } = organizationSlice.actions

// Selectors
export const selectOrganization = (state) => state.organization.organization
export const selectOrganizationType = (state) => state.organization.organization?.type || 'school'
export const selectTeachers = (state) => state.organization.teachers
export const selectStats = (state) => state.organization.stats

export default organizationSlice.reducer
