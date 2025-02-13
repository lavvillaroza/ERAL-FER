import * as faceapi from "face-api.js";
import { useRef, useEffect, useState } from "react";

interface FacialExpressionRecognitionProps {
  onExpressionsDetected?: (expressions: { [key: string]: number } | null) => void;
}

const FacialExpressionRecognition: React.FC<FacialExpressionRecognitionProps> = ({
  onExpressionsDetected,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [, setExpressions] = useState<{ [key: string]: number } | null>(null);

  const MODEL_URL = "/face-api-models";

  // Load FaceAPI Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("Models loaded!");
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

  // Analyze Video Frames
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const analyzeVideo = async () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        const handlePlay = () => {
          interval = setInterval(async () => {
            // Ensure the video has valid dimensions
            const videoWidth = video.videoWidth || video.offsetWidth;
            const videoHeight = video.videoHeight || video.offsetHeight;

            if (videoWidth === 0 || videoHeight === 0) {
              console.warn("Video dimensions are not valid yet.");
              return;
            }

            // Sync canvas size to the video size
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            // Detect a single face and expressions
            const detections = await faceapi
              .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();

            // Resize detections to match the canvas size
            const displaySize = { width: videoWidth, height: videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            // Resize results and draw them on canvas
            const resizedDetections = detections ? faceapi.resizeResults(detections, displaySize) : [];
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              if (detections) {
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                // Update expressions
                const currentExpressions = detections.expressions as unknown as { [key: string]: number };                
                setExpressions(currentExpressions);                
                if (onExpressionsDetected) {
                  onExpressionsDetected(currentExpressions);
                }
              }
              else {
                setExpressions(null);
                if (onExpressionsDetected) {
                  onExpressionsDetected(null);
                }
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
  }, [isModelLoaded, onExpressionsDetected]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default FacialExpressionRecognition;
