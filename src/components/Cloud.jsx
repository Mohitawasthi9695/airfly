import React from 'react';

const Cloud = ({ x, y }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: '80px',
                height: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50px',
                zIndex: 5,
            }}
        >
            <div style={{
                position: 'absolute',
                top: '-25px',
                left: '15px',
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
            }}></div>
            <div style={{
                position: 'absolute',
                top: '-15px',
                left: '35px',
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
            }}></div>
        </div>
    );
};

export default Cloud;
