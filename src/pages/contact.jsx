import { motion } from "framer-motion";
import { ThemedSection } from "../components/themed";
import Navbar from "../components/Navbar";
import HeaderSection from "../components/Header";
import Footer from "../components/Footer";
import { fadeInUp, staggerContainer, staggerItem, buttonHover } from "../utils/animations";

export default function ContactPage() {
  const contactInfo = [
    { label: "Email", value: "support@medimind.com", isLink: true },
    { label: "Phone", value: "+1 (555) 123-4567" },
    { label: "Address", value: "123 Healthcare Ave" }
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
          className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-88 h-88 bg-indigo-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-400/8 rounded-full blur-3xl"
          animate={{
            rotate: -360,
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 22,
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
          <ThemedSection title="Contact Information">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {contactInfo.map((info, i) => (
                <motion.p
                  key={i}
                  variants={staggerItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {info.label}: {info.isLink ? (
                    <span className="text-primary font-semibold">{info.value}</span>
                  ) : (
                    <span>{info.value}</span>
                  )}
                </motion.p>
              ))}
            </motion.div>
          </ThemedSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ThemedSection title="Send Us a Message">
            <motion.form 
              className="grid gap-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.input 
                className="input-field" 
                placeholder="Your name"
                variants={staggerItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input 
                className="input-field" 
                placeholder="Your email"
                variants={staggerItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.textarea 
                className="input-field" 
                placeholder="Your message..." 
                rows="4"
                variants={staggerItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                whileFocus={{ scale: 1.02 }}
              />

              <motion.button 
                className="btn-primary"
                variants={staggerItem}
                {...buttonHover}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                Send Message
              </motion.button>
            </motion.form>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <Footer />
            </motion.div>
          </ThemedSection>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
