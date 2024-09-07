import React from 'react';

const GrassCell = () => (
    <div className="w-full h-full relative overflow-hidden bg-green-200">
        {[...Array(3)].map((_, i) => (
            <div
                key={i}
                className="absolute bottom-0 left-1/2 w-1 bg-green-600 origin-bottom"
                style={{
                    height: `${60 + Math.random() * 20}%`,
                    left: `${45 + i * 5}%`,
                    animation: `sway ${2 + Math.random()}s ease-in-out ${Math.random()}s infinite alternate`
                }}
            />
        ))}
    </div>
);

const GrassGrid = () => (
    <div className="w-full max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-10 gap-1 aspect-square">
            {[...Array(100)].map((_, i) => (
                <GrassCell key={i} />
            ))}
        </div>
    </div>
);

const Game2 = () => (
    <div className="min-h-screen bg-blue-200 flex items-center justify-center">

        <GrassGrid />
    </div>
);

export default Game2;