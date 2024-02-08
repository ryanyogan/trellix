import { useNavigate } from "@remix-run/react";
import { Portal } from "./portal";

interface props {
  children: React.ReactNode;
  isOpen: boolean;
  ariaLabel?: string;
  className?: string;
  backTo?: string;
  triggerClose?: () => void;
}

export const Modal: React.FC<props> = ({
  children,
  isOpen,
  ariaLabel,
  className,
  backTo,
  triggerClose,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <Portal wrapperId="modal">
      <div
        className="fixed inset-0 overflow-y-auto bg-slate-800 bg-opacity-40"
        aria-labelledby={ariaLabel ?? "modal-title"}
        role="dialog"
        aria-modal="true"
        onClick={() => {
          triggerClose ? triggerClose() : navigate(backTo || "/home");
        }}
      ></div>
      <div className="fixed inset-0 pointer-events-none flex justify-center items-center max-h-screen overflow-scroll">
        <div
          className={`${className} p-4 bg-slate-900 pointer-events-auto max-h-screen rounded-md drop-shadow-lg`}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};
