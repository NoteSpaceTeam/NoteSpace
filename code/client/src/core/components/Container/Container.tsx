import React from "react";
import './Container.scss'


interface ContainerProps{
    className?: string,
    children: React.ReactNode,
}

export default function ({className = "", children} : ContainerProps){
    return (
        <div className={`container ${className}`}>
            {children}
        </div>
    )
}