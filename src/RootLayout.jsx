import React from "react";
import { AuthProvider } from "./AuthContext";
import "./global.css";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <div className="font-sans antialiased">{children}</div>
    </AuthProvider>
  );
}
