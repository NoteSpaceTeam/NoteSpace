import {createContext, ReactElement} from "react";
import {communication, Communication} from "@communication/communication.ts";

const CommunicationContext = createContext<Communication>(communication)

type CommunicationProviderProps = {
    communication: Communication
    children: ReactElement
}

const CommunicationProvider= ({communication, children} : CommunicationProviderProps ) => {
    return (
        <CommunicationContext.Provider value={communication}>
            {children}
        </CommunicationContext.Provider>
    )
}

export {CommunicationContext, CommunicationProvider}