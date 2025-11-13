import React from "react";

export function ThemedSection({ title, children }) {
  return (
    <section className="bg-card border border-border rounded-xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
      <div className="text-foreground/80">{children}</div>
    </section>
  );
}
