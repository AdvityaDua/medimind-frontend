import { motion } from "framer-motion";
import { ThemedSection } from "../components/themed";
import Navbar from "../components/Navbar";
import HeaderSection from "../components/Header";
import Footer from "../components/Footer";
import { fadeInUp, staggerContainer, staggerItem } from "../utils/animations";

export default function AboutPage() {
  const reasons = [
    "Reduce pharmaceutical waste",
    "Support data-driven decision making",
    "Improve supplier-pharmacy collaboration",
    "Enhance medicine accessibility"
  ];

  return (
    <motion.div 
      className="page-container relative overflow-hidden"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-400/8 rounded-full blur-3xl"
          animate={{
            rotate: 360,
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      <Navbar />
      <motion.div 
        className="max-w-5xl mx-auto px-6 py-12 space-y-12 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <HeaderSection />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ThemedSection title="Our Mission">
            MediMind uses AI to improve pharmacy inventory management
            and reduce global pharmaceutical waste.
          </ThemedSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ThemedSection title="Why We Exist">
            <motion.ul 
              className="list-disc pl-6 space-y-2"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {reasons.map((reason, i) => (
                <motion.li
                  key={i}
                  variants={staggerItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  {reason}
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <Footer />
            </motion.div>
          </ThemedSection>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
