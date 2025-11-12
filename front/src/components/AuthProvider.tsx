import { TDefaultComponentProps } from '../types/default.types.ts';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useSocketContext } from './SocketProvider.tsx';
import { SanitizedUser } from '../../../types';
import { Navigate, useLocation } from 'react-router';

type AuthContextType = {
    isAuth: boolean;
    userData: SanitizedUser | null;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    isAuth: false,
    userData: null,
    logout: () => {},
});
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

const AuthProvider = ({ children }: TDefaultComponentProps) => {
    const [userData, setUserData] = useState<SanitizedUser | null>(() => {
        const storedData = globalThis.sessionStorage.getItem('userData');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                return parsed.userData as SanitizedUser;
            } catch {
                return null;
            }
        }
        return null;
    });

    const location = useLocation();
    const { wsClient } = useSocketContext();
    const isAuth = Boolean(userData?.id);

    const logout = useCallback(() => {
        setUserData(null);
        globalThis.sessionStorage.removeItem('userData');
        wsClient?.send('MESSAGE', { type: 'LOGOUT' });
    }, [wsClient]);

    // Listen for authentication status updates from the server
    wsClient?.on('AUTH_RESULT', (data: { userData: SanitizedUser }) => {
        setUserData(data.userData);
        globalThis.sessionStorage.setItem('userData', JSON.stringify(data));
    });

    const value: AuthContextType = useMemo(
        () => ({ isAuth, userData, logout }),
        [isAuth, userData, logout],
    );

    if (!isAuth && location.pathname !== '/') {
        return <Navigate to="/" replace />;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
