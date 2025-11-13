import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center text-sm">

        <p className="text-foreground/70">
          © {new Date().getFullYear()} <span className="text-primary font-semibold">MediMind</span>.
          All Rights Reserved.
        </p>

        <div className="flex justify-center gap-6 mt-4 text-foreground/60">
          <a href="/privacy" className="hover:text-primary transition">Privacy</a>
          <a href="/terms" className="hover:text-primary transition">Terms</a>
          <a href="/contact" className="hover:text-primary transition">Contact</a>
        </div>

      </div>
    </footer>
  );
}
