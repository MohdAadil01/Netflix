import React, { useRef, useState } from "react";
import { BACKGROUND_IMAGE } from "../assets/const.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { login, signup } from "../store/userSlice/index.js";
import { auth } from "../firebase/config";
import { validateForm } from "../utils/validateForm";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const email = useRef();
  const password = useRef();
  const name = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitFormHandler = (e) => {
    e.preventDefault();
    const isFormValid = validateForm(email.current.value);
    if (isFormValid) {
      setErrorMessage(isFormValid);
      return;
    }
    if (isLoginPage) {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch(
            login({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            })
          );
          const accessToken = user.accessToken;
          localStorage.setItem("accessToken", accessToken);
          navigate("/browse");
        })
        .catch((error) => {
          const errorMessage = error.message;
          setErrorMessage(errorMessage);
        });
    } else {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
          })
            .then(() => {
              dispatch(
                signup({
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                })
              );
              const accessToken = user.accessToken;
              localStorage.setItem("accessToken", accessToken);
              navigate("/browse");
            })
            .catch((error) => {
              const errorMessage = error.message;
              setErrorMessage(errorMessage);
            });
        })
        .catch((error) => {
          const errorMessage = error.message;
          setErrorMessage(errorMessage);
        });
    }
  };
  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-cover bg-center`}
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      <div className="bg-black bg-opacity-75 p-8 rounded-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">
          {isLoginPage ? "Sign In" : "Sign Up"}
        </h1>
        <form className="space-y-4" onSubmit={submitFormHandler}>
          {!isLoginPage && (
            <input
              type="text"
              ref={name}
              placeholder="Full Name"
              className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-500 text-white"
            />
          )}
          <input
            type="text"
            ref={email}
            placeholder="Email"
            className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-500 text-white"
          />
          <input
            type="password"
            ref={password}
            placeholder="Password"
            className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-500 text-white"
          />
          <button
            type="submit"
            className="w-full p-3 rounded-md bg-red-600 text-white font-bold hover:bg-red-700"
          >
            Sign In
          </button>
          {errorMessage && (
            <p className="w-full rounded-md text-red-600 font-bold">
              {errorMessage}
            </p>
          )}
          {isLoginPage && (
            <>
              {" "}
              <p className="text-center text-gray-400">OR</p>
              <button
                type="button"
                className="w-full p-3 rounded-md bg-gray-600 text-white font-bold hover:bg-gray-700"
              >
                Use a sign-in code
              </button>
            </>
          )}
        </form>
        <p className="text-gray-400 mt-4">
          {isLoginPage ? "New to Netflix?" : "Already have an account?"}{" "}
          <button
            className="text-white hover:underline"
            onClick={() => setIsLoginPage((prev) => !prev)}
          >
            {!isLoginPage ? "Sign in now" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
