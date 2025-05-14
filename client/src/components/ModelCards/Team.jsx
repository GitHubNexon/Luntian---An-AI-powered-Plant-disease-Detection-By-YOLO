import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

import john from '../../assets/Images/DesignImages/john.png';
import marlon from '../../assets/Images/DesignImages/marlon.png';
import arielle from '../../assets/Images/DesignImages/arielle.png';
import suma from '../../assets/Images/DesignImages/Suma.png';
import ardian from '../../assets/Images/DesignImages/ardian.png';

const teamMembers = [
  {
    name: 'John Mark L. Pulmano',
    role: 'Head Programmer',
    img: john,
  },
  {
    name: 'Ardian Alpino',
    role: 'Team Leader',
    img: ardian,
  },
  {
    name: 'Princess Arielle M. Perez',
    role: 'UI/UX Designer',
    img: arielle,
  },
  {
    name: 'Kenneth Suma',
    role: 'Device Components Manager',
    img: suma,
  },
  {
    name: 'Marlon G. Rinos',
    role: 'Documentation Specialist',
    img: marlon,
  },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const Team = () => {
  return (
    <section className="py-16 px-6 bg-white text-center">
      {/* Simple header */}
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-green-500 tracking-wide">Our Amazing Team</h1>
      </header>

      {/* Main title */}
      <motion.h2
        className="text-4xl font-extrabold text-green-700 mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        MEET THE TEAM
      </motion.h2>

      {/* Tagline */}
      <motion.p
        className="text-gray-600 text-lg mb-12 max-w-xl mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        A passionate group of innovators, creators, and problem-solvers.
      </motion.p>

      {/* Team cards */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center">
        {teamMembers.map((member, i) => (
          <Tilt
            key={i}
            glareEnable={true}
            glareMaxOpacity={0.2}
            scale={1.05}
            transitionSpeed={1500}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            className="w-full max-w-xs"
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-xl bg-white"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={cardVariants}
            >
              <div
                className="h-[380px] w-75 bg-cover bg-center"
                style={{ backgroundImage: `url(${member.img})` }}
              />

              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-green-600 to-transparent px-4 flex flex-col justify-end pb-4">
                <h3 className="text-white text-lg font-bold leading-tight">{member.name}</h3>
                <p className="text-white text-sm opacity-90">{member.role}</p>
              </div>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </section>
  );
};

export default Team;
