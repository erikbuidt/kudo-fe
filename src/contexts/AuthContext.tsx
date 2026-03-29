import { useMe } from "@/hooks/useUsers";
import type { KudoUser } from "@/types/kudo.type";
import { createContext, type ReactNode, useMemo, useState } from "react";

interface AuthContextInterface {
    isAuthenticated: boolean
    me: KudoUser | undefined,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    resetAuthenticated: () => void,
}

const AuthContext = createContext<AuthContextInterface>({
    isAuthenticated: !!window.localStorage.getItem('accessToken'),
    me: undefined,
    setIsAuthenticated: () => null,
    resetAuthenticated: () => null,
})

interface Props {
    children?: ReactNode
}
const AuthProvider = ({ children }: Props) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!window.localStorage.getItem('accessToken'))
    const resetAuthenticated = () => {
        setIsAuthenticated(false)
    }

    const { data: me } = useMe();
    console.log({ me })

    const value = useMemo(
        () => ({
            isAuthenticated,
            setIsAuthenticated,
            resetAuthenticated,
            me

        }),
        [isAuthenticated, me]
    )
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider, AuthContext }