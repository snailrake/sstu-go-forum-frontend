import React, {useState} from 'react';

const SlidePanel = ({isOpen, onClose, children}) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                right: isOpen ? 0 : '-300px',
                width: '300px',
                height: '100%',
                backgroundColor: '#fff',
                boxShadow: '-4px 0 6px rgba(0,0,0,0.1)',
                transition: 'right 0.3s ease',
                zIndex: 1000,
            }}
        >
            <div>{children}</div>
        </div>
    );
};

export default SlidePanel;
