"use client"
import React, { useState } from "react";
import CustomDrawer from "@/app/components/ui/Drawer";
import CustomAppBar from "@/app/components/ui/AppBar";
import Footer from "@/app/components/ui/Footer";
import MainContent from "@/app/components/ui/MainContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NextAuthSessionProvider from "../../providers/sessionProvider";
import { Container, Typography, Button } from '@mui/material';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(prev => !prev);
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-iransans text-[13px]">
        <ToastContainer position="top-right" autoClose={3000} />
        <NextAuthSessionProvider>
          <CustomAppBar onMenuClick={handleDrawerToggle} />

          {/* Sidebar */}
          <CustomDrawer open={drawerOpen} onClose={handleDrawerToggle} />
          <p>ssss</p>
          {/* Main Content */}
          <Container>
            {children}
          </Container>
          {/* Footer */}
          <Footer />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
