'use client';

import { useForm } from 'react-hook-form'; // React Hook Form for managing form state and validation
import { useState,useEffect } from 'react';
import { signIn } from "next-auth/react"; // NextAuth for authentication
import { useRouter } from "next/navigation"; // Next.js router for navigation
import { useSession } from "next-auth/react";

import { TextField, Alert, Button } from '@mui/material'; // Material UI components
import { toast } from "react-toastify"; // Toast notifications
import { handleToast } from "@/utils/toastHandler"; // Custom toast handler utility

// Type definition for form inputs
interface LoginFormInputs {
  email: string;
  password: string;
}

function Login(): JSX.Element {
  const { data: session, status } = useSession();

  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormInputs>(); // Hook form
  const [errorMessage, setErrorMessage] = useState<string>(''); // State for storing error messages
  useEffect(() => {
    if (session) {
      console.log("Session after login:", session);  // بررسی سشن پس از ورود
    }
  }, [session]);  // وابسته به تغییرات سشن

  // Handles form submission
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await signIn('credentials', {
        redirect: false, // Prevent automatic redirection
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard", // Redirect to dashboard after successful login
      });

      if (response?.ok) {
        handleToast({ status: 200, message: "Logged in successfully!" });
        reset(); // Reset the form fields
        console.log("Session:", session); 
        router.push('/dashboard') // نمایش اطلاعات session
      } else {
        setErrorMessage(response?.error || "Invalid credentials. Please try again.");
        toast.error(response?.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Unexpected error occurred. Please try again later.");
    }
  }

  // Handles Google login
  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/dashboard" }); // Redirect to dashboard after Google sign-in
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <h1 className="text-2xl xl:text-3xl font-extrabold">Login</h1>

      {/* Google Login Button */}
      <button onClick={handleGoogleSignUp} className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800">
        Login with Google
      </button>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full max-w-xs">
        <div>
          <TextField
            id="email"
            label="Your email"
            type="email"
            placeholder="name@domain.com"
            required
            {...register('email', { required: "Email is required" })}
          />
          {errors.email && <Alert color="error" className="my-2">{errors.email.message}</Alert>}
        </div>

        <div>
          <TextField
            id="password"
            label="Your password"
            type="password"
            placeholder="Password"
            required
            {...register('password', { required: "Password is required" })}
          />
          {errors.password && <Alert color="error" className="my-2">{errors.password.message}</Alert>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="mt-5 w-full py-4 bg-indigo-500 text-white rounded-lg">Login</button>
      </form>
    </div>
  );
}

export default Login;
