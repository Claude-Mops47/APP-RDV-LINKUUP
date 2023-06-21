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
  // let updateTimeout = null;
  let getAppointmentTimeout = null;
  let getAppointmentByUserTimeout = null;
  let getAllAppointmentsTimeout = null;

  return {
    // getAllAppointments: createAsyncThunk(
    //   `${name}/getAllAppointments`,
    //   async () => await fetchWrapper.get(`${baseUrl}`)
    // ),

    getAllAppointments: createAsyncThunk(
      `${name}/getAllAppointments`,
      async (_, { getState }) => {
        const { list } = getState().appointments;

        // Vérifier si les données sont déjà présentes dans le cache
        if (list && list.value) {
          return list.value;
        }

        // Annuler l'appel en cours s'il existe
        if (getAllAppointmentsTimeout) {
          clearTimeout(getAllAppointmentsTimeout);
        }

        // Récupérer les données après un délai de 5 minutes
        return new Promise((resolve, reject) => {
          getAllAppointmentsTimeout = setTimeout(async () => {
            try {
              const response = await fetchWrapper.get(`${baseUrl}`);
              resolve(response);
            } catch (error) {
              console.log(error);
              reject("Une erreur s'est produite lors de la récupération des rendez-vous. Veuillez réessayer plus tard.");
            }
          }, 500);
        });
      }
    ),

    createAppointment: createAsyncThunk(
      `${name}/createAppointment`,
      async (appointment) =>
        await fetchWrapper.post(`${baseUrl}/add-new`, appointment)
    ),

    // getAppointment: createAsyncThunk(
    //   `${name}/getAppointment`,
    //   async (id) => await fetchWrapper.get(`${baseUrl}/${id}`)
    // ),
    // getAppointmentByUser: createAsyncThunk(
    //   `${name}/getAppointmentByUser`,
    //   async (id) => await fetchWrapper.get(`${baseUrl}/user/${id}`)
    // ),

    getAppointment: createAsyncThunk(
      `${name}/getAppointment`,
      async (id, { getState }) => {
        const { item } = getState().appointments;

        // Vérifier si les données sont déjà présentes dans le cache
        if (item && item.value && item.value.id === id) {
          return item.value;
        }

        // Annuler l'appel en cours s'il existe
        if (getAppointmentTimeout) {
          clearTimeout(getAppointmentTimeout);
        }

        // Récupérer les données après un délai de 5 minutes
        return new Promise((resolve, reject) => {
          getAppointmentTimeout = setTimeout(async () => {
            try {
              const response = await fetchWrapper.get(`${baseUrl}/${id}`);
              resolve(response);
            } catch (error) {
              reject(error);
            }
          }, 500);
        });
      }
    ),

    getAppointmentByUser: createAsyncThunk(
      `${name}/getAppointmentByUser`,
      async (id, { getState }) => {
        const { item } = getState().appointments;

        // Vérifier si les données sont déjà présentes dans le cache
        if (item && item.value && item.value.userId === id) {
          return item.value;
        }

        // Annuler l'appel en cours s'il existe
        if (getAppointmentByUserTimeout) {
          clearTimeout(getAppointmentByUserTimeout);
        }

        // Récupérer les données après un délai de 5 minutes
        return new Promise((resolve, reject) => {
          getAppointmentByUserTimeout = setTimeout(async () => {
            try {
              const response = await fetchWrapper.get(`${baseUrl}/user/${id}`);
              resolve(response);
            } catch (error) {
              reject(error);
            }
          }, 500);
        });
      }
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
