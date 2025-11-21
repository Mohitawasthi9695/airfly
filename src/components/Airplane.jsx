import React from 'react';

const Airplane = ({ position, rotation }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: '100px', // Fixed horizontal position
                top: `${position}px`,
                width: '40px',
                height: '30px',
                backgroundColor: '#ff5722',
                borderRadius: '5px',
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.1s ease',
                zIndex: 10,
            }}
        >
            {/* Simple airplane shape using CSS */}
            <div style={{
                position: 'absolute',
                right: '-10px',
                top: '10px',
                width: '15px',
                height: '10px',
                backgroundColor: '#ff5722',
                borderRadius: '50%',
            }}></div>
            <div style={{
                position: 'absolute',
                left: '10px',
                top: '-15px',
                width: '10px',
                height: '25px',
                backgroundColor: '#e64a19',
                transform: 'skewX(-20deg)',
            }}></div>
        </div>
    );
};

export default Airplane;
