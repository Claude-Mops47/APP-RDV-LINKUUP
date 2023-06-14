import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import { authActions } from "_store";

export { Login };

function Login() {
  const dispatch = useDispatch();

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ email, password }) {
    return dispatch(authActions.login({ email, password }));
  }

  return (
    // <div className="col-md-6 offset-md3 mt-5">
    //   <div className="alert alert-info">LINKUUP-MEDICAL</div>
    //   <div className="card ">
    //     <h4 className="card-header">Log-in</h4>
    //     <div className="card-body">
    //       <form onSubmit={handleSubmit(onSubmit)}>
    //         <div className="mb-3">
    //           <label className="form-label">Email</label>
    //           <input
    //             name="email"
    //             type="text"
    //             {...register("email")}
    //             className={`form-control ${
    //               errors.username ? "is-invalid" : ""
    //             }`}
    //           />
    //           <div className="invalid-feedback">{errors.email?.message}</div>
    //         </div>
    //         <div className="mb-3">
    //           <label className="form-label">Password</label>
    //           <input
    //             name="password"
    //             type="password"
    //             {...register("password")}
    //             className={`form-control ${
    //               errors.password ? "is-invalid" : ""
    //             }`}
    //           />
    //           <div className="invalid-feedback">{errors.password?.message}</div>
    //         </div>
    //         <button disabled={isSubmitting} className="btn btn-primary">
    //           {isSubmitting && (
    //             <span className="spinner-border spinner-border-sm me-1"></span>
    //           )}
    //           Login
    //         </button>
    //         {/* <Link to="../register" className="btn btn-link">Register</Link> */}
    //       </form>
    //     </div>
    //   </div>
    // </div>

    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>

        <p className="mt-4 text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero
          nulla eaque error neque ipsa culpa autem, at itaque nostrum!
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mb-0 mt-8 max-w-md space-y-4"
      >
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="relative">
            <input
            autoComplete="off"
            id="email"
              type="email"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter email"
              {...register("email")}
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>

          <div className="relative">
            <input
            autoComplete="off"
            id="password"
              {...register("password")}
              type="password"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter password"
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
         

          <button
            disabled={isSubmitting}
            type="submit"
            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm me-1"></span>
            )}
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
