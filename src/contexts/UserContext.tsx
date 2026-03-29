import { useMe } from "@/hooks/useUsers";
import type { KudoUser } from "@/types/kudo.type";
import { createContext, type ReactNode, useMemo } from "react";

interface UserContextInterface {
    me: KudoUser | undefined,
}

const UserContext = createContext<UserContextInterface>({
    me: undefined,
})

interface Props {
    children?: ReactNode
}
const UserProvider = ({ children }: Props) => {
    const { data: me } = useMe();

    const value = useMemo(
        () => ({
            me
        }),
        [me]
    )
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export { UserProvider, UserContext }