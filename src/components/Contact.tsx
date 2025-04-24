import React from "react";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/hacksprint5.0?utm_source=qr&igsh=ODY2YTNoeGV3anY1",
    color: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
    hoverEffect: "hover:shadow-pink-500/50"
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/company/tachyon-community-club/",
    color: "bg-blue-600",
    hoverEffect: "hover:shadow-blue-600/50"
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:hacksprint5.0@gmail.com",
    color: "bg-gradient-to-r from-red-600 to-red-500",
    hoverEffect: "hover:shadow-red-600/50"
  }
];

const SocialButton = ({ social }: { social: typeof socialLinks[0] }) => {
  const Icon = social.icon;
  
  return (
    <motion.a 
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative w-16 h-16 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 
        ${social.hoverEffect} hover:shadow-lg transition-all duration-300 group overflow-hidden inline-flex items-center justify-center`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`absolute inset-0 ${social.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <Icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
      </div>
      <motion.div 
        className="absolute inset-0 bg-white/5"
        initial={false}
        whileHover={{ opacity: [0, 1, 0], transition: { duration: 1.5, repeat: Infinity } }}
      />
    </motion.a>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="relative py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Connect With Us
          </h2>
          <p className="text-gray-300 text-lg">
            Follow us on social media to stay updated
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-8 max-w-xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {socialLinks.map((social) => (
            <motion.div
              key={social.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <SocialButton social={social} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact; 