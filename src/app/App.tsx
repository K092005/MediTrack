import React from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "16px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
            },
          }}
        />
      </DataProvider>
    </AuthProvider>
  );
}