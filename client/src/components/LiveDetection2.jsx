import React, { useEffect, useRef, useState } from "react";
import { InferenceEngine, CVImage } from "inferencejs";
import _ from "lodash";
import { FaPlay, FaStop, FaCamera } from "react-icons/fa";
import html2canvas from "html2canvas"; // Import the html2canvas package

const LiveDetection2 = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [fps, setFps] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const inferEngineRef = useRef(null);
  const workerIdRef = useRef(null);
  const animationRef = useRef(null);
  const pastFrameTimes = useRef([]);
  const prevTimeRef = useRef(null);
  const detectCancelledRef = useRef(false);

  const MODEL_ID = "cropv2";
  const VERSION = "2";
  const API_KEY = "rf_mV9Wohiz75cYpymefAr2zSTCTiV2";

  const startDetection = async () => {
    setIsLoading(true);
    detectCancelledRef.current = false;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "environment" },
      });

      video.srcObject = stream;
      streamRef.current = stream;

      await new Promise((res) => {
        video.onloadedmetadata = () => {
          video.play();
          res();
        };
      });

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      inferEngineRef.current = new InferenceEngine();
      const workerId = await inferEngineRef.current.startWorker(
        MODEL_ID,
        VERSION,
        API_KEY
      );
      workerIdRef.current = workerId;

      setIsStreaming(true);
      detectFrame();
    } catch (err) {
      console.error("Error starting detection:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopDetection = async () => {
    setIsStopping(true);
    detectCancelledRef.current = true;

    try {
      cancelAnimationFrame(animationRef.current);

      if (inferEngineRef.current && workerIdRef.current) {
        await inferEngineRef.current.stopWorker(workerIdRef.current);
        inferEngineRef.current = null;
        workerIdRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      setIsStreaming(false);
      setFps(0);
      pastFrameTimes.current = [];
      prevTimeRef.current = null;
    } catch (err) {
      console.error("Error fully stopping detection:", err);
    } finally {
      setIsStopping(false);
    }
  };

  const captureFrame = () => {
    const captureArea = document.querySelector(".capture-area");

    html2canvas(captureArea).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "captured-frame-with-inference.png";
      link.click();
    });
  };

  const detectFrame = async () => {
    const inferEngine = inferEngineRef.current;
    const workerId = workerIdRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const detect = async () => {
      if (detectCancelledRef.current) return;

      const image = new CVImage(video);
      try {
        const predictions = await inferEngine.infer(workerId, image);
        renderPredictions(predictions, ctx);

        if (prevTimeRef.current) {
          pastFrameTimes.current.push(Date.now() - prevTimeRef.current);
          if (pastFrameTimes.current.length > 30)
            pastFrameTimes.current.shift();

          const total = _.sum(pastFrameTimes.current.map((t) => t / 1000));
          setFps(Math.round(pastFrameTimes.current.length / total));
        }
        prevTimeRef.current = Date.now();
      } catch (err) {
        console.error("Inference error:", err);
      }

      if (!detectCancelledRef.current) {
        animationRef.current = requestAnimationFrame(detect);
      }
    };

    detect();
  };

  // const renderPredictions = (predictions, ctx) => {
  //   if (Array.isArray(predictions)) {
  //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //     ctx.font = "12px sans-serif";

  //     const padding = 30;

  //     predictions.forEach((pred) => {
  //       const { x, y, width, height } = pred.bbox;

  //       const adjustedWidth = width - 2 * padding;
  //       const adjustedHeight = height - 2 * padding;

  //       const finalWidth = Math.max(adjustedWidth, 0);
  //       const finalHeight = Math.max(adjustedHeight, 0);

  //       const adjustedX = x - finalWidth / 2;
  //       const adjustedY = y - finalHeight / 2;

  //       ctx.strokeStyle = pred.color;
  //       ctx.lineWidth = 4;
  //       ctx.strokeRect(adjustedX, adjustedY, finalWidth, finalHeight);

  //       const textWidth = ctx.measureText(pred.class).width;
  //       ctx.fillStyle = pred.color;
  //       ctx.fillRect(adjustedX, adjustedY - 20, textWidth + 8, 20);

  //       ctx.fillStyle = "#000000";
  //       ctx.fillText(pred.class, adjustedX + 4, adjustedY - 10);
  //     });
  //   } else {
  //     console.error("Predictions are not in an array format:", predictions);
  //   }
  // };

  const renderPredictions = (predictions, ctx) => {
    if (Array.isArray(predictions)) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.font = "12px sans-serif";

      const padding = 30;

      predictions.forEach((pred) => {
        const { x, y, width, height } = pred.bbox;

        const adjustedWidth = width - 2 * padding;
        const adjustedHeight = height - 2 * padding;

        const finalWidth = Math.max(adjustedWidth, 0);
        const finalHeight = Math.max(adjustedHeight, 0);

        const adjustedX = x - finalWidth / 2;
        const adjustedY = y - finalHeight / 2;

        // const confidence = (pred.score * 100).toFixed(1);
        const confidence = (pred.confidence * 100).toFixed(1);


        const label = `${pred.class} (${confidence}%)`;

        ctx.strokeStyle = pred.color;
        ctx.lineWidth = 4;
        ctx.strokeRect(adjustedX, adjustedY, finalWidth, finalHeight);

        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = pred.color;
        ctx.fillRect(adjustedX, adjustedY - 20, textWidth + 8, 20);

        ctx.fillStyle = "#000000";
        ctx.fillText(label, adjustedX + 4, adjustedY - 10);
      });
    } else {
      console.error("Predictions are not in an array format:", predictions);
    }
  };

  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-semibold mb-6">
        Live Plant Disease Detection
      </h1>
      <div className="relative w-full capture-area">
        <video
          ref={videoRef}
          className="w-full rounded shadow"
          autoPlay
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
        <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded shadow text-sm">
          FPS: {fps}
        </div>

        {(isLoading || isStopping) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
            <span className="text-white text-lg font-semibold">
              {isLoading ? "Loading camera..." : "Stopping..."}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={startDetection}
          disabled={isStreaming || isLoading || isStopping}
          className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg ${
            isStreaming || isLoading || isStopping
              ? "bg-gray-400"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <FaPlay /> Start
        </button>
        <button
          onClick={stopDetection}
          disabled={!isStreaming || isLoading || isStopping}
          className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg ${
            !isStreaming || isLoading || isStopping
              ? "bg-gray-400"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          <FaStop /> Stop
        </button>
        <button
          onClick={captureFrame}
          disabled={!isStreaming || isLoading || isStopping}
          className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg ${
            !isStreaming || isLoading || isStopping
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <FaCamera /> Capture
        </button>
      </div>
    </div>
  );
};

export default LiveDetection2;
