'use client';

import { useForm, SubmitHandler } from 'react-hook-form'; // Hook for managing form state and validation
import { useState } from 'react';
import { signIn } from "next-auth/react"; // Used for Google OAuth authentication
import { useRouter } from "next/navigation"; // Client-side routing for Next.js

import axios from 'axios'; // Axios for API requests
import { Alert, Button, Label, TextInput } from "flowbite-react"; // UI components from Flowbite
import { toast } from "react-toastify"; // Toast notifications for user feedback
import { handleToast } from "@/utils/toastHandler"; // Custom toast handler utility

// Define the interface for the form data
interface IFormInput {
  email: string; // Email field for password reset
}

function ForgetPassword(): JSX.Element {
  const router = useRouter(); // For navigation after successful operation
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>(); // Form hook setup
  const [errorMessage, setErrorMessage] = useState<string>(''); // State for managing error messages

  // Handler for form submission
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Make an API call to request a password reset
      const response = await axios.post("/api/auth/forgot-password", { email: data.email });

      if (response.status === 200) {
        // Success: Notify user and reset form
        handleToast({ status: 200, message: "Check your inbox for the reset link!" });
        reset(); // Clear the form
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        // Handle known API errors
        setErrorMessage(response?.data?.error || "An error occurred. Please try again.");
        toast.error(response?.data?.error || "Failed to send reset link.");
      }
    } catch (error) {
      // Catch unexpected errors and log them
      console.error("Error:", error);
      toast.error("Unexpected error occurred. Please try again later.");
    }
  };

  // Handler for Google sign-in
  const handleGoogleSignUp = (): void => {
    signIn("google", { callbackUrl: "/dashboard" }); // Redirect to dashboard after Google authentication
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <h1 className="text-2xl xl:text-3xl font-extrabold">Forgot Password</h1>
      <div className="w-full flex-1 mt-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto max-w-xs">
            {/* Display validation error for email field */}
            {errors.email && (
              <Alert color="failure" className="my-2">
                {errors.email.message}
              </Alert>
            )}
            
            <div className="mb-2 block">
              <Label htmlFor="email1" value="Your email" /> {/* Label for email input */}
            </div>
            <TextInput 
              id="email1" 
              type="email" 
              placeholder="name@shiravi.ir" 
              required
              {...register('email', { required: "Email is required" })} // Register email field with validation
            />
            
            <button
              type="submit"
              className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
              {/* Button with icon and text */}
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

export default ForgetPassword;
