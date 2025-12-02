import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Modal from "./Modal";
import { ImZoomIn, ImZoomOut } from "react-icons/im";
import {
  MdOutlineRotate90DegreesCcw,
  MdOutlineRotate90DegreesCw,
} from "react-icons/md";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

function useImagePreview() {
  const [openPreview, setOpenPreview] = useState({
    status: false,
    url: "",
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const [isSliderDragging, setIsSliderDragging] = useState(false);

  const openImage = useCallback((url: string) => {
    if (url) {
      setOpenPreview({ status: true, url });
      setScale(1);
      setTranslate({ x: 0, y: 0 });
      setRotate(0);
    }
  }, []);

  const closeImage = useCallback(() => {
    setOpenPreview({ status: false, url: "" });
    setIsFullscreen(false);
    setIsPanning(false);
    setTranslate({ x: 0, y: 0 });
    setScale(1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      const container = containerRef.current;
      if (container) {
        container.requestFullscreen?.().catch((err: any) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`
          );
        });
      }
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!openPreview.url) return;

    const img = new Image();
    img.src = openPreview.url;

    img.onload = () => {
      setImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      console.error("Failed to load image");
      setOpenPreview({ status: false, url: "" });
    };
  }, [openPreview.url]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openPreview.status]);

  const fitScale = useMemo(() => {
    if (!imageSize.width || !imageSize.height) return 1;
    if (!containerDimensions.width || !containerDimensions.height) return 1;

    return Math.min(
      containerDimensions.width / imageSize.width,
      containerDimensions.height / imageSize.height
    );
  }, [
    containerDimensions.height,
    containerDimensions.width,
    imageSize.height,
    imageSize.width,
  ]);

  const baseScale = useMemo(() => {
    const minDisplaySize = 220;
    const enforcedMin = Math.max(imageSize.width, imageSize.height)
      ? minDisplaySize / Math.max(imageSize.width, imageSize.height)
      : 1;
    return Math.max(fitScale, enforcedMin);
  }, [fitScale, imageSize.height, imageSize.width]);

  const minScale = useMemo(() => Math.max(0.2, baseScale * 0.35), [baseScale]);

  const maxScale = useMemo(() => Math.max(8, baseScale * 6), [baseScale]);

  useEffect(() => {
    if (openPreview.status && baseScale) {
      setScale(baseScale);
      setTranslate({ x: 0, y: 0 });
    }
  }, [baseScale, openPreview.status]);

  const clamp = useCallback(
    (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max),
    []
  );

  const applyScale = useCallback(
    (nextScale: number, origin?: { x: number; y: number }) => {
      setScale((currentScale) => {
        const safeScale = clamp(nextScale, minScale, maxScale);
        if (!origin || !containerRef.current) {
          return safeScale;
        }

        const { width, height, left, top } =
          containerRef.current.getBoundingClientRect();
        const originX = origin.x - (left + width / 2);
        const originY = origin.y - (top + height / 2);

        const ratio = safeScale / currentScale;
        setTranslate((prev) => ({
          x: prev.x * ratio + originX * (1 - ratio),
          y: prev.y * ratio + originY * (1 - ratio),
        }));

        return safeScale;
      });
    },
    [clamp, maxScale, minScale]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      applyScale(scale * (1 + delta), { x: e.clientX, y: e.clientY });
    },
    [applyScale, scale]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning) return;
      e.preventDefault();
      const deltaX = e.clientX - pointerStartRef.current.x;
      const deltaY = e.clientY - pointerStartRef.current.y;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      setTranslate((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    },
    [isPanning]
  );

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleResetView = useCallback(() => {
    setTranslate({ x: 0, y: 0 });
    setScale(baseScale || 1);
  }, [baseScale]);

  const handleActualSize = useCallback(() => {
    setTranslate({ x: 0, y: 0 });
    applyScale(1);
  }, [applyScale]);

  const handleDoubleClick = useCallback(() => {
    if (Math.abs(scale - fitScale) < 0.01) {
      handleActualSize();
    } else {
      handleResetView();
    }
  }, [fitScale, handleActualSize, handleResetView, scale]);

  const handleZoomStep = useCallback(
    (direction: "in" | "out") => {
      const step = direction === "in" ? 0.15 : -0.15;
      applyScale(scale * (1 + step));
    },
    [applyScale, scale]
  );

  const updateScaleFromSlider = useCallback(
    (clientY: number) => {
      const track = sliderTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = clamp((clientY - rect.top) / rect.height, 0, 1);
      const target = maxScale - ratio * (maxScale - minScale);
      applyScale(target);
    },
    [applyScale, clamp, maxScale, minScale]
  );

  const handleSliderPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsSliderDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
      updateScaleFromSlider(e.clientY);
    },
    [updateScaleFromSlider]
  );

  const handleSliderPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isSliderDragging) return;
      updateScaleFromSlider(e.clientY);
    },
    [isSliderDragging, updateScaleFromSlider]
  );

  const handleSliderPointerUp = useCallback(() => {
    setIsSliderDragging(false);
  }, []);

  const calculateInitialSize = useCallback(() => {
    if (!imageSize.width || !imageSize.height)
      return { width: 600, height: 600 };

    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    const ratio = Math.min(
      maxWidth / imageSize.width,
      maxHeight / imageSize.height,
      1
    );

    return {
      width: Math.floor(imageSize.width * ratio),
      height: Math.floor(imageSize.height * ratio),
    };
  }, [imageSize]);

  const modalImagePreview = useCallback(() => {
    const initialSize = calculateInitialSize();
    const { width, height } = imageSize;
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : initialSize.width;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : initialSize.height;
    const minStage = 340;
    const wrapperWidth = Math.min(
      Math.max(initialSize.width, minStage),
      viewportWidth * 0.92,
    );
    const wrapperHeight = Math.min(
      Math.max(initialSize.height, minStage),
      viewportHeight * 0.82,
    );
    const isCompact = wrapperWidth < 420;
    const buttonSide = isCompact ? 34 : 40;
    const sliderTrackHeight = isCompact ? 140 : 160;
    const sliderPadding = isCompact ? "0.6rem 0.5rem" : "0.75rem 0.75rem";

    const containerStyle: React.CSSProperties = {
      width: "100%",
      maxWidth: "1200px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      position: "relative",
      margin: "0 auto",
      padding: "0.75rem",
      gap: "0.75rem",
    };

    const imageWrapperStyle: React.CSSProperties = {
      position: "relative",
      width: `${wrapperWidth}px`,
      height: `${wrapperHeight}px`,
      maxWidth: "1200px",
      maxHeight: "82vh",
    };

    const imageContainerStyle: React.CSSProperties = {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "14px",
      boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
      background:
        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06), transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.04), transparent 30%), #0b0d12",
      cursor: scale > fitScale ? (isPanning ? "grabbing" : "grab") : "default",
      touchAction: "none",
    };

    const controlsContainerStyle: React.CSSProperties = {
      position: "absolute",
      top: "1rem",
      left: "1rem",
      right: "1rem",
      display: "flex",
      gap: isCompact ? "0.35rem" : "0.5rem",
      zIndex: 10,
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
    };

    const buttonStyle: React.CSSProperties = {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: "0.55rem",
      width: `${buttonSide}px`,
      height: `${buttonSide}px`,
      backdropFilter: "blur(16px)",
      transition: "background-color 0.2s ease",
      border: "none",
      cursor: "pointer",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const buttonHoverStyle: React.CSSProperties = {
      ...buttonStyle,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    };

    const infoStyle: React.CSSProperties = {
      position: "absolute",
      bottom: "1rem",
      left: "1rem",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: "0.375rem",
      padding: "0.25rem 0.5rem",
      backdropFilter: "blur(16px)",
      fontSize: "0.75rem",
      lineHeight: "1rem",
    };

    const loadingStyle: React.CSSProperties = {
      minHeight: "300px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const verticalSliderStyle: React.CSSProperties = {
      position: "absolute",
      right: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 12,
      display: "flex",
      flexDirection: "column",
      gap: "0.4rem",
      alignItems: "center",
      padding: sliderPadding,
      minWidth: "46px",
      borderRadius: "999px",
      backgroundColor: "rgba(0,0,0,0.25)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    };

    return (
      <Modal
        title="مشاهده عکس"
        isOpen={openPreview.status}
        onClose={closeImage}
        className="image-preview-modal"
        size="xl"
      >
        {openPreview.url && width && height ? (
          <div style={containerStyle}>
            <div style={imageWrapperStyle}>
              <div
                ref={containerRef}
                style={imageContainerStyle}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onDoubleClick={handleDoubleClick}
              >
                <img
                  src={openPreview.url}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: `${imageSize.width}px`,
                    height: `${imageSize.height}px`,
                    maxWidth: "none",
                    maxHeight: "none",
                    transform: `translate(-50%, -50%) translate(${translate.x}px, ${translate.y}px) scale(${scale}) rotate(${rotate}deg)`,
                    transformOrigin: "center center",
                    userSelect: "none",
                    pointerEvents: "none",
                    transition: isPanning ? "none" : "transform 0.15s ease-out",
                    filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.4))",
                  }}
                />
              </div>
              <div style={controlsContainerStyle}>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  <button
                    onClick={() => handleZoomStep("out")}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.3)";
                    }}
                    title="Zoom Out"
                  >
                    <ImZoomOut />
                  </button>
                  <button
                    onClick={() => handleZoomStep("in")}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.3)";
                    }}
                    title="Zoom In"
                  >
                    <ImZoomIn />
                  </button>
                  <button
                    onClick={handleResetView}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.3)";
                    }}
                    title="Fit to screen"
                  >
                    Fit
                  </button>
                  <button
                    onClick={handleActualSize}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.3)";
                    }}
                    title="Actual size"
                  >
                    1:1
                  </button>
                  <button
                    onClick={() => {
                      setRotate((prev) => (prev + 90) % 360);
                    }}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.3)";
                    }}
                    title="Rotate Clockwise"
                  >
                    <MdOutlineRotate90DegreesCw />
                  </button>
                  <button
                    onClick={() => {
                      setRotate((prev) => (prev - 90 + 360) % 360);
                    }}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.3)";
                    }}
                    title="Rotate Counter-Clockwise"
                  >
                    <MdOutlineRotate90DegreesCcw />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.3)";
                    }}
                    title={
                      isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                    }
                  >
                    {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
                  </button>
                </div>
              </div>
              <div style={verticalSliderStyle}>
                <div
                  ref={sliderTrackRef}
                  onPointerDown={handleSliderPointerDown}
                  onPointerMove={handleSliderPointerMove}
                  onPointerUp={handleSliderPointerUp}
                    onPointerLeave={handleSliderPointerUp}
                    style={{
                      position: "relative",
                      width: "10px",
                      height: `${sliderTrackHeight}px`,
                      borderRadius: "9999px",
                      background:
                      "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    touchAction: "none",
                  }}
                  aria-label="Zoom slider"
                  role="slider"
                  aria-valuemin={Math.round(minScale * 100)}
                  aria-valuemax={Math.round(maxScale * 100)}
                  aria-valuenow={Math.round(scale * 100)}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom:
                        ((scale - minScale) / (maxScale - minScale)) * 100 +
                        "%",
                      left: "50%",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle at 30% 30%, #fff, #d1d5db 45%, #0f172a 100%)",
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.35)",
                      transform: "translate(-50%, 50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
              <div style={infoStyle}>
                {Math.round(scale * 100)}% • {width}×{height} • Fit{" "}
                {Math.round(fitScale * 100)}%
              </div>
            </div>
          </div>
        ) : (
          <div style={loadingStyle}>
            <p>Loading...</p>
          </div>
        )}
      </Modal>
    );
  }, [
    openPreview.status,
    openPreview.url,
    imageSize,
    rotate,
    translate.x,
    translate.y,
    scale,
    isFullscreen,
    toggleFullscreen,
    calculateInitialSize,
    closeImage,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    handleZoomStep,
    handleResetView,
    handleActualSize,
    fitScale,
  ]);

  return { modalImagePreview, openImage, closeImage };
}

export default useImagePreview;
