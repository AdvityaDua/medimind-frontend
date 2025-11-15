import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  ArrowRight,
  Star,
  PlayCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import HeaderSection from "../components/Header";
import Footer from "../components/Footer";
import { 
  staggerContainer, 
  staggerItem, 
  cardHover, 
  fadeInUp, 
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  floating,
  pulse,
  numberCounter
} from "../utils/animations";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  );
}

// FAQ Item Component
function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      className="card cursor-pointer"
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, x: index % 2 === 0 ? 10 : -10 }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <motion.div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-accent-light">{faq.q}</h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight className="w-5 h-5 text-accent-light" />
        </motion.div>
      </motion.div>
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="mt-4 text-secondary-light">{faq.a}</p>
      </motion.div>
    </motion.div>
  );
}

// FAQ Section Component
function FAQSection() {
  const faqs = [
    { q: "How quickly can I get started?", a: "You can be up and running in less than 30 minutes. Our setup wizard guides you through the entire process." },
    { q: "Is my data secure?", a: "Absolutely! We use enterprise-grade encryption and comply with all healthcare data regulations including HIPAA." },
    { q: "Can I integrate with my existing system?", a: "Yes! MediMind integrates with most pharmacy management systems through our robust API." },
    { q: "What kind of support do you offer?", a: "We offer 24/7 support via email, chat, and phone. Enterprise plans include dedicated account managers." },
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <FAQItem key={i} faq={faq} index={i} />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <motion.div 
      className="page-container flex flex-col relative overflow-hidden"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-300/10 rounded-full blur-3xl"
          animate={{
            rotate: 360,
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* ✅ Global Navbar */}
      <Navbar />

      {/* ✅ Hero / Header Section */}
      <HeaderSection />

      {/* ✅ Stats Section */}
      <motion.section 
        className="max-w-6xl mx-auto px-6 py-16 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: 500, suffix: "+", label: "Active Pharmacies", icon: Users, color: "text-blue-600" },
            { number: 40, suffix: "%", label: "Waste Reduction", icon: TrendingUp, color: "text-green-600" },
            { number: 99, suffix: "%", label: "Uptime Guarantee", icon: Shield, color: "text-purple-600" },
            { number: 24, suffix: "/7", label: "Support Available", icon: Zap, color: "text-orange-600" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="card text-center"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, y: -10, rotate: 5 }}
            >
              <motion.div
                className={`${stat.color} mb-3 flex justify-center`}
                variants={floating}
                animate="animate"
              >
                <stat.icon size={40} />
              </motion.div>
              <motion.div 
                className="text-4xl font-bold text-accent-light mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                <AnimatedCounter end={stat.number} suffix={stat.suffix} />
              </motion.div>
              <p className="text-secondary-light text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ✅ Features Section */}
      <motion.section 
        className="max-w-6xl mx-auto px-6 py-20 text-center mt-10 relative z-10"
        variants={fadeInUp}
      >
        <motion.h3 
          className="text-3xl font-bold mb-12 text-accent-light"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose MediMind?
        </motion.h3>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              title: "📦 Real-time Inventory",
              desc: "Track stock levels, expiry alerts, and reorder needs instantly.",
            },
            {
              title: "🤖 AI Forecasting",
              desc: "Predict accurate demand using machine learning.",
            },
            {
              title: "♻️ Waste Reduction",
              desc: "Reduce expired medicines with automated alerts.",
            },
            {
              title: "📊 Smart Analytics",
              desc: "Monitor supply trends with detailed dashboards.",
            },
            {
              title: "🤝 Supplier Collaboration",
              desc: "Seamless communication between pharmacies & suppliers.",
            },
            {
              title: "⚡ Instant Alerts",
              desc: "Low stock, expiry, and demand fluctuation notifications.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="card relative overflow-hidden group"
              variants={staggerItem}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -15, 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0, rotate: -45 }}
                whileHover={{ scale: 1.5, rotate: 0 }}
              />
              <div className="relative z-10">
                <motion.div
                  className="text-4xl mb-4"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  {item.title.split(' ')[0]}
                </motion.div>
                <motion.h4 
                  className="text-xl font-semibold mb-2 text-accent-light"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  {item.title.split(' ').slice(1).join(' ')}
                </motion.h4>
                <motion.p 
                  className="text-secondary-light"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.4 }}
                >
                  {item.desc}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ✅ How It Works Section */}
      <motion.section 
        className="max-w-6xl mx-auto px-6 py-20 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h3 
          className="text-4xl font-bold mb-16 text-center text-accent-light"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          How It Works
        </motion.h3>
        
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <motion.div
            className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ transformOrigin: "left" }}
          />
          
          {[
            { step: "1", title: "Sign Up", desc: "Create your account in minutes", icon: "📝" },
            { step: "2", title: "Connect", desc: "Link your inventory system", icon: "🔗" },
            { step: "3", title: "Analyze", desc: "AI analyzes your data patterns", icon: "🤖" },
            { step: "4", title: "Optimize", desc: "Get smart recommendations", icon: "✨" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="relative z-10"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
            >
              <motion.div
                className="card text-center"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  {item.icon}
                </motion.div>
                <motion.div
                  className="w-12 h-12 rounded-full bg-accent-light text-white flex items-center justify-center font-bold mx-auto mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
                >
                  {item.step}
                </motion.div>
                <h4 className="text-xl font-semibold mb-2 text-accent-light">{item.title}</h4>
                <p className="text-secondary-light text-sm">{item.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ✅ Testimonials Section */}
      <motion.section 
        className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h3 
          className="text-3xl font-bold mb-12 text-accent-light"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          Loved by Pharmacies & Suppliers
        </motion.h3>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              user: "Dr. Andrew",
              text: "MediMind reduced our waste by 40% in 3 months!",
            },
            {
              user: "City Pharmacy",
              text: "The AI forecasting is incredibly accurate. We never overstock now.",
            },
            {
              user: "HealthSupply Co.",
              text: "Seamless communication with pharmacies. Our best tool so far.",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              className="card relative overflow-hidden"
              initial={{ opacity: 0, rotateY: -15, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ 
                rotateY: 5, 
                scale: 1.05,
                z: 50,
                transition: { duration: 0.3 }
              }}
            >
              {/* Star Rating */}
              <motion.div 
                className="flex justify-center mb-4 gap-1"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.1 }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.1 + star * 0.05, type: "spring" }}
                  >
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.p 
                className="text-secondary-light italic text-lg relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2 }}
              >
                "{t.text}"
              </motion.p>
              <motion.h4 
                className="mt-4 font-semibold text-accent-light relative z-10"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.3 }}
              >
                {t.user}
              </motion.h4>
              
              {/* Decorative quote mark */}
              <motion.div
                className="absolute top-4 left-4 text-6xl text-accent-light/10 font-serif"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.4 }}
              >
                "
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ✅ FAQ Section */}
      <motion.section 
        className="max-w-4xl mx-auto px-6 py-20 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h3 
          className="text-4xl font-bold mb-12 text-center text-accent-light"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          Frequently Asked Questions
        </motion.h3>

        <FAQSection />
      </motion.section>

      {/* ✅ CTA Section */}
      <motion.section 
        className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="card-elevated relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-10"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="relative z-10">
            <motion.h3 
              className="text-4xl font-bold mb-4 text-accent-light"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Ready to Transform Your Pharmacy?
            </motion.h3>
            <motion.p 
              className="text-lg text-secondary-light mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join hundreds of pharmacies already using MediMind to optimize their operations
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/signup"
                className="btn-primary inline-flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/contact"
                className="btn-secondary inline-flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ✅ Global Footer */}
      <Footer />
    </motion.div>
  );
}
