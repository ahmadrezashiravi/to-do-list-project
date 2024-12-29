'use client';

import { useForm, SubmitHandler } from 'react-hook-form'; // Ensure it's used correctly in client-side code
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import axios from 'axios';
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import { handleToast } from "@/utils/toastHandler";

// Define the form data types
interface IFormInput {
  password: string;
  confirmPassword: string;
}

function ResetPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IFormInput>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const token = new URLSearchParams(window.location.search).get('token');

  // Submit handler for the form
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Attempt to request a password reset using the email
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password: data.password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        handleToast({ status: 200, message: "Password reset successfully!" });
        reset(); // Reset form on success
        router.push("/dashboard"); // Redirect after success
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData?.error || "An error occurred. Please try again.");
        toast.error(errorData?.error || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unexpected error occurred. Please try again later.");
    }
  };

  // Google sign-in handler
  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/dashboard" }); // Redirect after successful sign-in
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <h1 className="text-2xl xl:text-3xl font-extrabold">Reset Password</h1>
      <div className="w-full flex-1 mt-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto max-w-xs">
            {/* Display error if password is invalid */}
            {errors.password && (
              <Alert color="failure" className="my-2">
                {errors.password.message}
              </Alert>
            )}

            {/* Password field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput 
                id="password" 
                type="password" 
                placeholder="Password" 
                required 
                shadow
                {...register('password', { required: "Password is required" })}
              />
            </div>

            {/* Confirm Password field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="repeat-password" value="Repeat password" />
              </div>
              <TextInput 
                id="repeat-password" 
                type="password" 
                placeholder="Repeat password" 
                required 
                shadow  
                {...register('confirmPassword', {
                  required: "Confirm Password is required",
                  validate: (value) => value === watch('password') || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <Alert color="failure" className="my-2">
                  {errors.confirmPassword.message}
                </Alert>
              )}
            </div>

            <button
              type="submit"
              className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
              <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              <span className="ml-3">
                Send
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
