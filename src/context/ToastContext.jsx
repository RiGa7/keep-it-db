import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

/**
 * showToast(message, type)
 *   type: "error" | "success"  (default: "error")
 */
export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ visible: false, message: "", type: "error" });
    const timerRef = useRef(null);

    const showToast = useCallback((message, type = "error") => {
        if (timerRef.current) clearTimeout(timerRef.current);

        setToast({ visible: true, message, type });

        timerRef.current = setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 4000);
    }, []);

    const dismiss = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setToast((prev) => ({ ...prev, visible: false }));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastUI toast={toast} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}

/* ── Internal toast UI ─────────────────────────────────────────────────── */

const STYLES = {
    error: {
        bg: "#ffffff",
        border: "#F62440",
        color: "#F62440",
        iconStroke: "#F62440",
    },
    success: {
        bg: "var(--bg-secondary)",
        border: "var(--border-color)",
        color: "var(--accent-color)",
        iconStroke: "var(--accent-color)",
    },
};

function ToastUI({ toast, onDismiss }) {
    const s = STYLES[toast.type] ?? STYLES.error;

    return (
        <div
            style={{
                position: "fixed",
                top: toast.visible ? "24px" : "-100px",
                left: "50%",
                transform: "translateX(-50%)",
                transition: "top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                zIndex: 9999,
                minWidth: "300px",
                maxWidth: "90vw",
                pointerEvents: toast.visible ? "auto" : "none",
            }}
            role="alert"
            aria-live="assertive"
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: "14px",
                    padding: "12px 18px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
                    backdropFilter: "blur(12px)",
                    color: s.color,
                    fontSize: "14px",
                    fontWeight: 500,
                }}
            >
                {toast.type === "error" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.iconStroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.iconStroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9 12l2 2 4-4" />
                    </svg>
                )}

                <span style={{ flex: 1 }}>{toast.message}</span>

                <button
                    onClick={onDismiss}
                    style={{
                        background: "none",
                        border: "none",
                        color: s.color,
                        cursor: "pointer",
                        padding: "0 2px",
                        fontSize: "14px",
                        lineHeight: 1,
                        opacity: 0.6,
                    }}
                    aria-label="Dismiss"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
