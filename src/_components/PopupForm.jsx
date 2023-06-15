import React from "react";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { alertActions, appointmentActions } from "_store";

const ModalForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const initialValues = {
    date: "",
    name: "",
    address: "",
    commercial: "",
    phone: "",
  };

  const validationSchema = Yup.object().shape({
    date: Yup.date().required("La date est requise"),
    name: Yup.string().required("Le nom est requis"),
    address: Yup.string().required("L'adresse est requise"),
    commercial: Yup.string().required("Le commercial est requis"),
    // phone: Yup.string().required("Les numéros sont requis"),
    phone: Yup.string().test("phone", "Les numéros sont requis", (value) => {
      if (!value) return null;
      const values = value.split(" / ").map((val) => val.trim());
      return values.length === 1 || values.length === 2;
    }),
  });

  const handleSubmit = async (values) => {
    dispatch(alertActions.clear());
    try {
      const phoneValues = values.phone
        ? values.phone.split(" / ").map((val) => val.trim())
        : [];
      const updateValues = {
        ...values,
        phone: phoneValues,
      };
      await dispatch(appointmentActions.createAppointment(updateValues));
      const message = "Appointment added";
      onClose();
      setTimeout(() => {
        dispatch(alertActions.clear());
      }, 5000);
      dispatch(alertActions.success({ message, showAtterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleChange = (event) => {
    formik.handleChange(event);
  };

  const handleBlur = (event) => {
    formik.handleBlur(event);
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      {/*       
      <div className="fixed inset-0 flex items-center justufy-center z-50">
      <div className="bg-gray-700  bg-opacity-75 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20" >
          <div className="relative py-4 md:px-6 lg:px-8 px-2 md:px-6  bg-white shadow-md rounded border border-gray-400"> */}

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-gray-700 bg-opacity-75 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="flex items-center justify-center min-h-screen">
              {/* <div className="relative w-full max-w-lg flex-grow"> */}
              <div className="w-full max-w-lg flex-grow">
                <div className="py-4 md:py-6 lg:py-8 px-2 md:px-6 bg-white shadow-md rounded-lg border border-gray-400 h-96 overfow-y-auto">
                  <h2 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                    Add New Appointment
                  </h2>

                  <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-wrap mb-6">
                      <div className="w-full md:w-1/2 pr-4 md-6 md:mb-0">
                        <label
                          htmlFor="date"
                          className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                        >
                          Scheduling Date
                        </label>
                        <DatePicker
                          className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                          id="date"
                          name="date"
                          selected={formik.values.date}
                          onChange={(date) =>
                            formik.setFieldValue("date", date)
                          }
                          dateFormat="PP à p"
                          showIcon
                          showTimeSelect
                          timeIntervals={30}
                          timeFormat="HH:mm"
                          isClearable
                          locale={fr}
                          autoComplete="off"
                        />
                        {formik.errors.date && formik.touched.date && (
                          <div>{formik.errors.date}</div>
                        )}
                      </div>
                      <div className="w-full md:w-1/2 pl-4">
                        <label
                          htmlFor="commercial"
                          className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                        >
                          Sales Respresentative
                        </label>
                        <div className="relative font-normal text-xs sm:text-sm flex items-center text-gray-600">
                          <select
                            className="cursor-pointer focus:text-indigo-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md focus:ring-indigo-600 w-full appearance-none pr-8 py-1 pl-2"
                            id="commercial"
                            name="commercial"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formik.values.commercial}
                            autoComplete="off"
                          >
                            <option value="">
                              Select Sales Representative
                            </option>
                            <option value="Annabelle Rodriguez">
                              Annabelle Rodriguez
                            </option>
                            <option value="Benoît Chamboissier">
                              Benoît Chamboissier
                            </option>
                            <option value="Freddy Tamboers">
                              Freddy Tamboers
                            </option>
                            <option value="Julien Morel">Julien Morel</option>
                            <option value="Théo Raymond">Théo Raymond</option>
                            <option value="Aurore Diallo">Aurore Diallo</option>
                            <option value="Simon Cadenne">Simon Cadenne</option>
                          </select>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="pointer-events-none absolute right-0 mr-2 icon icon-tabler icon-tabler-chevron-down"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z"></path>
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                        {formik.errors.commercial &&
                          formik.touched.commercial && (
                            <div>{formik.errors.commercial}</div>
                          )}
                      </div>

                      <label
                        htmlFor="name"
                        className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                      >
                        Full Name
                      </label>
                      <input
                        className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                        placeholder="James"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={formik.values.name}
                        autoComplete="off"
                      />
                      {formik.errors.name && formik.touched.name && (
                        <div>{formik.errors.name}</div>
                      )}

                      <label
                        htmlFor="phone"
                        className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                      >
                        Phone
                      </label>
                      <input
                        className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                        id="phone"
                        name="phone"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={formik.values.phone}
                        autoComplete="off"
                        placeholder="Fixe / Mobile"
                      />
                      {formik.errors.phone && formik.touched.phone && (
                        <div>{formik.errors.phone}</div>
                      )}

                      <label
                        htmlFor="address"
                        className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                      >
                        Address
                      </label>
                      <textarea
                        className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full py-2 flex items-center pl-3 text-sm border-gray-300 rounded border"
                        id="address"
                        placeholder="Maarif, Casablanca"
                        name="address"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={formik.values.address}
                        autoComplete="off"
                      />
                      {formik.errors.address && formik.touched.address && (
                        <div>{formik.errors.address}</div>
                      )}

                      <label
                        htmlFor="comment"
                        className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                      >
                        Comment
                      </label>
                      <textarea
                        className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full py-2 flex items-center pl-3 text-sm border-gray-300 rounded border"
                        id="comment"
                        name="comment"
                        placeholder="No comment please!"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        // value={formik.values.address}
                        autoComplete="off"
                      />

                      {/* {formik.errors.address && formik.touched.address && ( */}
                      {/* <div>{formik.errors.address}</div> */}
                      {/* )} */}

                      <div className="flex items-center justify-start w-full">
                        <button
                          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                          type="button"
                          onClick={formik.handleSubmit}
                        >
                          Save
                        </button>
                        <button
                          className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                          type="button"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <button
                      className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"
                      onClick={onClose}
                      aria-label="close modal"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-x"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
