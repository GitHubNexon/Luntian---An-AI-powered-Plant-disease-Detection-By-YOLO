import React from "react";
import Hero from "../components/ModelCards/Hero"
import Welcome from "../components/ModelCards/Welcome";
import ModelEvaluation from "../components/ModelCards/ModelEvaluation";
import TrainingImageGallery from "../components/ModelCards/TrainingImages";
import Feature from "../components/ModelCards/Feature";
import Team from "../components/ModelCards/Team";

const ModelInfo = () => {
  return (
    <div className="flex item-center justify-center m-2 -200 p-4 rounded text-center shadow-2xl cursor-pointer overflow-hidden relative transition-all duration-500 hover:translate-y-2  flex-col items-center  gap-2 before:absolute before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-green-400">
 
      <Hero />
      <Welcome />   
      <Feature />
      <ModelEvaluation />
      <TrainingImageGallery />
      <Team />
    </div>
  );
};

export default ModelInfo;
