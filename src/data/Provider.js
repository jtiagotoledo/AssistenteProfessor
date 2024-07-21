import React, {createContext, useState} from "react";

export const Context = createContext();

export default function Provider ({children}){

    return(
        <Context.Provider value={{
            }}>
            {children}
        </Context.Provider>
    )

}