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

export function Edit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.item);
  const [date, setDate] = useState(null);

  // Form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    date: Yup.date().required("Date is required"),
    commercial: Yup.string().required("Commercial is required"),
    // status: Yup.string().required("Status is required"),
    phone: Yup.string().test("phone", "Les numéros sont requis", (value) => {
      if (!value) return null;
      const values = value.split(" / ").map((val) => val.trim());
      return values.length === 1 || values.length === 2;
    }),
  });

  useEffect(() => {
    dispatch(appointmentActions.getAppointment(id))
      .unwrap()
      .then((appointment) => {
        formik.setValues({
          ...appointment,
          date: appointment.date ? new Date(appointment.date) : null,
        });
        setDate(appointment.date ? new Date(appointment.date) : null);
      });
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      address: "",
      date: null,
      commercial: "",
      // status: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleDateChange = (date) => {
    setDate(date);
    formik.setFieldValue("date", date.toISOString());
  };

  const handleChange = (event) => {
    formik.handleChange(event);
  };

  const handleBlur = (event) => {
    formik.handleBlur(event);
  };

  const handleCancel = () => {
    history.navigate("/admin");
  };

  async function handleSubmit(values) {
    dispatch(alertActions.clear());
    try {
      let message = "Appointment updated";

      const phoneValues = values.phone
        ? values.phone.split(" / ").map((val) => val.trim())
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

      console.log(updateValues);
      await dispatch(
        appointmentActions.updateAppointment({ id: id, values: updateValues })
      );
      // .unwrap();
      history.navigate("/admin");
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  return (
    <>
      <h2>Edit Appointment</h2>
      {!appointments?.loading && !appointments?.error && (
        <>
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="date">Scheduling Date:</label>

                <DatePicker
                  id="date"
                  name="date"
                  selected={date}
                  onChange={handleDateChange}
                  onBlur={handleBlur}
                  showTimeSelect
                  timeFormat="HH:mm"
                  dateFormat="yyyy-MM-dd HH:mm"
                  className="form-control"
                />

                {formik.errors.date && formik.touched.date && (
                  <div className="error"> {formik.errors.date}</div>
                )}
              </div>

              <div className="mb-3 col">
                <label htmlFor="name">Full Name:</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formik.values.name}
                  className="form-control"
                  autoComplete="off"
                />
                {formik.errors.name && formik.touched.name && (
                  <div className="error">{formik.errors.name}</div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="phone">Phone:</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formik.values.phone}
                  className="form-control"
                  autoComplete="off"
                  placeholder="Fixe / Mobile"
                />
                {formik.errors.phone && formik.touched.phone && (
                  <div className="error">{formik.errors.phone}</div>
                )}
              </div>

              <div className="mb-3 col">
                <label htmlFor="commercial">Sales Representative:</label>
                <select
                  id="commercial"
                  name="commercial"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formik.values.commercial}
                  className="form-control"
                  autoComplete="off"
                >
                  <option value="">Select Sales Representative</option>
                  <option value="Annabelle Rodriguez">
                    Annabelle Rodriguez
                  </option>
                  <option value="Benoît Chamboissier">
                    Benoît Chamboissier
                  </option>
                  <option value="Freddy Tamboers">Freddy Tamboers</option>
                  <option value="Julien Morel">Julien Morel</option>
                  <option value="Théo Raymond">Théo Raymond</option>
                  <option value="Aurore Diaollo">Aurore Diaollo</option>
                  <option value="Simon Cadenne">Simon Cadenne</option>
                </select>
                {formik.errors.commercial && formik.touched.commercial && (
                  <div className="error">{formik.errors.commercial}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address">Address:</label>
              <input
                id="address"
                name="address"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formik.values.address}
                className="form-control"
                autoComplete="off"
              />
              {formik.errors.address && formik.touched.address && (
                <div className="error">{formik.errors.address}</div>
              )}
            </div>

            <div>
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formik.values.status}
                className="form-control"
                autoComplete="off"
              >
                <option value="">Select Status</option>
                <option value="Confirmé">Confirmé</option>
                <option value="En Attente">En Attente</option>
                <option value="Annulé">Annulé</option>
                <option value="Pas Intéressé">Pas Intéressé</option>
                <option value="A Rappeler">A Rappeler</option>
                <option value="Date Eloignée">Date Eloignée</option>
              </select>
              {formik.errors.status && formik.touched.status && (
                <div className="error">{formik.errors.status}</div>
              )}
            </div>

            <br />
          </form>

          <div className="modal-footer">
            <button
              type="button"
              onClick={() => {
                confirmAlert({
                  title: "Confirm update",
                  message: "Are you sure you want to update this appointment?",
                  buttons: [
                    {
                      label: "Yes",
                      onClick: () => formik.submitForm(),
                    },
                    {
                      label: "No",
                      onClick: () => {},
                    },
                  ],
                });
              }}
              className="btn btn-sm btn-outline-success me-1"
            >
              Update
            </button>

            <button
              type="button"
              onClick={() => {
                confirmAlert({
                  title: "Confirm deletion",
                  message: "Are you sure you want to delete this appointment?",
                  buttons: [
                    {
                      label: "Yes",
                      onClick: () => {
                        dispatch(appointmentActions.deleteAppointment(id));
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
              className="btn btn-sm btn-outline-danger me-1"
            >
              Delete
            </button>

            <button
              type="button"
              // className="btn btn-outline-secondary"
              className="btn btn-sm btn-outline-secondary me-1"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </>
      )}
      {appointments?.loading && (
        <div className="text-center m-5">
          <span className="spinner-border spinner-border-lg align-center"></span>
        </div>
      )}
      {appointments?.error && (
        <div className="text-center m-5">
          <div className="text-danger">
            Error loading appointment: {appointments.error}
          </div>
        </div>
      )}
    </>
  );
}
