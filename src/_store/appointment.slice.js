import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const name = "appointments";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

export const appointmentActions = { ...slice.actions, ...extraActions };
export const appointmentsReducer = slice.reducer;

function createInitialState() {
  return {
    list: null,
    item: null,
    deletedAppointment: null,
    updatedAppointment: null,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/appointments`;

  return {
    getAllAppointments: createAsyncThunk(
      `${name}/getAllAppointments`,
      async () => await fetchWrapper.get(`${baseUrl}`)
    ),
    createAppointment: createAsyncThunk(
      `${name}/createAppointment`,
      async (appointment) =>
        await fetchWrapper.post(`${baseUrl}/add-new`, appointment)
    ),

    getAppointment: createAsyncThunk(
      `${name}/getAppointment`,
      async (id) => await fetchWrapper.get(`${baseUrl}/${id}`)
    ),
    getAppointmentByUser: createAsyncThunk(
      `${name}/getAppointmentByUser`,
      async (id) => await fetchWrapper.get(`${baseUrl}/user/${id}`)
    ),

    updateAppointment: createAsyncThunk(
      `${name}/updateAppointment`,
      async ({ id, values }, { dispatch }) => {
        await fetchWrapper.put(`${baseUrl}/${id}`, values);
        // dispatch(appointmentActions.setUpdatedAppointment({ id, data }));
      }
    ),
    deleteAppointment: createAsyncThunk(
      `${name}/deleteAppointment`,
      async (id, { getState, dispatch }) => {
        await fetchWrapper.delete(`${baseUrl}/${id}`);
        // dispatch(appointmentActions.setDeletedAppointment(id));
      }
    ),
  };
}

function createExtraReducers() {
  return (builder) => {
    builder
      .addCase(extraActions.getAllAppointments.pending, (state) => {
        state.list = { loading: true };
      })
      .addCase(extraActions.getAllAppointments.fulfilled, (state, action) => {
        state.list = { value: action.payload };
      })
      .addCase(extraActions.getAllAppointments.rejected, (state, action) => {
        state.list = { error: action.error };
      })

      .addCase(extraActions.getAppointment.pending, (state) => {
        state.item = { loading: true };
      })
      .addCase(extraActions.getAppointment.fulfilled, (state, action) => {
        state.item = { value: action.payload };
      })
      .addCase(extraActions.getAppointment.rejected, (state, action) => {
        state.item = { error: action.error };
      })

      .addCase(extraActions.getAppointmentByUser.pending, (state) => {
        state.item = { loading: true };
      })
      .addCase(extraActions.getAppointmentByUser.fulfilled, (state, action) => {
        state.item = { value: action.payload };
      })
      .addCase(extraActions.getAppointmentByUser.rejected, (state, action) => {
        state.item = { error: action.error };
      })

      .addCase(extraActions.updateAppointment.pending, (state) => {
        state.item = { ...state.item, updating: true };
      })
      .addCase(extraActions.updateAppointment.fulfilled, (state, action) => {
        state.item = { ...state.item, value: action.payload, updating: false };
      })
      .addCase(extraActions.updateAppointment.rejected, (state, action) => {
        state.item = { ...state.item, error: action.error, updating: false };
      })
      .addCase(extraActions.deleteAppointment.fulfilled, (state, action) => {
        state.deletedAppointment = action.payload;
      });
  };
}
