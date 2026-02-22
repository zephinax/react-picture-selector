import React, { useEffect, useRef } from "react";
import { ModalProps } from "./types";
import ReactDOM from "react-dom";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = "fit",
  overflowY = "overflow-y-auto",
  childrenClass,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node;
      // Close when the click lands outside of the modal content or on the overlay itself.
      if (
        modalRef.current &&
        !modalRef.current.contains(targetNode) &&
        (overlayRef.current?.contains(targetNode) ?? true)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const listenerOptions: AddEventListenerOptions = { capture: true };

    document.addEventListener("pointerdown", handlePointerDown, listenerOptions);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
        listenerOptions
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Size mapping
  const sizeStyles = {
    sm: { maxWidth: "370px" },
    md: { maxWidth: "750px" },
    lg: { maxWidth: "1100px" },
    xl: { maxWidth: "80vw" },
    full: { maxWidth: "90vw" },
    fit: { maxWidth: "90vw" },
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "rgba(0, 0, 0, 0.424)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: isOpen ? "translateY(0)" : "translateY(100%)",
    transition: "transform 500ms ease",
  };

  const modalStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 9999,
    borderTopLeftRadius: "1rem",
    borderTopRightRadius: "1rem",
    borderBottomLeftRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem",
    marginLeft: 0,
    marginRight: 0,
    transition: "all 300ms ease 200ms",
    opacity: isOpen ? 1 : 0,
    width: "auto",
    maxWidth: "90vw",
    ...sizeStyles[size as keyof typeof sizeStyles],
  };

  const contentStyle: React.CSSProperties = {
    maxHeight: "80svh",
    borderRadius: "1rem",
    overflowY: overflowY === "overflow-y-auto" ? "auto" : "visible",
  };

  return (
    isOpen &&
    ReactDOM.createPortal(
      <div onClick={handleClose} style={overlayStyle} ref={overlayRef}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={modalStyle}
          className={className}
          ref={modalRef}
        >
          <div style={contentStyle} className={childrenClass}>
            {children}
          </div>
        </div>
      </div>,
      document.body,
    )
  );
};

export default Modal;
