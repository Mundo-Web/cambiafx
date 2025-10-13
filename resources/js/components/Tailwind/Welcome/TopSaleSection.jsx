import React, { useContext, useState } from "react";
import { CarritoContext } from "../../../context/CarritoContext";

const TopSaleSection = ({ producto }) => {
    const [isModalTalla, setIsModalTalla] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(
        producto.colors.length > 0 ? producto.colors[0].name : ""
    );

    const [selectedSize, setSelectedSize] = useState(
        producto.sizes.length > 0 ? producto.sizes[0].name : ""
    );
    const changeQuantity = (amount) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    };

    const { agregarAlCarrito } = useContext(CarritoContext);

    console.log(producto);
    return (
        <section className="py-2 md:py-10 px-[5%] mx-auto font-poppins bg-white">
            <h2 className=" text-[20.25px] md:text-[30.25px] 2xl:text-[36.25px] leading-[29.36px] font-bold text-[#212529] mt-6 mb-8 md:mb-10 text-center flex gap-2 items-center justify-center">
                <img src="/assets/img/emojis/fire.png" className="h-4 md:h-8" />{" "}
                El más vendido{" "}
                <img src="/assets/img/emojis/fire.png" className="h-4 md:h-8" />
            </h2>
            <div className="mx-auto flex flex-col lg:flex-row justify-center items-center my-4 gap-4 lg:gap-8">
                {/* Image */}
                <div className="md:w-[644px] md:h-[644px] lg:w-[500.81px] lg:h-[500.81px] 2xl:w-[620.81px] 2xl:h-[620.81px] overflow-hidden">
                    <img
                        src={`/api/items/media/${producto.image}`}
                        alt={producto.name}
                        className="md:w-[644px] md:h-[644px] lg:w-[500.81px] lg:h-[500.81px] 2xl:w-[620.81px] 2xl:h-[620.81px] object-cover rounded-lg"
                        loading="lazy"
                    />
                </div>
                {/* Product Details */}
                <div className="md:w-[644px] lg:w-[350px] 2xl:w-[475px] text-[#333333]">
                    <div className="flex gap-4 lg:block items-end">
                        <h3 className="text-[30.58px] leading-[30.78px] md:text-[55.58px] lg:text-[40.38px] 2xl:text-[54.38px] font-bold lg:leading-[40.78px]">
                            {producto.name}
                        </h3>
                        <p className="text-[17.5px] md:text-[31.5px] lg:text-[16.81px] 2xl:text-[30.81px]  font-normal inline-flex ">
                            ({producto.summary})
                        </p>
                    </div>
                    <div className="text-[12.36px] md:text-[14.36px] lg:text-[11px] 2xl:text-[14.05px] mt-2 leading-relaxed ">
                        <img
                            src="/assets/img/emojis/blossom.png"
                            className="h-[15.05px] inline-flex"
                        />{" "}
                        {producto.description}
                        <img
                            src="/assets/img/emojis/crescent-moon.png"
                            className="h-[15.05px] inline-flex"
                        />
                        <img
                            src="/assets/img/emojis/sparkling-heart.png"
                            className="h-[15.05px] inline-flex"
                        />
                    </div>
                    <div className="w-[158.43px] 2xl:w-[155px] h-[20px] 2xl:h-[25px] bg-[#212529] text-white rounded-[5.44px] my-4 flex items-center justify-center">
                        {producto.discount && (
                            <p className="w-[158.43px]   h-[25.55px]  bg-[#212529]  text-white rounded-[5.44px] my-4 flex items-center justify-center text-[10.88px]  leading-[21.75px]">
                                <img
                                    src="/assets/img/emojis/fire.png"
                                    className="h-[11.88px] inline-flex mr-2"
                                />{" "}
                                <span className="font-bold text-[10.88px] mr-1">
                                    AHORRA
                                </span>{" "}
                                S/{" "}
                                {Number(
                                    producto.price - producto.discount
                                ).toFixed(2)}{" "}
                                <img
                                    src="/assets/img/emojis/fire.png"
                                    className="h-[11.88px] inline-flex ml-2"
                                />
                            </p>
                        )}
                    </div>
                    <div className="flex gap-4 lg:block items-end">
                        <p className="text-[30.42px] md:text-[50.42px] lg:text-[35.33px] 2xl:text-[49.33px] font-bold text-[#FC58BE]">
                            S/ {Number(producto.final_price).toFixed(2)}
                        </p>
                        {producto.discount && (
                            <p className="text-[20.39px] md:text-[25.39px] lg:text-[18.84px] 2xl:text-[24.84px] text-[#B4B4B4]">
                                <del>Antes S/ {producto.price}</del>
                            </p>
                        )}
                    </div>
                    {/* score  */}

                    {producto.score > 4 && (
                        <div className="flex items-center mt-2 text-[#FF9900] gap-1 text-base">
                            {Array.from({ length: producto.score }).map(
                                (_, index) => (
                                    <img
                                        key={index}
                                        src="/assets/img/emojis/star-score.png"
                                        className="h-[19px] inline-flex"
                                        alt="star"
                                    />
                                )
                            )}
                        </div>
                    )}

                    {/* Color Selector */}
                    <div className="relative flex justify-between sm:justify-start gap-4 lg:gap-0 lg:justify-between items-center  my-2">
                        {producto.colors.length > 0 && (
                            <div className="flex items-start gap-2">
                                <p className="md:text-[10.05px] 2xl:text-[13.05px] font-bold">
                                    Color:
                                </p>
                                <div className="flex items-center gap-2">
                                    {producto.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedColor(color.name)
                                            }
                                            aria-label={`Seleccionar color ${color.name}`}
                                            className={`rounded-full p-1 border ${
                                                selectedColor === color.name
                                                    ? "border-[#222222]"
                                                    : "border-[#DDDDDD]"
                                            }`}
                                        >
                                            <div
                                                className="w-[22px] h-[22px] rounded-full "
                                                style={{
                                                    backgroundColor: `${color.summary}`,
                                                }}
                                            ></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {producto.sizes.length > 0 && (
                            <div className="lg:absolute right-0 lg:top-1/2  ">
                                <button
                                    onClick={() =>
                                        setIsModalTalla(!isModalTalla)
                                    }
                                    aria-label="Abrir guía de tallas"
                                    className="inline-flex md:gap-2 2xl:gap-0 items-center justify-center w-[180.45px] 2xl:w-[187.45px] h-[34.02px] font-medium text-[12.05px] 2xl:text-[15.57px] leading-[15.95px] bg-[#5F48B7] text-white rounded-[8.51px]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 fill-white mr-2"
                                        viewBox="0 0 640 512"
                                    >
                                        <path
                                            d="M0 336c0 26.5 21.5 48 48 48l544 0c26.5 0 48-21.5
                48-48l0-160c0-26.5-21.5-48-48-48l-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0
                8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0
                8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0c-26.5
                0-48 21.5-48 48L0 336z"
                                        />
                                    </svg>
                                    ¿Cuál es mi talla?
                                </button>
                            </div>
                        )}
                    </div>
                    {producto.sizes.length > 0 && (
                        <div className=" block md:flex gap-4 lg:block items-end">
                            {/* Size Selector */}
                            <div className=" w-full md:w-1/2 lg:w-full mb-4 2xl:mb-6">
                                <label className="md:text-[10.05px] 2xl:text-[13.05px] font-bold">
                                    Selecciona tu talla:
                                </label>
                                <select
                                    className="w-full h-[40.94px] 2xl:h-[48.94px] md:text-[12.05px] 2xl:text-[14.05px] px-4 bg-[#EFEDF8] rounded-[5.44px] appearance-none  outline-none ring-0 border-0 cursor-pointer focus:outline-none"
                                    value={selectedSize}
                                    onChange={(e) =>
                                        setSelectedSize(e.target.value)
                                    }
                                >
                                    {producto.sizes.map((size) => {
                                        return (
                                            <option
                                                key={size.id}
                                                value={size.name}
                                                className="text-[#000000]"
                                            >
                                                {`Talla ${size.name}`}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            {/* Quantity Selector */}
                            <div className=" w-full md:w-1/2 lg:w-full mb-4 2xl:mb-6">
                                <div className=" flex h-[40.94px] text-[#000000]  bg-[#EFEDF8] items-center justify-around  rounded-[5.44px] ">
                                    <button
                                        onClick={() => changeQuantity(-1)}
                                        aria-label="Disminuir cantidad"
                                        className="w-8 h-8 text-[17.84px] text-[#444444]"
                                    >
                                        -
                                    </button>
                                    <span className="md:text-base 2xl:text-xl font-medium">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => changeQuantity(1)}
                                        aria-label="Aumentar cantidad"
                                        className="w-8 h-8 text-[17.84px] text-[#444444]"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={() =>
                                agregarAlCarrito({
                                    ...producto,
                                    quantity,
                                    selectedColor:
                                        producto.colors?.length > 0
                                            ? selectedColor
                                            : null,
                                    selectedSize:
                                        producto.sizes?.length > 0
                                            ? selectedSize
                                            : null,
                                })
                            }
                            aria-label="Añadir producto al carrito"
                            className="mt-4 relative w-full sm:w-[332px] lg:w-full h-[59px] lg:h-[35.88px] 2xl:h-[39.88px] text-[17.02px] lg:text-[12.59px]  2xl:text-[13.59px] leading-[13.59px] bg-[#FC58BE] text-white rounded-[6px]  lg:rounded-[2.72px] border-[1.81px] border-[#FC58BE]  flex items-center justify-center"
                        >
                            <span className="">Añadir al carrito</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                className="fill-white h-4 lg:h-3 absolute  top-1/2 -translate-y-1/2  right-16 "
                            >
                                <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {isModalTalla && (
                <div
                    className="fixed inset-0 min-h-screen flex items-center justify-center z-50 bg-[#00000080] transition-all duration-1000"
                    style={{ backdropFilter: "blur(10px)" }}
                >
                    <div
                        className="bg-white rounded-[30.58px] w-[319px] h-[320.40px]  md:w-[519px] md:h-[520.40px] lg:w-[419px] lg:h-[420.40px]  2xl:w-[519px] 2xl:h-[520.40px] z-10  p-8 relative"
                        style={{
                            backgroundImage:
                                "url(/assets/img/multiple/mi-talla.png)",
                            backgroundSize: "cover",
                        }}
                    >
                        <button
                            className="absolute z-50 top-4 right-4 text-3xl text-[#9577B9]"
                            onClick={() => setIsModalTalla(false)}
                            aria-label="Cerrar guía de tallas"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TopSaleSection;
