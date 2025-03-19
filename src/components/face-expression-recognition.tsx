/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"; // Ensure it's a client-side component
import { throttle } from "lodash";
import { useRef, useEffect, useState, useCallback } from "react";

interface FacialExpressionRecognitionProps {
  onExpressionsDetected?: (expressions: { [key: string]: number } | null) => void;
}

const FacialExpressionRecognition: React.FC<FacialExpressionRecognitionProps> = ({
  onExpressionsDetected,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceapi, setFaceapi] = useState<any>(null);

  const MODEL_URL = "/face-api-models";

  // Load FaceAPI Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const faceAPI = await import("face-api.js");
        setFaceapi(faceAPI);
        await faceAPI.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceAPI.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceAPI.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Error loading models:", err);
      }
    };

    loadModels();
  }, []);

  // Start Video Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    if (isModelLoaded) {
      startVideo();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isModelLoaded]);

  // ✅ Throttled function to limit updates every 5 seconds
  const throttledHandleExpressions = useCallback(
    throttle((expressions: { [key: string]: number } | null) => {
      if (onExpressionsDetected) {
        onExpressionsDetected(expressions);
      }
    }, 3000), // 5-second interval
    [onExpressionsDetected]
  );

  // Analyze Video Frames
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const analyzeVideo = async () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        const handlePlay = () => {
          interval = setInterval(async () => {
            const videoWidth = video.videoWidth || video.offsetWidth;
            const videoHeight = video.videoHeight || video.offsetHeight;

            if (videoWidth === 0 || videoHeight === 0) {
              console.warn("Video dimensions are not valid yet.");
              return;
            }

            canvas.width = videoWidth;
            canvas.height = videoHeight;

            const detections = await faceapi
              .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();

            const displaySize = { width: videoWidth, height: videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            const resizedDetections = detections
              ? faceapi.resizeResults(detections, displaySize)
              : [];

            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              if (detections) {
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                const currentExpressions = detections.expressions as unknown as {
                  [key: string]: number;
                };

                // ✅ Use throttled function to limit updates
                throttledHandleExpressions(currentExpressions);
              } else {
                throttledHandleExpressions(null);
              }
            }
          }, 3000);
        };

        video.addEventListener("play", handlePlay);

        return () => {
          video.removeEventListener("play", handlePlay);
          if (interval) clearInterval(interval);
        };
      }
    };

    if (isModelLoaded) {
      analyzeVideo();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isModelLoaded, throttledHandleExpressions]);

  return (
    <div className="relative">
      <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};

export default FacialExpressionRecognition;