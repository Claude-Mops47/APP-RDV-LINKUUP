import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { alertActions, appointmentActions } from "_store";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import { history } from "_helpers";

export { Edit };

function Edit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.item);

  // form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    date: Yup.date().required("Date is required"),
    commercial: Yup.string().required("Commercial is required"),
    status: Yup.string().required("Status is required"),
  });

  console.log(id);

  //   const formOptions = { resolver: yupResolver(validationSchema) };

  //   const { register, handleSubmit, reset, formState } = useForm(formOptions);
  //   const { errors, isSubmitting } = formState;

  useEffect(() => {
    dispatch(appointmentActions.getAppointment(id))
      .unwrap()
    //   .then((x) => reset(x));
  }, [dispatch, id]);
  console.log(appointments);


  const formik = useFormik({
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleChange = (event) => {
    formik.handleChange(event);
  };

  const handleBlur = (event) => {
    formik.handleBlur(event);
  };

  const onClose = () => {
    console.log("ok return");
  };

  async function handleSubmit(data) {
    dispatch(alertActions.clear());
    try {
      let message = "Appointment updated";
      //   await dispatch(appointmentActions.updateAppointment(id, data)).unwrap();
      console.log(data);
      //   history.navigate("/admin");
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  return (
    <>
    <h2>ok</h2>
      {/* {!(appointments?.loading || appointments?.error) && (
        // <form onSubmit={handleSubmit(onSubmit)}>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="mb-3 col">
              <label htmlFor="date">Scheduling Date:</label>
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
                locale={fr}
                autoComplete="off"
                className="form-control"
              />
              {formik.errors.date && formik.touched.date && (
                <div>{formik.errors.date}</div>
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
                <div>{formik.errors.name}</div>
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
                <div>{formik.errors.phone}</div>
              )}
            </div>

            <div className="mb-3 col">
              <label htmlFor="commercial">Sales Respresentative:</label>
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
                <option value="Annabelle Rodriguez">Annabelle Rodriguez</option>
                <option value="Benoît Chamboissier">Benoît Chamboissier</option>
                <option value="Freddy Tamboers">Freddy Tamboers</option>
                <option value="Julien Morel">Julien Morel</option>
                <option value="Théo Raymond">Théo Raymond</option>
                <option value="Aurore Diaollo">Aurore Diaollo</option>
                <option value="Simon Cadenne">Simon Cadenne</option>
              </select>
              {formik.errors.commercial && formik.touched.commercial && (
                <div>{formik.errors.commercial}</div>
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
              <div>{formik.errors.address}</div>
            )}
          </div>

          <br />

          <div className="modal-footer">
            <button
              type="submit"
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
        </form>

        // </form>
            )}*/}
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

