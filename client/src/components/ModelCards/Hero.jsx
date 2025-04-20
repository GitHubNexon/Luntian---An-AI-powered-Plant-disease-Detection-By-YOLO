import React from 'react';
import { motion } from 'framer-motion';
import ScanningPlantSVG from "../../assets/Images/DesignImages/scanplant.svg";
import FrontPlantSVG from "../../assets/Images/DesignImages/frontleaves.svg";

const Hero = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between py-10 overflow-hidden px-4">
      {/* Left Content */}
      <motion.div
        className="max-w-xl text-left"y
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          Detect Plant Diseases<br />Before they Spread
        </h1>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Accurate, early detection of scrap<br />disease with smart technology
        </h2>
        <p className="text-sm text-gray-700">
          Protect your crops with our advanced plant disease detection device.
          Designed for precision and speed, it helps farmers and agronomists
          identify scrap disease in plants before it's too late.
        </p>
      </motion.div>

      {/* Right Image with floating overlay */}
      <motion.div
        className="relative mt-10 lg:mt-0 lg:ml-10 w-full max-w-md"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2 }}
      >
        <img
          src={ScanningPlantSVG}
          alt="Scan showing plant disease detection"
          className="w-full"
        />

        {/* Floating Leaf in Front */}
        <motion.img
          src={FrontPlantSVG}
          alt="Front leaves"
          className="absolute top-0 left-0 w-[150%] -translate-x-[15%] scale-120 pointer-events-none"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
