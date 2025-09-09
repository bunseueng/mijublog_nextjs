import React from "react";
import { SignupForm } from "./SignupForm";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-background my-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignUpPage;
