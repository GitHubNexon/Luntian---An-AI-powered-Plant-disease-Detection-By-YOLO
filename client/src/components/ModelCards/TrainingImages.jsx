import React from 'react';
import { motion } from 'framer-motion';

import train_batch1 from '../../assets/Images/ModelInfoImages/train_batch1.jpg';
import train_batch2 from '../../assets/Images/ModelInfoImages/train_batch2.jpg';
import train_batch20220 from '../../assets/Images/ModelInfoImages/train_batch20220.jpg';
import train_batch20221 from '../../assets/Images/ModelInfoImages/train_batch20221.jpg';
import train_batch20222 from '../../assets/Images/ModelInfoImages/train_batch20222.jpg';
import val_batch0_labels from '../../assets/Images/ModelInfoImages/val_batch0_labels.jpg';
import val_batch1_labels from '../../assets/Images/ModelInfoImages/val_batch1_labels.jpg';
import val_batch2_labels from '../../assets/Images/ModelInfoImages/val_batch2_labels.jpg';
import val_batch0_pred from '../../assets/Images/ModelInfoImages/val_batch0_pred.jpg';
import val_batch1_pred from '../../assets/Images/ModelInfoImages/val_batch1_pred.jpg';

const galleryImages = [
  { src: train_batch1, alt: 'Training Batch 1' },
  { src: train_batch2, alt: 'Training Batch 2' },
  { src: train_batch20220, alt: 'Training Batch 20220' },
  { src: train_batch20221, alt: 'Training Batch 20221' },
  { src: train_batch20222, alt: 'Training Batch 20222' },
  { src: val_batch0_labels, alt: 'Validation Labels Batch 0' },
  { src: val_batch1_labels, alt: 'Validation Labels Batch 1' },
  { src: val_batch2_labels, alt: 'Validation Labels Batch 2' },
  { src: val_batch0_pred, alt: 'Validation Predictions Batch 0' },
  { src: val_batch1_pred, alt: 'Validation Predictions Batch 1' }
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const TrainingImages = () => {
  return (
    <section className="py-20 px-4 sm:px-10 bg-gradient-to-br from-white via-green-50 to-white-100">
      <motion.h2
        className="text-4xl font-extrabold text-green-700 text-center drop-shadow-md mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        🌱 AI Training Gallery
      </motion.h2>

      <motion.p
        className="max-w-4xl mx-auto text-center text-gray-600 text-lg mb-16"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        Explore the real images that shaped our AI's understanding. These batches reveal the diversity and depth used to train and test the model's visual intelligence.
      </motion.p>

      <div className="flex flex-col gap-24">
        {galleryImages.map(({ src, alt }, index) => (
          <motion.div
            key={alt}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 !== 0 ? 'md:flex-row-reverse' : ''
            }`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariants}
          >
            <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl">
              <img
                src={src}
                alt={alt}
                className="w-full h-auto object-cover rounded-xl transition-all duration-300"
              />
            </div>

            <div className="w-full md:w-1/2 px-2">
              <div className="backdrop-blur-md bg-white/60 border border-green-200 rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold text-green-800 mb-3">{alt}</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  This snapshot offers insight into a batch from the dataset used during model training or validation.
                  Each image plays a vital role in shaping the model’s accuracy and comprehension of disease patterns in crops.
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrainingImages;
