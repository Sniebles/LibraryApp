import React, { useState } from 'react'
import Button from './Button'
import './Popup.css'

function Popup({children, index, removePopup, width='auto', height='auto', focus=false}) {
    const [popupOut, setPopupOut] = useState(false)

    const handleAnimationEnd = () => {
        if (popupOut) {
            removePopup(index)
        }
    }

    const close = () => setPopupOut(true)

    const renderChildren = () => {
        if (typeof children === 'function') {
            return children(close)
        }
        if (React.isValidElement(children)) {
            return React.cloneElement(children, { close })
        }
        return children
    }

    return (
        <div className={`popup-overlay ${focus ? 'popup-focus' : ''}`}>
            <div
                onAnimationEnd={handleAnimationEnd}
                className={`popup ${popupOut? 'popup-close':''}`}
                style={{width, height}}
            >
                <Button className='popup-button' onClick={close}>×</Button>
                <div className='popup-content'>{renderChildren()}</div>
            </div>
        </div>
    )
}

export default Popup