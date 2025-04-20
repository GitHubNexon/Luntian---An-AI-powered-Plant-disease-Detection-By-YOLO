import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import {
  ChartBarIcon,
  EyeIcon,
  CheckBadgeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import ConfusionMatrix from '../../assets/Images/ModelInfoImages/confusion_matrix.png';
import ConfusionMatrixNormalized from '../../assets/Images/ModelInfoImages/confusion_matrix_normalized.png';
import F1Curve from '../../assets/Images/ModelInfoImages/F1_curve.png';
import PrecisionCurve from '../../assets/Images/ModelInfoImages/P_curve.png';
import RecallCurve from '../../assets/Images/ModelInfoImages/R_curve.png';
import PRCurve from '../../assets/Images/ModelInfoImages/PR_curve.png';
import LabelsCorrelogram from '../../assets/Images/ModelInfoImages/labels_correlogram.jpg';
import LabelsDist from '../../assets/Images/ModelInfoImages/labels.jpg';
import ResultsSummary from '../../assets/Images/ModelInfoImages/results.png';

const metrics = [
  {
    src: ConfusionMatrix,
    alt: 'Confusion Matrix',
    desc: 'Displays raw counts of correct and incorrect predictions.',
    Icon: ChartBarIcon
  },
  {
    src: ConfusionMatrixNormalized,
    alt: 'Normalized Confusion Matrix',
    desc: 'Shows per-class accuracy as percentages.',
    Icon: CheckBadgeIcon
  },
  {
    src: F1Curve,
    alt: 'F1 Score Curve',
    desc: 'Balanced metric across precision and recall.',
    Icon: ChartBarIcon
  },
  {
    src: PrecisionCurve,
    alt: 'Precision vs Confidence',
    desc: 'Tracks prediction correctness by confidence.',
    Icon: EyeIcon
  },
  {
    src: RecallCurve,
    alt: 'Recall vs Confidence',
    desc: 'Measures detection completeness by confidence.',
    Icon: EyeIcon
  },
  {
    src: PRCurve,
    alt: 'Precision-Recall Curve',
    desc: 'Visualizes the balance between false positives and negatives.',
    Icon: ChartBarIcon
  },
  {
    src: LabelsCorrelogram,
    alt: 'Label Correlation Heatmap',
    desc: 'Detects confusion between similar diseases.',
    Icon: ChartBarIcon
  },
  {
    src: LabelsDist,
    alt: 'Label Distribution',
    desc: 'Shows how balanced the training data is.',
    Icon: CheckBadgeIcon
  },
  {
    src: ResultsSummary,
    alt: 'Results Summary',
    desc: 'Includes key metrics: loss, accuracy, and precision.',
    Icon: CheckBadgeIcon
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const ModelEvaluationSection = () => {
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    document.body.style.overflow = modalImage ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [modalImage]);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-green-50 via-white to-white-100">
      <motion.h2
        className="text-4xl font-extrabold text-green-700 mb-6 text-center drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        🌿 Model Evaluation Metrics
      </motion.h2>

      <motion.p
        className="max-w-3xl mx-auto text-center text-gray-700 text-lg mb-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        Dive into visual metrics that reveal our model’s strengths and weaknesses—from accuracy to nuanced misclassifications.
      </motion.p>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(({ src, alt, desc, Icon }) => (
          <motion.div
            key={alt}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Tilt
              tiltMaxAngleX={6}
              tiltMaxAngleY={6}
              perspective={700}
              transitionSpeed={400}
              scale={1.01}
              gyroscope={false}
              glareEnable={false}
              className="bg-white/30 backdrop-blur-lg border border-green-200 hover:border-green-400 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="p-6 flex flex-col items-center">
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto rounded-xl mb-4 cursor-pointer"
                  onClick={() => setModalImage({ src, alt })}
                />
                <div className="flex items-center gap-2 mb-2 text-green-800">
                  <Icon className="h-5 w-5" />
                  <h4 className="text-xl font-semibold">{alt}</h4>
                </div>
                <p className="text-gray-700 text-sm text-center">{desc}</p>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>

      {/* <AnimatePresence>
        {modalImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalImage(null)}
          >
            <div
              className="relative max-w-5xl w-full max-h-100vh] p-6 overflow-hidden flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-green-300 transition"
                onClick={() => setModalImage(null)}
                aria-label="Close modal"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
              <img
                src={modalImage.src}
                alt={modalImage.alt}
                className="rounded-lg max-h-[80vh] w-auto object-contain"
              />
              <p className="text-white text-center mt-4 text-lg">{modalImage.alt}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </section>
  );
};

export default ModelEvaluationSection;
