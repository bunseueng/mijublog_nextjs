import React from "react";
import { LoginForm } from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-background my-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-200">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Welcome back! Please enter your details.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
