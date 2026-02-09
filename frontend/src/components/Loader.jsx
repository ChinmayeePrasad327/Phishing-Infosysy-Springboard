import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Loader = ({ text = "Checking for threats..." }) => {
    const spinnerRef = useRef(null);

    useEffect(() => {
        gsap.to(spinnerRef.current, {
            rotate: 360,
            duration: 1.5,
            repeat: -1,
            ease: "none"
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div
                ref={spinnerRef}
                className="w-16 h-16 border-4 border-accent-ai/20 border-t-accent-ai rounded-full"
            />
            <div className="flex flex-col items-center">
                <p className="text-accent-ai font-poppins font-semibold animate-pulse">
                    {text}
                </p>
                <span className="text-gray-500 text-sm mt-2">Neural network analyzing features...</span>
            </div>
        </div>
    );
};

export default Loader;
