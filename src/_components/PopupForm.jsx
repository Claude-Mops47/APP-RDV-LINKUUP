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
    date: new Date(),
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
    phone: Yup.string().required("Le numéro de téléphone est requis"),
  });

  const handleSubmit = (values) => {
    dispatch(alertActions.clear());
    try {
      let message;
      dispatch(appointmentActions.createAppointment(values));
      message = "Appointment added";
      // console.log(values)

      onClose();
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

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="col-md-8 offset-md-1 mt-6">
        <div className="card">
          <div className="modal-header">
            <h2 className="modal-title">Add New Appointment</h2>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={formik.handleSubmit}>
            <div className="row"> 

              <div className="mb-3 col">
                <label htmlFor="date">Date de programmation :</label>
                <DatePicker
                  id="date"
                  name="date"
                  selected={formik.values.date}
                  onChange={(date) => formik.setFieldValue("date", date)}
                  dateFormat="PP à p"
                  showIcon
                  showTimeSelect
                  timeIntervals={30}
                  timeFormat="HH:mm"
                  isClearable
                  timeCaption="Heure"
                  locale={fr}
                  autoComplete="false"
                />
                {formik.errors.date && formik.touched.date && (
                  <div>{formik.errors.date}</div>
                )}
              </div>

              <div className="mb-3 col">
                <label htmlFor="nom">Nom du Docteur:</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="form-control"
                  autoComplete="false"
                />
                {formik.errors.name && formik.touched.name && (
                  <div>{formik.errors.name}</div>
                )}
              </div>
              </div>

             

              
              <div className="row"> 
              <div className="mb-3 col">
                <label htmlFor="phone">Téléphone du Docteur:</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className="form-control"
                  autoComplete="false"
                />
                {formik.errors.phone && formik.touched.phone && (
                  <div>{formik.errors.phone}</div>
                )}
              </div>

              <div className="mb-3 col">
                <label htmlFor="commercial">Commercial :</label>
                <select
                  id="commercial"
                  name="commercial"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.commercial}
                  className="form-control"
                  autoComplete="false"
                >
                <option value=''>Select Commercial</option>
                <option value='Annabelle Rodriguez'>Annabelle Rodriguez</option>
                <option value='Benoît Chamboissier'>Benoît Chamboissier</option>
                <option value='Freddy Tamboers'>Freddy Tamboers</option>
                <option value='Julien Morel'>Julien Morel</option>
                <option value='Théo Raymond'>Théo Raymond</option>
                <option value='Aurore Diaollo'>Aurore Diaollo</option>
                </select>
                {formik.errors.commercial && formik.touched.commercial && (
                  <div>{formik.errors.commercial}</div>
                )}
              </div>

              </div>
              <div>
                <label htmlFor="address">Adresse :</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                  className="form-control"
                  autoComplete="false"
                />
                {formik.errors.address && formik.touched.address && (
                  <div>{formik.errors.address}</div>
                )}
              </div>

              <br />
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={formik.handleSubmit}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
