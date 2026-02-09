import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAPAnimations = () => {
    const revealOnScroll = (elements) => {
        elements.forEach((el) => {
            gsap.fromTo(
                el,
                {
                    opacity: 0,
                    y: 50,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });
    };

    const staggerReveal = (container, children, delay = 0.2) => {
        gsap.fromTo(
            children,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: delay,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                },
            }
        );
    };

    const pageEntry = (element) => {
        gsap.fromTo(
            element,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: 'power2.inOut' }
        );
    };

    return { revealOnScroll, staggerReveal, pageEntry };
};

export default useGSAPAnimations;
