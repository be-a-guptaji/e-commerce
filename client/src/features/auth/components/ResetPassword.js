import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPasswordAsync,
  selectPasswordResetStatus,
  resetPasswordResetStatus,
  selectAuthError,
  resetUserError,
} from "../authSlice";
import { useEffect, useState } from "react";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const passwordResetStatus = useSelector(selectPasswordResetStatus);
  const error = useSelector(selectAuthError);
  const [second, setSecond] = useState(3);

  const query = new URLSearchParams(window.location.search);
  const token = query.get("token");
  const email = query.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(resetPasswordResetStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!email && !token) {
      navigate("/login", { replace: true });
    }
    if (passwordResetStatus) {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);

      const intervalId = setInterval(() => {
        setSecond((prevSecond) => {
          if (prevSecond <= 0) {
            clearInterval(intervalId); // Stop the interval when it reaches 0
            return 0;
          }
          return prevSecond - 1; // Decrease by 1 second
        });
      }, 1000);

      return () => {
        clearTimeout(timer); // Clean up the timer on component unmount
        clearInterval(intervalId); // Clean up the interval on component unmount
      };
    }
  }, [navigate, email, token, passwordResetStatus, second]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="../../../logo.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Enter New Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              dispatch(resetPasswordResetStatus());
              dispatch(resetUserError());
              dispatch(
                resetPasswordAsync({ email, token, password: data.password })
              );
            })}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                      message: `- at least 8 characters\n
                      - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
                      - Can contain special characters`,
                    },
                  })}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>

              <div className="mt-2">
                <input
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value, formValues) =>
                      value === formValues.password || "password not matching",
                  })}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
                {passwordResetStatus && (
                  <p className="text-green-500">Password reset successfully</p>
                )}
                {error && <p className="text-red-500">{error.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                Reset Password
              </button>
            </div>
          </form>
          {passwordResetStatus && (
            <p className="text-blue-500 text-center font-bold">
              You will be redirected to login in {second} seconds ...
            </p>
          )}
        </div>
      </div>
    </>
  );
}
