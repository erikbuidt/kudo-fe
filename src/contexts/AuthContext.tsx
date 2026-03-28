import { createContext, type ReactNode, useMemo, useState } from "react";

interface AuthContextInterface {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    resetAuthenticated: () => void
}

const AuthContext = createContext<AuthContextInterface>({
    isAuthenticated: !!window.localStorage.getItem('accessToken'),
    setIsAuthenticated: () => null,
    resetAuthenticated: () => null
})

interface Props {
    children?: ReactNode
}
const AuthProvider = ({ children }: Props) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!window.localStorage.getItem('accessToken'))
    const resetAuthenticated = () => {
        setIsAuthenticated(false)
    }

    const value = useMemo(
        () => ({
            isAuthenticated,
            setIsAuthenticated,
            resetAuthenticated
        }),
        [isAuthenticated]
    )
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider, AuthContext }