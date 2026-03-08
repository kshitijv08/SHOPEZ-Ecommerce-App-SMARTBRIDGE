import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast ${t.type}`}>
                        {t.type === 'success' && <FiCheckCircle />}
                        {t.type === 'error' && <FiAlertCircle />}
                        {t.type === 'info' && <FiInfo />}
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
