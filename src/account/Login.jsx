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
  const { isSubmitting } = formState;

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
        <h1 className="text-2xl font-bold sm:text-3xl">LINKUUP-MEDICAL</h1>

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
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            disabled={isSubmitting}
            type="submit"
            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
          >
            {isSubmitting && <span className="animate-spin h-4 w-4"></span>}
            Login
          </button>

        
        </div>
      </form>
    </div>
  );
}
