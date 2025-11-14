import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, buttonHover, staggerContainer } from "../utils/animations";

export default function HeaderSection() {
  return (
    <motion.section 
      className="max-w-7xl mx-auto px-6 py-20 text-center"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <motion.h2 
        className="text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        Smart Pharmacy Management <br />
        with <motion.span 
          className="text-primary"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        >
          AI Intelligence
        </motion.span>
      </motion.h2>

      <motion.p 
        className="text-foreground/80 text-lg max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        AI-driven inventory tracking, expiry alerts, supplier collaboration, 
        and forecasting to boost productivity.
      </motion.p>

      <motion.div 
        className="mt-8 flex justify-center gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.a
          href="/about"
          className="btn-primary"
          variants={staggerContainer}
          {...buttonHover}
        >
          Explore Features
        </motion.a>

        <motion.a
          href="/login"
          className="btn-secondary"
          variants={staggerContainer}
          {...buttonHover}
        >
          Get Started
        </motion.a>
      </motion.div>

    </motion.section>
  );
}
