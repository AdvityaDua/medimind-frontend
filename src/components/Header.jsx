import React from "react";

export default function HeaderSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-center">

      <h2 className="text-5xl font-bold mb-4">
        Smart Pharmacy Management <br />
        with <span className="text-primary">AI Intelligence</span>
      </h2>

      <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
        AI-driven inventory tracking, expiry alerts, supplier collaboration, 
        and forecasting to boost productivity.
      </p>

      <div className="mt-8 flex justify-center gap-6">
        <a
          href="/about"
          className="px-8 py-3 rounded-lg bg-primary text-white hover:bg-primary/80 transition"
        >
          Explore Features
        </a>

        <a
          href="/login"
          className="px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition"
        >
          Get Started
        </a>
      </div>

    </section>
  );
}
