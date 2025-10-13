import React, { useState } from "react";
import SelectForm from "./Components/SelectForm";

const ProductFilter = ({ products, categories, anuncio }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const sortOptions = [
        { value: "min", label: "Precio: Menor a Mayor" },
        { value: "max", label: "Precio: Mayor a Menor" },
        { value: "sale", label: "Más vendidos" },
    ];

    const handleCategoryClick = (category) => {
        setSelectedCategory(category === selectedCategory ? "" : category);
    };

    // Filtrar y ordenar productos
    const filteredProducts = products
        .filter((product) => {
            if (selectedCategory === "Promociones") {
                return product.offering; // Solo productos en oferta
            } else if (selectedCategory) {
                return product.category.name === selectedCategory; // Filtro por categoría normal
            } else {
                return true; // Sin filtro (mostrar todos)
            }
        })
        .sort((a, b) => {
            if (selectedOption === "min") return a.final_price - b.final_price;
            if (selectedOption === "max") return b.final_price - a.final_price;
            if (selectedOption === "sale") return b.featured - a.featured;
            return 0;
        });
    const [openMenu, setOpenMenu] = useState(false);

    console.log(filteredProducts);
    console.log(anuncio);
    return (
        <div className="px-[5%] mx-auto py-8">
            <div className="flex flex-col md:flex-row w-full lg:justify-end md:justify-between">
                {/* Sidebar */}
                <div className="  lg:hidden md:w-1/2">
                    {/* Categorías */}
                    <nav className="relative mb-8 w-full md:text-[18.67px] 2xl:text-[23.67px] leading-[26.52px] text-[#000000]  ">
                        <button
                            onClick={() => setOpenMenu(!openMenu)}
                            aria-label={openMenu ? "Cerrar menú de categorías" : "Abrir menú de categorías"}
                            className="font-bold text-[#000000] text-[23.67px] leading-[26.52px] flex justify-center items-center underline "
                        >
                            <img
                                src="https://i.ibb.co/nqyF9D6F/f6d1287b6197d4335884bd52d40a18fa.png"
                                className="mr-3 h-5"
                            />
                            Todos los productos
                        </button>
                        {openMenu && (
                            <ul className=" absolute z-50 bg-white rounded-lg p-4 space-y-3">
                                {categories.map((category) => (
                                    <li
                                        className="cursor-pointer"
                                        key={category.id}
                                    >
                                        <a
                                            onClick={() =>
                                                handleCategoryClick(
                                                    category.name
                                                )
                                            }
                                        >
                                            {category.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </nav>
                </div>

                {/* Header con ordenamiento */}
                <div className="flex justify-end items-end mb-6 ">
                    <div className="w-60">
                        <SelectForm
                            options={sortOptions}
                            placeholder="Ordenar por"
                            onChange={(value) => setSelectedOption(value)}
                            labelKey="label"
                            valueKey="value"
                        />
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex mx-auto gap-6">
                {/* Sidebar */}
                <div className="w-[350px] 2xl:w-[400px]">
                    {/* Categorías */}
                    <nav className=" mb-8 w-full md:text-[18.67px] 2xl:text-[23.67px] leading-[26.52px] text-[#000000] border-b pb-8 border-b-[#000000]">
                        <h2 className="font-bold text-[#000000] md:text-[18.67px] 2xl:text-[23.67px] leading-[26.52px] mb-4 underline">
                            Todos los productos
                        </h2>
                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    className={`cursor-pointer ${
                                        selectedCategory === category
                                            ? "text-[#5F48B7]"
                                            : ""
                                    }`}
                                >
                                    <a
                                        onClick={() =>
                                            handleCategoryClick(category.name)
                                        }
                                    >
                                        {category.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {/* Banner promocional */}
                    {anuncio && (
                        <div className="text-white w-full">
                            <img
                                src={`/api/ads/media/${anuncio.image}`}
                                className="w-full h-[300px] xl:h-[320px] 2xl:h-[370px] object-cover"
                                alt={anuncio?.name}
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Grid de productos */}
                <div className="w-full grid grid-cols-3 gap-4 gap-y-8">
                    {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <a
                                href={`/product/${product.slug}`}
                                key={index}
                                className="rounded-lg w-full group cursor-pointer group relative"
                            >
                                {product.discount && (
                                    <div className="absolute top-2 right-2 bg-[#212529] z-50 text-white text-base font-medium px-3 pt-[1px] pb-1 rounded-2xl">
                                        <span className="text-[12.09px] text-center pt-1 flex w-full items-center justify-center  leading-[14.72px]">
                                            Ahorras
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <img
                                                src="https://i.ibb.co/S7R3V0tf/image.png"
                                                className="w-3 mb-1"
                                                alt="Descuento"
                                            />
                                            <p className="text-[16.08px] leading-[20.9px] font-bold">
                                                S/{" "}
                                                {parseFloat(
                                                    product.price -
                                                        product.discount
                                                ).toFixed(0)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <img
                                    src={`/api/items/media/${product.image}`}
                                    alt={product.name}
                                    className={`${
                                        product.images &&
                                        product.images.length > 0 &&
                                        "group-hover:hidden"
                                    } bg-[#FAFAFA] w-full h-auto object-cover mb-4 group-hover:bg-[#FDBB2E] transition-colors duration-300 `}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                />
                                {product.images &&
                                    product.images.length > 0 && (
                                        <img
                                            src={`/api/items/media/${product.images[0].url}`}
                                            alt={product.name}
                                            className="hidden group-hover:block  bg-[#FAFAFA] w-full h-auto object-cover mb-4 group-hover:bg-[#FDBB2E] transition-colors duration-1000 "
                                        />
                                    )}

                                <div className="px-6 text-[#212529]">
                                    <div className="flex justify-between">
                                        <h3 className="text-[25.44px] 2xl:text-[29.44px] leading-[41.64px] font-semibold line-clamp-2">
                                            {product.name.split(" ")[0]}
                                        </h3>
                                        <span className="md:text-[25.56px] xl:leading-[39.79px] 2xl:text-[32.56px] tracking-[-0.01em] font-bold text-[#FC58BE]">
                                            S/
                                            {Number(
                                                product.final_price
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    {/* Precio */}
                                    <div className="flex justify-between items-baseline gap-2">
                                        {product.summary ? (
                                            <h4 className="text-[14.28px] 2xl:text-[16.28px] leading-[29.18px] font-normal mb-2 line-clamp-2">
                                                ({product.summary})
                                            </h4>
                                        ) : (
                                            <h4 className="text-[14.28px] 2xl:text-[16.28px] leading-[29.18px] font-normal mb-2 line-clamp-2">
                                                {product.name
                                                    .split(" ")
                                                    .slice(1)
                                                    .join(" ")}
                                            </h4>
                                        )}
                                        <span className="text-[16.8px] text-[#9F9F9F] font-semibold1 line-through leading-[21.84px]">
                                            S/{" "}
                                            {Number(product.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <a
                                        href={`/product/${product.slug}`}
                                        className=" w-full flex gap-2 items-center justify-center fill-[#FF9900] border-2 border-[#FF9900] text-[#FF9900] font-medium py-4 px-4 rounded-xl group-hover:bg-[#FF9900] group-hover:fill-[#FFFFFF] group-hover:text-white transition-colors duration-1000"
                                    >
                                        ¡Lo quiero!
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="14"
                                            viewBox="0 0 17 14"
                                            fill="currrent"
                                        >
                                            <path
                                                d="M16.4986 7.82554C16.8518 7.47235 16.8518 6.89972 16.4986 6.54653L10.743 0.791003C10.3899 0.437815 9.81723 0.437815 9.46404 0.791003C9.11086 1.14419 9.11086 1.71682 9.46404 2.07001L14.5801 7.18604L9.46404 12.3021C9.11086 12.6552 9.11086 13.2279 9.46404 13.5811C9.81723 13.9343 10.3899 13.9343 10.743 13.5811L16.4986 7.82554ZM0.484375 8.09043H15.8591V6.28164H0.484375V8.09043Z"
                                                fill="current"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="col-span-3 flex flex-col items-center justify-center h-full w-full p-4 space-y-4">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <p className="text-center text-gray-500 text-lg">
                                No se encontraron resultados
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className=" lg:hidden mx-auto gap-6">
                {/* Grid de productos */}
                <div className="w-full grid grid-cols-1  md:grid-cols-2 gap-4 gap-y-8">
                    {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.slice(0, 4).map((product, index) => (
                            <a
                                key={index}
                                href={`/product/${product.slug}`}
                                className="rounded-lg w-full group cursor-pointer"
                            >
                                <img
                                    src={`/api/items/media/${product.image}`}
                                    alt={product.name}
                                    className="bg-[#FAFAFA] w-full h-auto object-cover mb-4 group-hover:bg-[#FDBB2E] transition-colors duration-300"
                                    onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                />
                                <div className="px-6 text-[#212529]">
                                    <div className="flex justify-between">
                                        <h3 className="text-[29.44px] leading-[41.64px] font-semibold line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <span className="md:text-[25.56px] xl:leading-[39.79px] 2xl:text-[32.56px] tracking-[-0.01em] font-bold text-[#FC58BE]">
                                            S/
                                            {Number(
                                                product.final_price
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    {/* Precio */}
                                    <div className="flex justify-between items-baseline gap-2">
                                        {product.summary && (
                                            <h4 className="text-[16.28px] leading-[29.18px] font-normal mb-2 line-clamp-2">
                                                ({product.summary})
                                            </h4>
                                        )}
                                        <span className="text-[16.8px] text-[#9F9F9F] font-semibold1 line-through leading-[21.84px]">
                                            S/{Number(product.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <a
                                        href={`/product/${product.slug}`}
                                        className="block w-full flex gap-2 items-center justify-center fill-[#FDBB2E] border-2 border-[#FDBB2E] text-[#FDBB2E] font-medium py-4 px-4 rounded-xl group-hover:bg-[#FDBB2E] group-hover:fill-[#FFFFFF] group-hover:text-white transition-colors duration-300"
                                    >
                                        ¡Lo quiero!
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="14"
                                            viewBox="0 0 17 14"
                                            fill="currrent"
                                        >
                                            <path
                                                d="M16.4986 7.82554C16.8518 7.47235 16.8518 6.89972 16.4986 6.54653L10.743 0.791003C10.3899 0.437815 9.81723 0.437815 9.46404 0.791003C9.11086 1.14419 9.11086 1.71682 9.46404 2.07001L14.5801 7.18604L9.46404 12.3021C9.11086 12.6552 9.11086 13.2279 9.46404 13.5811C9.81723 13.9343 10.3899 13.9343 10.743 13.5811L16.4986 7.82554ZM0.484375 8.09043H15.8591V6.28164H0.484375V8.09043Z"
                                                fill="current"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="col-span-1  md:col-span-2 flex flex-col items-center justify-center h-full w-full p-4 space-y-4">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <p className="text-center text-gray-500 text-lg">
                                No se encontraron resultados
                            </p>
                        </div>
                    )}
                    {/* Banner promocional */}
                    {anuncio && (
                        <div className="text-white w-full md:col-span-2">
                            <img
                                src={`/api/ads/media/${anuncio.image}`}
                                className="w-full h-[200px]   md:h-[305px] object-cover"
                                alt="Promoción"
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                            />
                        </div>
                    )}

                    {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.slice(4).map((product, index) => (
                            <a
                                key={index}
                                href={`/product/${product.slug}`}
                                className="rounded-lg w-full group cursor-pointer"
                            >
                                <img
                                    src={`/api/items/media/${product.image}`}
                                    alt={product.name}
                                    className="bg-[#FAFAFA] w-full h-auto object-cover mb-4 group-hover:bg-[#FDBB2E] transition-colors duration-300"
                                />
                                <div className="px-6 text-[#212529]">
                                    <div className="flex justify-between">
                                        <h3 className="text-[29.44px] leading-[41.64px] font-semibold line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <span className="md:text-[25.56px] xl:leading-[39.79px] 2xl:text-[32.56px] tracking-[-0.01em] font-bold text-[#FC58BE]">
                                            S/
                                            {Number(
                                                product.final_price
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    {/* Precio */}
                                    <div className="flex justify-between items-baseline gap-2">
                                        {product.summary && (
                                            <h4 className="text-[16.28px] leading-[29.18px] font-normal mb-2 line-clamp-2">
                                                ({product.summary})
                                            </h4>
                                        )}
                                        <span className="text-[16.8px] text-[#9F9F9F] font-semibold1 line-through leading-[21.84px]">
                                            S/{Number(product.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <a
                                        href={`/product/${product.slug}`}
                                        className="block w-full flex gap-2 items-center justify-center fill-[#FDBB2E] border-2 border-[#FDBB2E] text-[#FDBB2E] font-medium py-4 px-4 rounded-xl group-hover:bg-[#FDBB2E] group-hover:fill-[#FFFFFF] group-hover:text-white transition-colors duration-300"
                                    >
                                        ¡Lo quiero!
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="14"
                                            viewBox="0 0 17 14"
                                            fill="currrent"
                                        >
                                            <path
                                                d="M16.4986 7.82554C16.8518 7.47235 16.8518 6.89972 16.4986 6.54653L10.743 0.791003C10.3899 0.437815 9.81723 0.437815 9.46404 0.791003C9.11086 1.14419 9.11086 1.71682 9.46404 2.07001L14.5801 7.18604L9.46404 12.3021C9.11086 12.6552 9.11086 13.2279 9.46404 13.5811C9.81723 13.9343 10.3899 13.9343 10.743 13.5811L16.4986 7.82554ZM0.484375 8.09043H15.8591V6.28164H0.484375V8.09043Z"
                                                fill="current"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center h-full  p-4 space-y-4">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <p className="text-center text-gray-500 text-lg">
                                No se encontraron resultados
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;
