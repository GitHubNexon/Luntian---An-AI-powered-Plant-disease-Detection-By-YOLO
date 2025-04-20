import React from 'react';
import { motion } from 'framer-motion';
import PlantSVG from "../../assets/Images/DesignImages/plant.svg";

const Welcome = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-[1440px] mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        
        {/* Left Image */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.8 }}
        >
          <img
            src={PlantSVG}
            alt="Healthy plant"
            className="w-full"
          />
        </motion.div>

        {/* Right Text */}
        <motion.div
          className="text-left max-w-xl"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.8 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-4">
            🌿 Welcome to Luntian – Empowering Plant Health with Technology 🌱
          </h2>
          <p className="text-gray-700 mb-6">
            In a world where agriculture faces increasing challenges, <strong>Luntian</strong> emerges as a smart solution for protecting crops and securing yields. At the heart of Luntian is a commitment to innovation — we develop advanced device-based detection systems that help farmers and gardeners identify plant diseases early and take action fast.
          </p>
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">💡 What We Do:</h3>
            <p className="text-gray-700">
              Luntian combines cutting-edge sensors, AI-driven analysis, and an easy-to-use interface to detect signs of plant disease before they become visible to the naked eye. Our devices are designed for real-world field conditions, providing accurate diagnostics for healthier crops and more efficient farming.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Welcome;
