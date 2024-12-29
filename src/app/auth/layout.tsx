// src/app/auth/layout.tsx
import React from 'react';
import { ReactNode } from 'react';

// You can import global styles or any other component you want to include in the layout.

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="auth-container">
      <div className="auth-content">


      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div>
              <img src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
                className="w-32 mx-auto" />
            </div>
        
            {children}


          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat bg-[url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')] bg-cover bg-center">
            </div>
          </div>
        </div>
      </div>



      </div>
    </div>
  );
};

export default AuthLayout;
