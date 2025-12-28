import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { handleError } from "./errorHandler";
import { UseImageHandlerProps } from "./types";

const getNestedValue = (obj: any, path: string | string[]): any => {
  if (!obj) return null;
  const pathArray = Array.isArray(path) ? path : path.split(".");
  return pathArray.reduce(
    (current, key) =>
      current && current[key] !== undefined ? current[key] : null,
    obj,
  );
};

export const useImageHandler = ({
  apiConfig,
  testMode,
  testUploadDelay,
  onChangeImage,
  currentImageUrl,
  enableAbortController,
  setImgError,
}: UseImageHandlerProps) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const testIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const smoothIntervalRef = useRef<number | null>(null);
  const targetProgressRef = useRef<number>(0);
  const isFirstUpdateRef = useRef<boolean>(true);

  const resetState = () => {
    setUploadProgress(0);
    targetProgressRef.current = 0;
    isFirstUpdateRef.current = true;
    setLoading(false);
    setError(null);
    setImgError(false);
    if (testIntervalRef.current) {
      clearInterval(testIntervalRef.current);
      testIntervalRef.current = null;
    }
    if (smoothIntervalRef.current) {
      cancelAnimationFrame(smoothIntervalRef.current);
      smoothIntervalRef.current = null;
    }
  };

  const handleAbort = () => {
    if (!enableAbortController) return new AbortController();
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    resetState();
    return abortControllerRef.current;
  };

  const smoothProgressUpdate = () => {
    if (smoothIntervalRef.current) {
      cancelAnimationFrame(smoothIntervalRef.current);
      smoothIntervalRef.current = null;
    }
    const update = () => {
      setUploadProgress((prev) => {
        if (prev >= targetProgressRef.current || prev >= 100) {
          smoothIntervalRef.current = null;
          return Math.min(100, prev);
        }
        const diff = targetProgressRef.current - prev;
        if (diff < 0.1) {
          smoothIntervalRef.current = null;
          return prev;
        }
        const step = Math.max(0.5, diff * 0.15);
        const next = Math.min(100, prev + step);
        if (next < 100) {
          smoothIntervalRef.current = requestAnimationFrame(update);
        }
        return next;
      });
    };
    smoothIntervalRef.current = requestAnimationFrame(update);
  };

  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let progress = 0;
        const interval = testUploadDelay / 100;
        testIntervalRef.current = setInterval(() => {
          progress += 1;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(testIntervalRef.current!);
            testIntervalRef.current = null;
            resolve(reader.result as string);
          }
        }, interval);
      };
      reader.onerror = () => {
        clearInterval(testIntervalRef.current!);
        testIntervalRef.current = null;
        const error = new Error("Error reading file");
        apiConfig.onUploadError?.(error);
        reject(new Error("Error reading file"));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      apiConfig.onUploadError?.(new Error("Invalid file type"));
      return;
    }
    const abortController = handleAbort();
    setLoading(true);
    setUploadProgress(0);
    targetProgressRef.current = 0;
    isFirstUpdateRef.current = true;
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      const minUploadTime = new Promise((resolve) => setTimeout(resolve, 700));
      let newImageUrl: string;
      let responseData: any;
      if (testMode) {
        const base64Image = await simulateUpload(file);
        if (abortController.signal.aborted) {
          throw new Error("Upload canceled");
        }
        await minUploadTime;
        newImageUrl = base64Image;
        responseData = { data: { url: base64Image } };
      } else {
        const formData = new FormData();
        formData.append(apiConfig.formDataName || "", file);
        const uploadPromise = axios.request({
          method: apiConfig.uploadMethod || "POST",
          url: `${apiConfig.baseUrl}${apiConfig.uploadUrl}`,
          data: formData,
          signal: abortController.signal,
          onUploadProgress: (progressEvent) => {
            let progress = 0;
            if (progressEvent.total && progressEvent.total > 0) {
              progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100,
              );
            } else {
              const increment = Math.min(
                99,
                uploadProgress + (100 - uploadProgress) * 0.05,
              );
              progress = Math.round(increment);
            }
            if (isFirstUpdateRef.current && progress > 5) {
              progress = 5;
              isFirstUpdateRef.current = false;
            }
            targetProgressRef.current = Math.max(
              targetProgressRef.current,
              progress,
            );
            smoothProgressUpdate();
          },
          headers: apiConfig.uploadHeaders,
        });

        const [response] = await Promise.all([uploadPromise, minUploadTime]);
        targetProgressRef.current = 100;
        smoothProgressUpdate();
        await new Promise((resolve) => setTimeout(resolve, 300));

        newImageUrl = getNestedValue(
          response,
          apiConfig.responsePath || "data.data",
        );
        responseData = response.data;
        if (!newImageUrl) {
          throw new Error("Failed to extract image URL from response");
        }
      }

      if (currentImageUrl) {
        await handleDeleteImage();
      }
      setImgError(false);
      setLoading(false);
      onChangeImage(newImageUrl, responseData);
      apiConfig.onUploadSuccess?.(newImageUrl);
      setUploadProgress(0);
      targetProgressRef.current = 0;
      isFirstUpdateRef.current = true;
    } catch (error: any) {
      if (
        error.name === "CanceledError" ||
        error.message === "Upload canceled"
      ) {
      } else {
        handleError(error, {
          setError: setError,
          context: "uploading image",
          isTestMode: testMode,
        });
        apiConfig.onUploadError?.(error);
      }
      resetState();
    }
  };

  const handleDeleteImage = async () => {
    if (!currentImageUrl) return;
    setDeleting(true);
    setError(null);
    setImgError(false);
    apiConfig.onDeleteStart?.();
    try {
      if (testMode) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (
          enableAbortController &&
          abortControllerRef.current?.signal.aborted
        ) {
          throw new Error("Delete canceled");
        }
        onChangeImage("", undefined);
      } else {
        if (apiConfig.deleteUrl) {
          await axios.request({
            method: apiConfig.deleteMethod || "POST",
            url: `${apiConfig.baseUrl}${apiConfig.deleteUrl}`,
            data:
              typeof apiConfig.deleteBody === "function"
                ? apiConfig.deleteBody(currentImageUrl)
                : apiConfig.deleteBody,
            headers: apiConfig.deleteHeaders,
            signal: enableAbortController
              ? abortControllerRef.current?.signal
              : undefined,
          });
        }
        onChangeImage("", undefined);
      }
      apiConfig.onDeleteSuccess?.();
    } catch (error) {
      handleError(error, {
        setError: setError,
        context: "deleting image",
        isTestMode: testMode,
      });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (enableAbortController && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      resetState();
    };
  }, [enableAbortController]);

  return {
    uploadProgress,
    error,
    loading,
    deleting,
    handleImageChange,
    handleDeleteImage,
  };
};
