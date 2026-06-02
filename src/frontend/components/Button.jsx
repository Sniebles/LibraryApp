import { useState } from 'react'
import './Button.css'

function Button({text, type, onClick, className, children}) {
    return (
        <button className={`button-container ${className || ''}`} type={type} onClick={onClick}>
            <div>{text}{children}</div>
        </button>
    )
}

export default Button