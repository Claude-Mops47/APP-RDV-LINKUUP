import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { alertActions, appointmentActions } from "_store";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { history } from "_helpers";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const NAME_REQUIRED = "Name is required";
const ADDRESS_REQUIRED = "Address is required";
const DATE_REQUIRED = "Date is required";
const COMMERCIAL_REQUIRED = "Commercial is required";
const PHONE_REQUIRED = "Phone is required";

export function Edit() {
  const { id: appointmentID } = useParams();
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.item);
  const [date, setDate] = useState(null);

  // Form
  // function validateAppointment(values) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(NAME_REQUIRED),
    address: Yup.string().required(ADDRESS_REQUIRED),
    date: Yup.date().required(DATE_REQUIRED),
    commercial: Yup.string().required(COMMERCIAL_REQUIRED),
    // status: Yup.string().required("Status is required"),
    phone: Yup.string()
      .transform((value) => (value ? value.toString() : ""))
      .test("phone", PHONE_REQUIRED, (value) => {
        if (!value) return null;
        const values = value.split(" / ").map((val) => val.trim());
        return values.length === 1 || values.length === 2;
      }),
  });
  // return validationSchema.validateSync(values, { abortEarly: false });
  // }
  const appointmentForm = useFormik({
    initialValues: {
      name: "",
      phone: "",
      address: "",
      date: null,
      commercial: "",
      // status: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    dispatch(appointmentActions.getAppointment(appointmentID))
      .unwrap()
      .then((appointment) => {
        appointmentForm.setValues({
          ...appointment,
          date: appointment.date ? new Date(appointment.date) : null,
        });
        setDate(appointment.date ? new Date(appointment.date) : null);
      });
  }, [dispatch, appointmentID]);

  const handleDateChange = (date) => {
    setDate(date);
    appointmentForm.setFieldValue("date", date.toISOString());
  };

  const handleChange = (event) => {
    appointmentForm.handleChange(event);
  };

  const handleBlur = (event) => {
    appointmentForm.handleBlur(event);
  };

  const handleCancel = () => {
    history.navigate("/admin");
  };

  async function handleSubmit(values) {
    dispatch(alertActions.clear());
    try {
      let message = "Appointment updated";
      const phoneValues = values.phone
        ? values.phone
            .toString()
            .split(" / ")
            .map((val) => val.trim())
        : [];
      const date = values.date;
      const name = values.name;
      const address = values.address;
      const commercial = values.commercial;
      const updateValues = {
        name: name,
        date: date,
        address: address,
        commercial: commercial,
        phone: phoneValues,
      };

      // validateAppointment(updateValues);
      await validationSchema.validateSync(updateValues, { abortEarly: false });

      await dispatch(
        appointmentActions.updateAppointment({
          id: appointmentID,
          values: updateValues,
        })
      );
      history.navigate("/admin");
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessage = error.message;
        dispatch(alertActions.error(errorMessage));
      } else {
        dispatch(alertActions.error(error));
      }
    }
  }

  return (
    <>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-xl text-gray-600">
              Edit Appointment
            </h2>
            <p className="text-gray-500 mb-6">
              Form is mobile responsive. Give it a try.
            </p>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Appointment Details</p>
                  <p>Please fill out all the fields.</p>
                </div>
                {!appointments?.loading && !appointments?.error && (
                  <form
                    onSubmit={appointmentForm.handleSubmit}
                    className="lg:col-span-2"
                  >
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-2">
                        <label htmlFor="date">Date</label>
                        <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                          <DatePicker
                            id="date"
                            name="date"
                            selected={date}
                            onChange={handleDateChange}
                            onBlur={handleBlur}
                            showTimeSelect
                            showIcon
                            timeFormat="HH:mm"
                            dateFormat="yyyy-MM-dd HH:mm"
                            class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          />

                          {appointmentForm.errors.date &&
                            appointmentForm.touched.date && (
                              <div className="text-red-500">
                                {" "}
                                {appointmentForm.errors.date}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="status">Status</label>
                        <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                          <select
                            name="status"
                            id="status"
                            placeholder="Status"
                            className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={appointmentForm.values.status}
                          >
                            <option value="">Select Status</option>
                            <option value="Confirmé">Confirmé</option>
                            <option value="En Attente">En Attente</option>
                            <option value="Annulé">Annulé</option>
                            <option value="Pas Intéressé">Pas Intéressé</option>
                            <option value="A Rappeler">A Rappeler</option>
                            <option value="Date Eloignée">Date Eloignée</option>
                          </select>
                        </div>
                        {appointmentForm.errors.status &&
                          appointmentForm.touched.status && (
                            <div className="text-red-500">
                              {appointmentForm.errors.status}
                            </div>
                          )}
                      </div>

                      <div className="md:col-span-5">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={appointmentForm.values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        {appointmentForm.errors.name &&
                          appointmentForm.touched.name && (
                            <div className="text-red-500">
                              {appointmentForm.errors.name}
                            </div>
                          )}
                      </div>
                      {/* 
                    <div className="md:col-span-5">
                      <label for="email">Email Address</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value=""
                        placeholder="email@domain.com"
                      />
                    </div> */}

                      <div className="md:col-span-3">
                        <label htmlFor="address">Address / Street</label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={appointmentForm.values.address}
                          autoComplete="off"
                        />

                        {appointmentForm.errors.address &&
                          appointmentForm.touched.address && (
                            <div className="text-red-500">
                              {appointmentForm.errors.address}
                            </div>
                          )}
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={appointmentForm.values.phone}
                          placeholder="fixe / mobile"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        {appointmentForm.errors.phone &&
                          appointmentForm.touched.phone && (
                            <div className="text-red-500">
                              {appointmentForm.errors.phone}
                            </div>
                          )}
                      </div>

                      <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end">
                          <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2"
                            type="button"
                            onClick={() => {
                              confirmAlert({
                                title: "Confirm update",
                                message:
                                  "Are you sure you want to update this appointment?",
                                buttons: [
                                  {
                                    label: "Yes",
                                    onClick: () => appointmentForm.submitForm(),
                                  },
                                  {
                                    label: "No",
                                    onClick: () => {},
                                  },
                                ],
                              });
                            }}
                          >
                            Update
                          </button>

                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2"
                            type="button"
                            onClick={() => {
                              confirmAlert({
                                title: "Confirm deletion",
                                message:
                                  "Are you sure you want to delete this appointment?",
                                buttons: [
                                  {
                                    label: "Yes",
                                    onClick: () => {
                                      dispatch(
                                        appointmentActions.deleteAppointment(
                                          appointmentID
                                        )
                                      );
                                      history.navigate("/admin");
                                    },
                                  },
                                  {
                                    label: "No",
                                    onClick: () => {},
                                  },
                                ],
                              });
                            }}
                          >
                            Delete
                          </button>

                          <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2"
                            type="button"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                {appointments?.loading && (
                  <div className="h-screen bg-white">
                    <div className="flex justify-center items-center h-full">
                      <img
                        className="h-16 w-16"
                        src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
                        alt=""
                      />
                    </div>
                  </div>
                )}
                {appointments?.error && (
                  <div className="h-screen bg-white">
                    <div className="text-red-500">
                      Error loading appointment: {appointments.error}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
