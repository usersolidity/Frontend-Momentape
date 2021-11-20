import React, {
    useContext,
    useRef,
    createContext,
    useState,
    Dispatch,
    SetStateAction,
    useReducer,
} from "react";
import type { SelfID } from "@self.id/web";

export type Creator = {
    artistName?: string;
    description?: string;
    youtube?: string;
    pfp?: string;
    cover?: string;
    id?: string;
};
interface IAuthContext {
    selfId?: React.MutableRefObject<SelfID | undefined>;
    address?: string;
    setAddress: Dispatch<SetStateAction<undefined>>;
    creatorProfile: Creator;
    setCreatorProfile: Dispatch<SetStateAction<Creator>>;
}

const AuthContext = createContext<IAuthContext>({
    setAddress: () => null,
    creatorProfile: {},
    setCreatorProfile: () => null,
});

export const useAuthContext = () => useContext<IAuthContext>(AuthContext);

export const AuthProvider = ({ children }: { children: any }) => {
    const selfId = useRef<SelfID>();
    const [address, setAddress] = useState();
    const [creatorProfile, setCreatorProfile] = useReducer(
        (curVals: any, newVals: any) => ({ ...curVals, ...newVals }),
        {}
    );
    return (
        <AuthContext.Provider
            value={{
                selfId,
                address,
                setAddress,
                creatorProfile,
                setCreatorProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
