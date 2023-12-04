import React from "react";

const Section = (props) => {

    const {
        title,
        children,
        style,
        className
    } = props

    return (
        <div className={className} style={{ border: '1px solid #f1f1f1', ...style }}>
            <div style={{
                border: '1px solid #f1f1f1',
                background: '#f6f6f6',
                padding: '10px 15px',
                fontSize: '18px',
                fontWeight: '600'
            }}
            >{title}</div>
            <div style={{
                padding: '20px 15px',
                fontSize: '14px'
            }}>{children}</div>
        </div>
    )
}

export default Section