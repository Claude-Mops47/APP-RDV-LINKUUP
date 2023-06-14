import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

import { history } from "_helpers";
import { userActions, alertActions } from "_store";

export { AddEdit };

function AddEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState();
  const dispatch = useDispatch();
  const user = useSelector((x) => x.users?.item);

  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().required("Email is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      // password optional in edit mode
      .concat(id ? null : Yup.string().required("Password is required"))
      .min(6, "Password must be at least 6 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (id) {
      setTitle("Edit User");
      // fetch user details into redux state and
      // populate form fields with reset()
      dispatch(userActions.getById(id))
        .unwrap()
        .then((user) => reset(user));
    } else {
      setTitle("Add User");
    }
  }, []);

  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      // create or update user based on id param
      let message;
      if (id) {
        await dispatch(userActions.update({ id, data })).unwrap();
        message = "User updated";
      } else {
        await dispatch(userActions.register(data)).unwrap();
        message = "User added";
      }

      // redirect to user list with success message
      history.navigate("/users");
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  const handleCancle = () => {
    history.navigate("/users");
  };

  return (
    <>
      <div className=" py-1 bg-blueGray-50">
        <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">{title}</h6>
                <button
                  className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleCancle}
                >
                  Cancel
                </button>
              </div>
            </div>
            <br/>

            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              {!(user?.loading || user?.error) && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="firstName"
                        >
                          First Name
                        </label>
                        <input
                        id='firstName'
                          name="firstName"
                          type="text"
                          {...register("firstName")}
                          className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150
                            ${errors.firstName ? "is-invalid" : ""}`}
                        />
                        <div className="invalid-feedback">
                          {errors.firstName?.message}
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label htmlFor="lastName" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Last Name
                        </label>
                        <input
                        id="lastName"
                          name="lastName"
                          type="text"
                          {...register("lastName")}
                          className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150
                         ${errors.lastName ? "is-invalid" : ""}`}
                        />
                        <div className="invalid-feedback">
                          {errors.lastName?.message}
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label htmlFor="email" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Email
                        </label>
                        <input
                        id="email"
                          name="email"
                          type="text"
                          autoComplete="off"
                          {...register("email")}
                          className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 
                        ${errors.email ? "is-invalid" : ""}`}
                        />
                        <div className="invalid-feedback">
                          {errors.email?.message}
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label htmlFor="role" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Role
                        </label>
                        <select
                        id="role"
                          name="role"
                          {...register("role")}
                          className={`cursor-pointer focus:text-indigo-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md focus:ring-indigo-600 w-full appearance-none pr-8 py-1 pl-2
                        ${errors.role ? "is-invalid" : ""}`}
                        >
                          <option value=""></option>
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <div className="invalid-feedback">
                          {errors.role?.message}
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label htmlFor="password" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Password
                          {id && (
                            <em className="ml-1">
                              (Leave blank to keep the same password)
                            </em>
                          )}
                        </label>
                        <input
                        id="password"
                          name="password"
                          type="password"
                          {...register("password")}
                          className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150  
                        ${errors.password ? "is-invalid" : ""}`}
                        />
                        <div className="invalid-feedback">
                          {errors.password?.message}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    >
                      {isSubmitting && (
                        <span className="spinner-border spinner-border-sm me-1"></span>
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => reset()}
                      type="button"
                      disabled={isSubmitting}
                      className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              )}
              {user?.loading && (
                <div className="text-center m-5">
                  <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
              )}
              {user?.error && (
                <div className="text-center m-5">
                  <div className="text-danger">
                    Error loading user: {user.error}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
