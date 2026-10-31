import React, { useEffect, useRef, useState } from 'react';

export default function LazySection({ children, minHeight = 400, rootMargin = '300px' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            setVisible(true);
            return;
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { rootMargin }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [rootMargin]);

    return (
        <div ref={ref} style={{ minHeight: visible ? undefined : `${minHeight}px` }}>
            {visible ? children : null}
        </div>
    );
}
