import { ArrowRight, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor.js";
import Global from "../../../Utils/Global";

const SliderInteractive = ({ items, data, current="sliders" }) => {
    //TODO: Validación y conversión de infiniteLoop
    const parseInfiniteLoop = (value) => {
        const validTrueValues = ["true", "si"];
        const validFalseValues = ["false", "no"];
        if (validTrueValues.includes(value?.toLowerCase())) {
            return true;
        } else if (validFalseValues.includes(value?.toLowerCase())) {
            return false;
        }
        return false; // Valor predeterminado si no se especifica o es inválido
    };

    const infiniteLoop = parseInfiniteLoop(data?.infiniteLoop);

    const [currentIndex, setCurrentIndex] = useState(1);
    const sliderRef = useRef(null);    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentTranslate = useRef(0);
    const isClickingButton = useRef(false);

    const duplicatedItems = [items[items.length - 1], ...items, items[0]];
    const validAlignments = ["center", "left", "right"];
    const validPosition = ["yes", "true", "si"];
    const showPagination = validAlignments.includes(data?.paginationAlignment);
    const alignmentClassPagination = showPagination
        ? data?.paginationAlignment
        : "center";

    const showNavigation = validPosition.includes(data?.showNavigation);
    const alignmentClassNavigation = showNavigation
        ? data?.navigationAlignment
        : "true";

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % duplicatedItems.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? duplicatedItems.length - 1 : prevIndex - 1
        );
    };    // Handle touch events for mobile
    const handleTouchStart = (e) => {
        // Verificar si el toque comenzó en un botón, enlace o su contenedor
        const target = e.target.closest('a, button, [class*="pointer-events-auto"]');
        if (target) {
            isClickingButton.current = true;
            return;
        }
        
        isClickingButton.current = false;
        isDragging.current = true;
        startX.current = e.touches[0].pageX;
        if (sliderRef.current) {
            sliderRef.current.style.transition = "none";
        }
    };    const handleTouchMove = (e) => {
        if (!isDragging.current || isClickingButton.current) return;

        const deltaX = e.touches[0].pageX - startX.current;
        currentTranslate.current =
            -currentIndex * 100 + (deltaX / window.innerWidth) * 100;
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging.current || isClickingButton.current) {
            isClickingButton.current = false;
            return;
        }

        isDragging.current = false;
        if (sliderRef.current) {
            sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        }

        const threshold = 20;
        const deltaX = Math.abs(
            (currentTranslate.current + currentIndex * 100) *
            (window.innerWidth / 100)
        );

        if (deltaX > threshold) {
            if (currentTranslate.current > -currentIndex * 100) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            setCurrentIndex(currentIndex);
        }

        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    };// Mouse events for desktop
    const handleMouseDown = (e) => {
        // Verificar si el clic comenzó en un botón, enlace o su contenedor
        const target = e.target.closest('a, button, [class*="pointer-events-auto"]');
        if (target) {
            isClickingButton.current = true;
            return;
        }
        
        isClickingButton.current = false;
        isDragging.current = true;
        startX.current = e.pageX;
        if (sliderRef.current) {
            sliderRef.current.style.transition = "none";
        }
    };    const handleMouseMove = (e) => {
        if (!isDragging.current || isClickingButton.current) return;

        const deltaX = e.pageX - startX.current;
        currentTranslate.current =
            -currentIndex * 100 + (deltaX / window.innerWidth) * 100;
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
        }
    };

    const handleMouseUp = () => {
        if (!isDragging.current || isClickingButton.current) {
            isClickingButton.current = false;
            return;
        }

        isDragging.current = false;
        if (sliderRef.current) {
            sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        }

        const threshold = 20;
        const deltaX = Math.abs(
            (currentTranslate.current + currentIndex * 100) *
            (window.innerWidth / 100)
        );

        if (deltaX > threshold) {
            if (currentTranslate.current > -currentIndex * 100) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            setCurrentIndex(currentIndex);
        }

        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    };const handleMouseLeave = () => {
        if (isDragging.current && !isClickingButton.current) {
            handleMouseUp();
        }
    };

    //TODO: Problema Loop - Validacion y Efectuar
    if (infiniteLoop) {
        useEffect(() => {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000);

            return () => clearInterval(interval);
        }, [currentIndex]);
    }

    //TODO: Efecto para manejar el loop infinito sin saltos bruscos
    useEffect(() => {
        if (currentIndex === 0) {
            setTimeout(() => {
                sliderRef.current.style.transition = "none";
                setCurrentIndex(duplicatedItems.length - 2);
                requestAnimationFrame(() => {
                    sliderRef.current.style.transform = `translateX(-${(duplicatedItems.length - 2) * 100
                        }%)`;
                    setTimeout(() => {
                        sliderRef.current.style.transition =
                            "transform 0.5s ease-in-out";
                    }, 50);
                });
            }, 500);
        } else if (currentIndex === duplicatedItems.length - 1) {
            setTimeout(() => {
                sliderRef.current.style.transition = "none";
                setCurrentIndex(1);
                requestAnimationFrame(() => {
                    sliderRef.current.style.transform = `translateX(-${1 * 100
                        }%)`;
                    setTimeout(() => {
                        sliderRef.current.style.transition =
                            "transform 0.5s ease-in-out";
                    }, 50);
                });
            }, 500);
        }
    }, [currentIndex]);

    const buttonsRef = useRef([]);

    useEffect(() => {
        buttonsRef.current.forEach((button) => {
            if (button) adjustTextColor(button);
        });
    }, [items]);

    // Estado para saber si la imagen actual es oscura
    const [isDarkBg, setIsDarkBg] = useState(false);

    // Función para detectar si la imagen es oscura
    const checkImageDarkness = (src) => {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = src;
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let colorSum = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                // brillo promedio
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                colorSum += brightness;
            }
            const avg = colorSum / (imageData.data.length / 4);
            setIsDarkBg(avg < 128); // umbral: 128
        };
    };

    // Cada vez que cambia el slide, revisa si la imagen es oscura
    useEffect(() => {
        const currentItem = duplicatedItems[currentIndex];
        if (currentItem?.bg_image) {
            checkImageDarkness(`/api/${current}/media/${currentItem.bg_image}`);
        }
    }, [currentIndex, duplicatedItems]);

    return (
        <div className="relative w-full mx-auto">
            <div
                className="overflow-hidden relative cursor-grab ease"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    ref={sliderRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {duplicatedItems.map((item, index) => (
                        <div
                            key={`slide-${index}`}
                            className="w-full h-[589px] lg:h-auto  flex-shrink-0 relative"
                        >
                            <img
                                src={`/api/${current}/media/${item.image || "undefined"
                                    }`}
                                alt={item.name}
                                loading="lazy"
                                className={`absolute top-0  left-0 h-full md:h-full  w-screen md:w-full object-cover ${data?.imageBgPosition || "object-right-25 "} md:object-center  z-0  md:mr-20 lg:mr-0`}
                            />


                            <div className="absolute inset-0 bg-primary/60 "></div>


                            <div className={`relative w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto h-[530px] md:h-[600px] flex flex-col items-center md:items-start justify-end md:justify-center ${isDarkBg ? "text-white" : "customtext-neutral-dark"}`}>
                                <div className="flex flex-col gap-5 lg:gap-10 items-center w-full text-center md:text-left">
                                    <h2
                                        className={`font-title uppercase text-sm flex gap-2 leading-tight sm:text-lg md:text-lg tracking-normal font-medium text-white justify-center md:justify-start`}
                                        style={{
                                            textShadow: "0 0 20px rgba(0, 0, 0, .25)",
                                        }}
                                    >
                                        <span>
                                            <svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.50225 0C5.95566 0 4.69727 1.2584 4.69727 2.80499C4.69727 4.35158 5.95566 5.60998 7.50225 5.60998C9.04885 5.60998 10.3072 4.35158 10.3072 2.80499C10.3072 1.2584 9.04885 0 7.50225 0Z" fill="#D62828" />
                                                <path d="M7.50112 24.0025C3.65842 24.0025 0.759766 22.4639 0.759766 20.4219C0.759766 19.9629 1.13269 19.59 1.59168 19.59C2.05066 19.59 2.42359 19.9629 2.42359 20.4219C2.42359 21.203 4.40166 22.3387 7.49981 22.3387C10.5993 22.3387 12.576 21.2043 12.576 20.4219C12.576 19.8743 12.4874 19.3657 12.3048 18.8689C12.147 18.4373 12.3674 17.9601 12.799 17.801C13.2306 17.6432 13.7092 17.8636 13.8669 18.2952C14.1147 18.9693 14.2399 19.6839 14.2399 20.4206C14.2425 22.4639 11.3451 24.0025 7.50112 24.0025Z" fill="#D62828" />
                                                <path d="M11.4896 21.804C12.3046 21.4414 12.7754 20.9968 12.8132 20.6225C5.70098 16.9581 5.32021 11.2634 5.32021 10.1015C5.32021 9.64249 4.94725 9.26953 4.48823 9.26953C4.02921 9.26953 3.65625 9.64249 3.65625 10.1015C3.65625 11.4082 4.06181 17.6884 11.4896 21.804Z" fill="#D62828" />
                                                <path d="M7.49991 6.25781C5.37954 6.25781 3.6543 7.98306 3.6543 10.1034C3.6543 10.5624 4.02725 10.9354 4.48627 10.9354C4.9453 10.9354 5.31825 10.5624 5.31825 10.1034C5.31825 8.9011 6.29628 7.92177 7.49991 7.92177C8.70353 7.92177 9.68156 8.8998 9.68156 10.1034C9.68156 10.9432 8.14671 11.9108 6.66272 12.8458C6.33019 13.0558 5.98722 13.2709 5.64296 13.4965C5.81248 13.9855 6.03026 14.5059 6.31454 15.047C6.72531 14.7732 7.1426 14.5111 7.55077 14.2542C9.58768 12.971 11.3468 11.8626 11.3468 10.1034C11.3455 7.98306 9.62158 6.25781 7.49991 6.25781Z" fill="#D62828" />
                                                <path d="M4.23503 14.4766C2.36765 15.8954 0.759766 17.7158 0.759766 20.4191C0.759766 20.8781 1.13272 21.251 1.59174 21.251C2.05076 21.251 2.42372 20.8781 2.42372 20.4191C2.42372 18.5465 3.53085 17.1707 4.95486 16.0271C4.66406 15.4937 4.42673 14.9734 4.23503 14.4766Z" fill="#D62828" />
                                            </svg>
                                        </span>
                                        {item.name}
                                    </h2>
                                    <p
                                        className={`w-full text-center px-primary mx-auto md:max-w-5xl italic font-semibold text-4xl lg:text-[60px] leading-tight font-paragraph text-white`}
                                        style={{
                                            textShadow: "0 0 20px rgba(0, 0, 0, .25)",
                                        }}
                                    >
                                        {item.description}
                                    </p>                                    {item.button_text && item.button_link && (
                                        <div className="flex flex-row gap-5 md:gap-10 justify-center md:justify-start items-start">
                                            <div 
                                                onTouchStart={(e) => e.stopPropagation()}
                                                onTouchMove={(e) => e.stopPropagation()}
                                                onTouchEnd={(e) => e.stopPropagation()}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onMouseMove={(e) => e.stopPropagation()}
                                                onMouseUp={(e) => e.stopPropagation()}
                                                className="pointer-events-auto"
                                            >
                                                <a
                                                    href={item.button_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    ref={(el) => (buttonsRef.current[index] = el)}
                                                    className="bg-accent border-none flex flex-row items-center gap-3 px-10 py-4 text-lg rounded-xl tracking-wide font-semibold hover:bg-primary transition-all duration-300 touch-manipulation"
                                                    style={{ touchAction: 'manipulation' }}
                                                >
                                                    {item.button_text}
                                                    <ArrowRight width={"1.25rem"} className=" " />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showNavigation && (
                <>
                    <div
                        className={`absolute top-1/2 left-0 transform -translate-y-1/2 `}
                    >
                        <button
                            onClick={prevSlide}
                            aria-label="Ir al producto anterior"
                            className="bg-secondary rounded-r-lg text-white w-12 h-12 flex items-center justify-center transition-colors duration-300"
                        >
                            <ChevronLeft width={"1rem"} />
                        </button>
                    </div>
                    <div
                        className={`absolute top-1/2 right-0 transform -translate-y-1/2 `}
                    >
                        <button
                            onClick={nextSlide}
                            aria-label="Ir al producto siguiente"
                            className="bg-secondary rounded-l-lg text-white w-12 h-12 flex items-center justify-center transition-colors duration-300"
                        >
                            <ChevronRight width={"1rem"} />
                        </button>
                    </div>
                </>
            )}

            {showPagination && (
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto ">
                    <div className="relative">
                        <div
                            className={`absolute bottom-4 ${alignmentClassPagination === "left"
                                    ? "inset-x-0 left-0"
                                    : alignmentClassPagination === "right"
                                        ? "right-0"
                                        : "left-1/2 transform -translate-x-1/2"
                                }`}
                        >
                            {items.map((_, index) => (
                                <div
                                    key={`dot-${index}`}
                                    className={`inline-flex mx-1 w-2 h-2 rounded-full ${currentIndex === index + 1
                                            ? "bg-white h-2 w-5  items-center justify-center " //"bg-white h-5 w-5 lg:w-6 lg:h-6 items-center justify-center border-2 border-accent"
                                            : "bg-white h-2 w-2  items-center justify-center"
                                        }`}
                                    onClick={() => setCurrentIndex(index + 1)}
                                >
                                    {currentIndex === index + 1 && (
                                        <div className="!w-5 h-2 bg-accent rounded-full items-center justify-center"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SliderInteractive;
