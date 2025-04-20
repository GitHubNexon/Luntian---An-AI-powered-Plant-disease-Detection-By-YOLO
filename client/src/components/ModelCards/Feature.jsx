import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function Feature() {
  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-24">
      <motion.div
        className="max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-green-700 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🌾 Smart Farming with AI
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Our integrated AI technology is revolutionizing agriculture by providing fast, accurate insights into crop health and diseases.
          Whether you're dealing with wilting leaves, discoloration, or unknown plant issues, our AI assistant is trained to analyze symptoms and
          suggest possible causes—helping farmers make informed decisions faster than ever.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              viewport={{ once: true }}
            >
              <Tilt glareEnable={true} glareMaxOpacity={0.2} scale={1.05} tiltMaxAngleX={10} tiltMaxAngleY={10}>
                <div className="bg-green-100 p-6 rounded-[50px] shadow-lg hover:shadow-2xl transition">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {feature.icon} {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

const features = [
  {
    icon: '🔍',
    title: 'Diagnose Crop Diseases',
    description:
      'Input visible symptoms, and AI will provide likely causes, whether it’s fungal, bacterial, viral, or environmental stress.',
  },
  {
    icon: '💬',
    title: 'Ask Anything',
    description:
      'Need tips on improving yield, choosing pesticides, or dealing with soil issues? Just ask—our AI is trained with expert agricultural data.',
  },
  {
    icon: '🚀',
    title: 'Make Smarter Decisions',
    description:
      'Reduce guesswork and get fast feedback before calling in a specialist. AI is your 24/7 farming companion.',
  },
];
