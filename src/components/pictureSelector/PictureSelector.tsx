import { useState, useRef, useMemo, useCallback } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi2";
import { apiConfig, ProfileSelectorPropsTypes } from "./types";
import useImagePreview from "./useImagePreview";
import { LuRefreshCcw } from "react-icons/lu";
import { useImageHandler } from "./useImageHandler";

const defaultApiConfig = {
  uploadUrl: "UPLOAD_URL",
  baseUrl: "BASE_URL",
  responsePath: "data",
  formDataName: "File",
  deleteBody: {},
  deleteMethod: "POST",
  uploadMethod: "POST",
  additionalHeaders: {
    "Content-Type": "multipart/form-data",
  },
  onUploadSuccess: () => {},
  onUploadError: () => {},
  onDeleteStart: () => {},
  onDeleteSuccess: () => {},
} as apiConfig;

const PictureSelector = ({
  apiConfig,
  additionalClassNames = {
    title: "",
    titleContainer: "",
    delete: "",
    edit: "",
    image: "",
  },
  colors,
  imageUrl,
  type = "profile",
  onChangeImage,
  viewOnly = false,
  title,
  size = 180,
  showProgressRing = true,
  blurOnProgress = true,
  enableAbortController = true,
  testMode = false,
  testUploadDelay = 1000,
}: ProfileSelectorPropsTypes) => {
  const { modalImagePreview, openImage } = useImagePreview();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgError, setImgError] = useState(false);
  const isCircle = type === "profile";
  const mergedApiConfig = {
    ...defaultApiConfig,
    ...apiConfig,
    additionalHeaders: {
      ...defaultApiConfig.additionalHeaders,
      ...(apiConfig?.additionalHeaders || {}),
    },
  };

  const {
    uploadProgress,
    error,
    loading,
    deleting,
    handleImageChange,
    handleDeleteImage,
  } = useImageHandler({
    apiConfig: mergedApiConfig,
    testMode,
    testUploadDelay,
    onChangeImage,
    enableAbortController,
    currentImageUrl: imageUrl,
    setImgError,
  });
  const defaultColors = {
    primary: "#2a84fa",
    error: "#EF4444",
    progress: "#d24670",
    placeholder: "#BCBEC0",
    text: "#fafafa",
    textDisabled: "#e6e6e6",
  };
  const [isDragging, setIsDragging] = useState(false);
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const radius = useMemo(() => size / 2, [size]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const strokeDashoffset = useMemo(
    () => (1 - uploadProgress / 100) * circumference,
    [uploadProgress, circumference]
  );
  const buttonPosition = useMemo(() => size * 0.06, [size]);
  const buttonSize = useMemo(() => size * 0.2, [size]);
  const mergedColors = useMemo(
    () => ({ ...defaultColors, ...colors }),
    [colors]
  );
  const imageContainerStyle = useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: isCircle ? "50%" : "12%",
    }),
    [size, isCircle]
  );

  return (
    <div
      dir="ltr"
      style={{
        maxWidth: "20rem",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        padding: "1rem",
        gap: "0.75rem",
        paddingTop: "0",
        borderRadius: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyItems: "center",
          justifyContent: "center",
        }}
        className={`${additionalClassNames.titleContainer || ""}`}
      >
        {title && <h3 className={additionalClassNames.title || ""}>{title}</h3>}
      </div>
      <div
        style={{
          display: "flex",
          justifyItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {modalImagePreview()}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              const file = files[0];
              if (file.type.startsWith("image/")) {
                handleImageChange({
                  target: { files: [file] },
                } as unknown as React.ChangeEvent<HTMLInputElement>);
              }
            }
          }}
          style={{
            ...imageContainerStyle,
            position: "relative",
            outlineWidth: isDragging ? "2px" : undefined,
            outlineStyle: isDragging ? "dashed" : undefined,
            outlineColor: isDragging ? "#3b82f6" : undefined,
            backgroundColor: isDragging ? "rgba(147,197,253,0.5)" : undefined,
            transitionProperty: isDragging ? "background-color" : undefined,
            transitionDuration: isDragging ? "100ms" : undefined,
          }}
        >
          {imageUrl ? (
            <img
              alt=""
              title={`version: ${__APP_VERSION__}`}
              draggable="false"
              src={
                imgError
                  ? "data:image/svg+xml,%3Csvg%20version%3D%221.0%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22500.000000pt%22%20height%3D%22500.000000pt%22%20viewBox%3D%22-100%20-50%20500.000000%20500.000000%22%20preserveAspectRatio%3D%22xMidYMid%20meet%22%3E%3Cg%20transform%3D%22translate(0.000000%2C400.000000)%20scale(0.100000%2C-0.100000)%22%20fill%3D%22%23000000%22%20stroke%3D%22none%22%3E%3Cpath%20d%3D%22M480%202005%20l0%20-1305%201020%200%201020%200%200%201125%200%201125%20-100%200%20-100%200%200%2095%200%2095%20-100%200%20-100%200%200%2085%200%2085%20-820%200%20-820%200%200%20-1305z%20m1078%20753%20l2%20-378%20380%200%20380%200%200%20-740%200%20-740%20-845%200%20-845%200%200%201120%200%201120%20463%20-2%20462%20-3%203%20-377z%20m564%20290%20l3%20-93%2098%20-3%2097%20-3%200%20-190%200%20-189%20-282%202%20-283%203%20-3%20270%20c-1%20148%200%20275%203%20282%203%2010%2048%2013%20184%2013%20l180%200%203%20-92z%22%2F%3E%3Cpath%20d%3D%22M970%202570%20l0%20-190%20105%200%20105%200%200%20190%200%20190%20-105%200%20-105%200%200%20-190z%22%2F%3E%3Cpath%20d%3D%22M1180%201565%20l0%20-95%20-105%200%20-105%200%200%20-105%200%20-106%20103%203%20102%203%203%20103%203%20102%20317%20-2%20317%20-3%203%20-102%203%20-103%2099%200%20100%200%200%20105%200%20105%20-100%200%20-100%200%200%2095%200%2095%20-320%200%20-320%200%200%20-95z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                  : imageUrl
              }
              className={`${additionalClassNames.image || ""}`}
              onDragStart={(e) => {
                e.preventDefault();
              }}
              aria-describedby="image-description"
              onError={() => setImgError(true)}
              onClick={() => openImage(imageUrl)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer",
                borderRadius: isCircle ? "50%" : "12%",
                userSelect: "none",
              }}
            />
          ) : (
            <div
              style={{
                borderRadius: isCircle ? "50%" : "12%",
                display: "flex",
                width: "100%",
                height: "100%",
                justifyItems: "center",
                justifyContent: "center",
              }}
            >
              {isCircle ? (
                <svg
                  width={size}
                  height={size}
                  viewBox="-2 -2 110 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="53.5"
                    cy="52.5"
                    r="52.5"
                    stroke={mergedColors.placeholder}
                    strokeWidth="2"
                  />
                  <path
                    d="M53 106C38.8432 106 25.5338 100.487 15.5234 90.4766C5.51283 80.4662 0 67.1568 0 53C0 38.8432 5.51283 25.5338 15.5234 15.5234C25.5338 5.51283 38.8432 0 53 0C67.1568 0 80.4662 5.51283 90.4766 15.5234C100.487 25.5338 106 38.8432 106 53C106 67.1568 100.487 80.4662 90.4766 90.4766C80.4662 100.487 67.1568 106 53 106ZM53 4.14062C26.0588 4.14062 4.14062 26.0588 4.14062 53C4.14062 79.9412 26.0588 101.859 53 101.859C79.9412 101.859 101.859 79.9412 101.859 53C101.859 26.0588 79.9412 4.14062 53 4.14062Z"
                    fill={mergedColors.placeholder}
                    stroke={mergedColors.placeholder}
                    strokeWidth="2"
                  />
                  <path
                    d="M53 62.0538C41.6963 62.0538 32.5 52.8577 32.5 41.554C32.5 30.2503 41.6961 21.054 53 21.054C64.3039 21.054 73.5001 30.2501 73.5001 41.554C73.5001 52.8577 64.3037 62.0538 53 62.0538ZM53 25.1946C43.9795 25.1946 36.6406 32.5334 36.6406 41.554C36.6406 50.5745 43.9795 57.9132 53 57.9132C62.0206 57.9132 69.3594 50.5745 69.3594 41.554C69.3594 32.5334 62.0206 25.1946 53 25.1946Z"
                    fill={mergedColors.placeholder}
                    stroke={mergedColors.placeholder}
                    strokeWidth="2"
                  />
                  <path
                    d="M88.4081 91.6778C87.4235 91.6778 86.5507 90.9731 86.3724 89.9698C83.4945 73.7943 69.4594 62.0537 53 62.0537C36.5406 62.0537 22.5057 73.794 19.6276 89.9698C19.4274 91.0956 18.3527 91.8459 17.2267 91.6455C16.1008 91.4453 15.3505 90.3702 15.5509 89.2446C17.0956 80.5627 21.6741 72.6276 28.443 66.9005C35.293 61.1049 44.014 57.9131 53 57.9131C61.986 57.9131 70.707 61.1049 77.557 66.9005C84.3259 72.6276 88.9044 80.5627 90.4491 89.2446C90.6495 90.3702 89.8992 91.4451 88.7733 91.6455C88.6508 91.6673 88.5284 91.6778 88.4081 91.6778Z"
                    fill={mergedColors.placeholder}
                    stroke={mergedColors.placeholder}
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg
                  width={size}
                  height={size}
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs></defs>
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Icon-Set"
                      transform="translate(-360.000000, -99.000000)"
                      fill={mergedColors.placeholder}
                    >
                      <path
                        d="M368,109 C366.896,109 366,108.104 366,107 C366,105.896 366.896,105 368,105 C369.104,105 370,105.896 370,107 C370,108.104 369.104,109 368,109 L368,109 Z M368,103 C365.791,103 364,104.791 364,107 C364,109.209 365.791,111 368,111 C370.209,111 372,109.209 372,107 C372,104.791 370.209,103 368,103 L368,103 Z M390,116.128 L384,110 L374.059,120.111 L370,116 L362,123.337 L362,103 C362,101.896 362.896,101 364,101 L388,101 C389.104,101 390,101.896 390,103 L390,116.128 L390,116.128 Z M390,127 C390,128.104 389.104,129 388,129 L382.832,129 L375.464,121.535 L384,112.999 L390,118.999 L390,127 L390,127 Z M364,129 C362.896,129 362,128.104 362,127 L362,126.061 L369.945,118.945 L380.001,129 L364,129 L364,129 Z M388,99 L364,99 C361.791,99 360,100.791 360,103 L360,127 C360,129.209 361.791,131 364,131 L388,131 C390.209,131 392,129.209 392,127 L392,103 C392,100.791 390.209,99 388,99 L388,99 Z"
                        id="image-picture"
                      ></path>
                    </g>
                  </g>
                </svg>
              )}
            </div>
          )}
          {loading &&
            ((blurOnProgress && imageUrl) ||
              (!showProgressRing && !imageUrl)) && (
              <div
                style={{
                  margin: "0 auto",
                  top: "0",
                  right: "0",
                  bottom: "0",
                  left: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: `${size}px !important`,
                  height: `${size}px !important`,
                  position: "absolute",
                  borderRadius: isCircle ? "50%" : "12%",
                  backdropFilter: "blur(4px)",
                  zIndex: 5,
                  WebkitBackdropFilter: "blur(4px)",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: buttonSize * 0.5,
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {Math.round(uploadProgress)}%
                </div>
              </div>
            )}

          {showProgressRing &&
          uploadProgress > 0 &&
          uploadProgress < 100 &&
          isCircle ? (
            <svg
              style={{
                position: "absolute",
                zIndex: 6,
                top: "0",
                left: "0",
                pointerEvents: "none",
              }}
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - size * 0.035}
                fill="none"
                stroke={mergedColors.progress}
                strokeWidth={size * (10 / 180)}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
          ) : (
            showProgressRing &&
            uploadProgress > 0 &&
            uploadProgress < 100 && (
              <div>
                {(() => {
                  const rectWidth = size * 0.94;
                  const rectHeight = size * 0.94;
                  const rectPerimeter = 2 * (rectWidth + rectHeight);
                  const rectProgressOffset =
                    rectPerimeter * (1 - uploadProgress / 100);

                  return (
                    <svg
                      width={size}
                      height={size}
                      style={{
                        position: "absolute",
                        top: "0",
                        zIndex: 6,
                        left: "0",
                      }}
                      viewBox={`0 0 ${size} ${size}`}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x={size * 0.03}
                        y={size * 0.03}
                        rx={size * 0.09}
                        width={rectWidth}
                        height={rectHeight}
                        fill="none"
                        stroke={mergedColors.progress}
                        strokeWidth={size * (10 / 180)}
                        strokeDasharray={rectPerimeter}
                        strokeDashoffset={rectProgressOffset}
                        style={{
                          transition: "stroke-dashoffset 0.3s ease",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                        }}
                      />
                    </svg>
                  );
                })()}
              </div>
            )
          )}
          {!viewOnly && (
            <>
              <button
                type="button"
                aria-label="Edit profile picture"
                style={{
                  backgroundColor: mergedColors.primary,
                  width: `${buttonSize}px`,
                  height: `${buttonSize}px`,
                  bottom: `${buttonPosition}px`,
                  right: `${buttonPosition}px`,
                  borderRadius: isCircle ? "50%" : "28%",
                  position: "absolute",
                  padding: "0.25rem",
                  cursor: "pointer",
                  transition: "transform 150ms ease-in-out",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
                className={`${additionalClassNames.edit || ""}`}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.9)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={triggerFileInput}
                disabled={loading}
              >
                <MdOutlineEdit
                  style={{
                    display: "flex",
                    justifyItems: "center",
                    justifyContent: "center",
                  }}
                  color={
                    loading ? mergedColors.text : mergedColors.textDisabled
                  }
                  size={buttonSize * 0.55}
                />
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.9)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  aria-label="Delete profile picture"
                  style={{
                    backgroundColor: mergedColors.error,
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    bottom: `${buttonPosition}px`,
                    left: `${buttonPosition}px`,
                    borderRadius: isCircle ? "50%" : "28%",
                    position: "absolute",
                    padding: "0.25rem",
                    cursor: "pointer",
                    transition: "transform 150ms ease-in-out",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                  className={`${additionalClassNames.delete || ""}`}
                  onClick={handleDeleteImage}
                  disabled={loading}
                >
                  {deleting ? (
                    <>
                      <LuRefreshCcw
                        color={
                          loading
                            ? mergedColors.text
                            : mergedColors.textDisabled
                        }
                        size={buttonSize * 0.5}
                        style={{
                          display: "flex",
                          justifyItems: "center",
                          justifyContent: "center",
                          animation: "spin 1s linear infinite",
                          transformOrigin: "center",
                        }}
                      />
                      <style>
                        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
                      </style>
                    </>
                  ) : (
                    <HiOutlineTrash
                      style={{
                        display: "flex",
                        justifyItems: "center",
                        justifyContent: "center",
                      }}
                      color={
                        loading ? mergedColors.text : mergedColors.textDisabled
                      }
                      size={buttonSize * 0.55}
                    />
                  )}
                </button>
              )}
            </>
          )}
        </div>
        <span
          id="image-description"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: "0",
          }}
        >
          {imageUrl ? "Current profile picture" : "No image selected"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            display: "none",
          }}
          disabled={loading}
          aria-label="Upload image"
          aria-describedby="file-upload-description"
        />
        <span
          id="file-upload-description"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: "0",
          }}
        >
          Upload an image file for your profile picture
        </span>
      </div>
      {error && (
        <div
          style={{
            display: "flex",
            justifyItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#dc2626",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default PictureSelector;
export type { ProfileSelectorPropsTypes };
