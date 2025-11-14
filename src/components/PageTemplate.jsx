import React from "react";

export default function PageTemplate({ children }) {
  return (
    <div className="page-container px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {children}
      </div>
    </div>
  );
}
