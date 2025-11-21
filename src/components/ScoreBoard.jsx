import React from 'react';

const ScoreBoard = ({ score }) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                zIndex: 20,
            }}
        >
            Score: {score}
        </div>
    );
};

export default ScoreBoard;
