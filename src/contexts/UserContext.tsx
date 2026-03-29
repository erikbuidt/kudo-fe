import { useMe } from "@/hooks/useUsers";
import type { KudoUser } from "@/types/kudo.type";
import { createContext, type ReactNode, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

interface UserContextInterface {
    me: KudoUser | undefined,
    isAuthenticated: boolean,
    refetch: () => void
}

const UserContext = createContext<UserContextInterface>({
    me: undefined,
    isAuthenticated: false,
    refetch: () => { }
})

interface Props {
    children?: ReactNode
}
const UserProvider = ({ children }: Props) => {
    const { isAuthenticated } = useAuth();
    const { data: me, refetch } = useMe();

    const value = useMemo(
        () => ({
            me,
            isAuthenticated,
            refetch: () => { refetch() }
        }),
        [me, isAuthenticated, refetch]
    )
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export { UserProvider, UserContext }