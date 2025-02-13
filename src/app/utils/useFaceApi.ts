// utils/useFaceApi.ts
import { useEffect, useState } from "react";

export const useFaceApi = () => {
  const [faceApi, setFaceApi] = useState<typeof import("face-api.js") | null>(null);

  useEffect(() => {
    const loadFaceApi = async () => {
      const faceApiModule = await import("face-api.js");
      setFaceApi(faceApiModule);
    };

    loadFaceApi();
  }, []);

  return faceApi;
};
