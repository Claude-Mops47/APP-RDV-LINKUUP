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
    // <>
    //   <h2 className="text-2xl font-bold mb-4">Edit Appointment</h2>
    //   {!appointments?.loading && !appointments?.error && (
    //     <>
    //       <form onSubmit={formik.handleSubmit} className='edit-appointment-form'>
    //         <div className="grid grid-cols-2 gap-4">
    //           <div className="mb-3">
    //             <label htmlFor="date" className="block font-semibold">Scheduling Date</label>

    //             <DatePicker
    //               id="date"
    //               name="date"
    //               selected={date}
    //               onChange={handleDateChange}
    //               onBlur={handleBlur}
    //               showTimeSelect
    //               timeFormat="HH:mm"
    //               dateFormat="yyyy-MM-dd HH:mm"
    //               className="w-full px-4 py-2 border boerder-gay-300 rounded-md focus:ring-2 focus:ring-blue-500"
    //             />

    //             {formik.errors.date && formik.touched.date && (
    //               <div className="text-red-500"> {formik.errors.date}</div>
    //             )}
    //           </div>

    //           <div className="mb-3">
    //             <label htmlFor="name" className="block font-semibold">Full Name:</label>
    //             <input
    //               id="name"
    //               name="name"
    //               type="text"
    //               onChange={handleChange}
    //               onBlur={handleBlur}
    //               value={formik.values.name}
    //               className="w-full px-4 py-2 border boerder-gay-300 rounded-md focus:ring-2 focus:ring-blue-500"
    //               autoComplete="off"
    //             />
    //             {formik.errors.name && formik.touched.name && (
    //               <div className="text-red-500">{formik.errors.name}</div>
    //             )}
    //           </div>
    //         </div>

    //         <div className="grid grid-cols-2 gap-4">
    //           <div className="mb-3">
    //             <label htmlFor="phone" className="block mb-1 ">Phone:</label>
    //             <input
    //               id="phone"
    //               name="phone"
    //               type="text"
    //               onChange={handleChange}
    //               onBlur={handleBlur}
    //               value={formik.values.phone}
    //               className="w-full px-4 py-2 border boerder-gay-300 rounded-md focus:ring-2 focus:ring-blue-500"
    //               autoComplete="off"
    //               placeholder="Fixe / Mobile"
    //             />
    //             {formik.errors.phone && formik.touched.phone && (
    //               <div className="text-red-500">{formik.errors.phone}</div>
    //             )}
    //           </div>

    //           <div className="mb-3">
    //             <label htmlFor="commercial" className="block mb-1">Sales Representative:</label>
    //             <select
    //               id="commercial"
    //               name="commercial"
    //               type="text"
    //               onChange={handleChange}
    //               onBlur={handleBlur}
    //               value={formik.values.commercial}
    //               className="w-full px-4 py-2 border boerder-gay-300 rounded-md focus:ring-2 focus:ring-blue-500"
    //               autoComplete="off"
    //             >
    //               <option value="">Select Sales Representative</option>
    //               <option value="Annabelle Rodriguez">
    //                 Annabelle Rodriguez
    //               </option>
    //               <option value="Benoît Chamboissier">
    //                 Benoît Chamboissier
    //               </option>
    //               <option value="Freddy Tamboers">Freddy Tamboers</option>
    //               <option value="Julien Morel">Julien Morel</option>
    //               <option value="Théo Raymond">Théo Raymond</option>
    //               <option value="Aurore Diallo">Aurore Diallo</option>
    //               <option value="Simon Cadenne">Simon Cadenne</option>
    //             </select>
    //             {formik.errors.commercial && formik.touched.commercial && (
    //               <div className="text-red-500">{formik.errors.commercial}</div>
    //             )}
    //           </div>
    //         </div>

    //         <div className="mb-3">
    //           <label htmlFor="address" className="block mb-1">Address:</label>
    //           <textarea
    //             id="address"
    //             name="address"
    //             type="text"
    //             onChange={handleChange}
    //             onBlur={handleBlur}
    //             value={formik.values.address}
    //             className="w-full px-4 py-2 border boerder-gay-300 rounded-md focus:ring-2 focus:ring-blue-500"
    //             autoComplete="off"
    //           />
    //           {formik.errors.address && formik.touched.address && (
    //             <div className="text-red-500">{formik.errors.address}</div>
    //           )}
    //         </div>

    //         <div className="mb-3">
    //           <label htmlFor="status" className="block mb-1">Status:</label>
    //           <select
    //             id="status"
    //             name="status"
    //             type="text"
    //             onChange={handleChange}
    //             onBlur={handleBlur}
    //             value={formik.values.status}
    //             className="w-full px-4 py-2 border boerder-gay-300 rounded-md focus:ring-2 focus:ring-blue-500"
    //             autoComplete="off"
    //           >
    //             <option value="">Select Status</option>
    //             <option value="Confirmé">Confirmé</option>
    //             <option value="En Attente">En Attente</option>
    //             <option value="Annulé">Annulé</option>
    //             <option value="Pas Intéressé">Pas Intéressé</option>
    //             <option value="A Rappeler">A Rappeler</option>
    //             <option value="Date Eloignée">Date Eloignée</option>
    //           </select>
    //           {formik.errors.status && formik.touched.status && (
    //             <div className="text-red-500">{formik.errors.status}</div>
    //           )}
    //         </div>

    //       </form>

    //
    //     </>
    //   )}

    // </>

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
                <form onSubmit={formik.handleSubmit}  className="lg:col-span-2">
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

                        {formik.errors.date && formik.touched.date && (
                          <div className="text-red-500">
                            {" "}
                            {formik.errors.date}
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
                          value={formik.values.status}
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
                      {formik.errors.status && formik.touched.status && (
                        <div className="text-red-500">
                          {formik.errors.status}
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
                        value={formik.values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                      />
                      {formik.errors.name && formik.touched.name && (
                        <div className="text-red-500">{formik.errors.name}</div>
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
                        value={formik.values.address}
                        autoComplete="off"
                      />

                      {formik.errors.address && formik.touched.address && (
                        <div className="text-red-500">
                          {formik.errors.address}
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
                        value={formik.values.phone}
                        placeholder="fixe / mobile"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                      />
                      {formik.errors.phone && formik.touched.phone && (
                        <div className="text-red-500">
                          {formik.errors.phone}
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
                                  onClick: () => formik.submitForm(),
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
                                      appointmentActions.deleteAppointment(id)
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
