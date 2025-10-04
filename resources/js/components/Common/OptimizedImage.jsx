import React, { useMemo } from "react";

const DEFAULT_WIDTHS = [320, 480, 640, 768, 1024, 1280];

const buildSrcSet = (src, widths) => {
    if (!src || !Array.isArray(widths) || !widths.length) {
        return undefined;
    }

    const separator = src.includes("?") ? "&" : "?";
    const uniqueSorted = [...new Set(widths.filter((w) => Number.isFinite(w) && w > 0))].sort((a, b) => a - b);

    if (!uniqueSorted.length) {
        return undefined;
    }

    return uniqueSorted.map((width) => `${src}${separator}w=${Math.round(width)} ${Math.round(width)}w`).join(", ");
};

const OptimizedImage = React.forwardRef(({
    src,
    alt = "",
    widths = DEFAULT_WIDTHS,
    sizes,
    loading = "lazy",
    decoding = "async",
    fetchPriority,
    className = "",
    enableResponsiveParams = true,
    ...rest
}, ref) => {
    const supportsResponsiveParams = useMemo(() => {
        if (!enableResponsiveParams || !src) {
            return false;
        }
        return src.includes("/api/");
    }, [enableResponsiveParams, src]);

    const computedSrcSet = useMemo(() => {
        if (!supportsResponsiveParams) {
            return undefined;
        }
        return buildSrcSet(src, widths);
    }, [supportsResponsiveParams, src, widths]);

    const computedSizes = useMemo(() => {
        if (!computedSrcSet) {
            return sizes;
        }
        return sizes || "(max-width: 768px) 90vw, (max-width: 1280px) 50vw, 640px";
    }, [computedSrcSet, sizes]);

    const normalizedFetchPriority = typeof fetchPriority === "string"
        ? fetchPriority.toLowerCase()
        : undefined;

    return (
        <img
            ref={ref}
            src={src}
            alt={alt}
            className={className}
            loading={loading}
            decoding={decoding}
            srcSet={computedSrcSet}
            sizes={computedSizes}
            {...(normalizedFetchPriority ? { fetchpriority: normalizedFetchPriority } : {})}
            {...rest}
        />
    );
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
