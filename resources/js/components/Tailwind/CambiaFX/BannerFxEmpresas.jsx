import React, { useState } from 'react'
import TextWithHighlight from '../../../Utils/TextWithHighlight'
import WhatsAppButton from '../../Shared/WhatsAppButton'

export default function BannerFxEmpresas({banner}) {
    return (
        <section className="w-full bg-primary pt-10 pb-24 flex justify-center items-center font-title px-[5%] mx-auto">
            <div className="relative w-full px-4 md:px-16 rounded-[32px] md:rounded-[56px] bg-neutral-dark overflow-hidden flex flex-col md:flex-row justify-end items-center py-8 md:py-10 min-h-[250px] md:min-h-[300px]">
                
                {/* Fondo decorativo - Responsive */}
                <div className="absolute h-[250px] w-[400px] md:h-[400px] md:w-[700px] -right-20 md:right-60 top-0 z-0 overflow-hidden rounded-[32px] md:rounded-[56px]">
                    <svg className='h-full w-full' width="616" height="192" viewBox="0 0 616 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M121.848 381.339C180.606 425.741 249.981 449.427 317.281 447.956C459.032 442.061 565.367 364.287 602.435 239.894C638.852 117.758 594.525 -16.2737 492.146 -93.6396C455.684 -121.194 412.936 -141.361 364.907 -153.609L363.607 -153.905C333.845 -160.251 213.139 -173.833 167.061 -124.951C150.268 -107.069 145.087 -83.1602 152.32 -57.5418L152.852 -55.7657C157.624 -42.0831 166.275 -30.2782 177.833 -21.5442C196.847 -7.17549 221.533 -2.94791 243.837 -10.1392C296.144 -28.665 357.341 -18.0298 404.391 17.5258C427.283 34.8247 445.652 57.1788 457.347 82.1621L458.1 83.6468C481.781 127.649 479.474 179.379 451.747 225.526C421.64 275.598 368.867 306.367 313.88 305.807C277.181 306.47 238.262 292.862 206.199 268.632C163.921 236.683 140.531 191.984 143.645 149.108C145.672 124.877 134.875 101.031 114.817 85.8732C104.154 77.8154 91.5116 72.842 78.2839 71.4338C57.1149 69.0626 37.1255 75.8271 22.3666 90.5518C6.28249 106.565 -1.82896 130.321 0.444458 154.596C-0.309586 238.53 45.0262 323.171 121.829 381.21L121.848 381.339Z" fill="url(#paint0_linear_123_4586)" fillOpacity="0.4" />
                        <defs>
                            <linearGradient id="paint0_linear_123_4586" x1="502.824" y1="-85.5707" x2="137.84" y2="393.399" gradientUnits="userSpaceOnUse">
                                <stop offset="0.269231" stopColor="#BCFF52" />
                                <stop offset="1" stopColor="#BBFF52" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Imagen - Responsive positioning */}
                <img 
                    src={`/api/banners/media/${banner?.image}`} 
                    alt={banner?.name} 
                    className="h-[200px] md:h-[300px] object-cover absolute -left-0 bottom-0 select-none opacity-80 md:opacity-100" 
                    draggable="false" 
                />

                {/* Layout Mobile: Stacked vertically */}
                <div className="w-full  md:hidden z-10 flex flex-col justify-center items-center text-center gap-4 pt-4">
                    {/* Título mobile */}
                    <span className="uppercase text-white tracking-widest text-lg font-medium"> 
                        {banner?.name}
                    </span>
                    
                    {/* Descripción mobile */}
                    <h2 className="text-4xl font-medium leading-tight text-white px-4">
                        <TextWithHighlight text={banner?.description} color='bg-secondary font-semibold' split_coma />
                    </h2>
                    
                    {/* CTA y WhatsApp mobile */}
                    <div className="w-full flex items-end justify-end flex-col gap-3 mt-2">
                        <div className="text-white max-w-32 text-lg text-center">
                            <TextWithHighlight text={banner?.button_text} color='bg-white font-semibold italic' split_coma />
                        </div>
                        <WhatsAppButton buttonData={banner?.button_link}>
                            <span className="animate-pulse z-10">
                                <svg width="70" height="70" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="49.567" cy="49.567" r="49.567" transform="matrix(1 0 0 -1 0.933594 100.066)" fill="#D9D9D9" fillOpacity="0.4" />
                                    <path d="M87.7015 50.6493C87.7015 30.021 70.979 13.2985 50.3507 13.2985C29.7225 13.2985 13 30.021 13 50.6493C13 71.2775 29.7225 88 50.3507 88C70.979 88 87.7015 71.2775 87.7015 50.6493Z" fill="#BCFF52" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M63.8167 37.8734C60.6384 34.6951 56.4006 33 51.951 33C42.6279 33 35 40.6279 35 49.951C35 52.9174 35.8476 55.8838 37.3308 58.4265L35 66.902L43.8993 64.5712C46.4419 65.8425 49.1964 66.6901 51.951 66.6901C61.274 66.6901 68.902 59.0621 68.902 49.7391C68.902 45.2895 66.995 41.0517 63.8167 37.8734ZM51.951 63.9355C49.4083 63.9355 46.8657 63.2999 44.7468 62.0286L44.323 61.8167L39.0258 63.2999L40.5091 58.2146L40.0853 57.5789C38.6021 55.2482 37.9664 52.7055 37.9664 50.1629C37.9664 42.5349 44.323 36.1783 51.951 36.1783C55.765 36.1783 59.1552 37.6615 61.9097 40.2042C64.6642 42.9587 65.9356 46.3489 65.9356 50.1629C65.9356 57.5789 59.7908 63.9355 51.951 63.9355ZM59.5789 53.3412C59.1552 53.1293 57.0363 52.0699 56.6125 52.0699C56.1888 51.858 55.9768 51.858 55.7649 52.2817C55.553 52.7055 54.7055 53.5531 54.4937 53.9768C54.2818 54.1887 54.0698 54.1887 53.6461 54.1887C53.2223 53.9768 51.951 53.5531 50.2559 52.0699C48.9846 51.0104 48.137 49.5272 47.9251 49.1034C47.7132 48.6797 47.9251 48.4678 48.137 48.2559C48.3489 48.044 48.5608 47.8321 48.7727 47.6202C48.9846 47.4083 48.9846 47.1964 49.1965 46.9846C49.4084 46.7727 49.1965 46.5608 49.1965 46.3489C49.1965 46.137 48.3489 44.0181 47.9251 43.1706C47.7132 42.5349 47.2895 42.5349 47.0776 42.5349C46.8657 42.5349 46.6538 42.5349 46.23 42.5349C46.0181 42.5349 45.5943 42.5349 45.1706 42.9587C44.7468 43.3825 43.6874 44.4419 43.6874 46.5608C43.6874 48.6797 45.1706 50.5866 45.3825 51.0104C45.5944 51.2223 48.3489 55.6719 52.5866 57.367C56.1887 58.8502 56.8244 58.4265 57.672 58.4265C58.5195 58.4265 60.2146 57.367 60.4265 56.5195C60.8502 55.4601 60.8503 54.6125 60.6384 54.6125C60.4265 53.5531 60.0027 53.5531 59.5789 53.3412Z" fill="#222222" />
                                </svg>
                            </span>
                        </WhatsAppButton>
                    </div>
                </div>

                {/* Layout Desktop: Side by side (original) */}
                <div className="hidden md:flex justify-end items-end w-full">
                    {/* Columna izquierda: texto */}
                    <div className="w-6/12 z-10 flex flex-col justify-start items-start gap-2">
                        <span className="uppercase text-white tracking-widest text-2xl font-medium mb-2"> 
                            {banner?.name}
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-[40px] font-medium leading-tight text-white mb-2">
                            <TextWithHighlight text={banner?.description} color='bg-secondary font-semibold' split_coma />
                        </h2>
                    </div>

                    {/* Columna derecha: mensaje y WhatsApp */}
                    <div className="z-10 w-3/12 flex gap-10 items-center pr-8 justify-end min-w-[180px] ml-8">
                        <div className="text-white relative text-2xl text-end mb-2">
                            <TextWithHighlight text={banner?.button_text} color='bg-white font-semibold italic' split_coma />
                        </div>
                        <div className="relative">
                            <WhatsAppButton buttonData={banner?.button_link}>
                                <span className="animate-pulse z-10">
                                    <svg width="101" height="101" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="49.567" cy="49.567" r="49.567" transform="matrix(1 0 0 -1 0.933594 100.066)" fill="#D9D9D9" fillOpacity="0.4" />
                                        <path d="M87.7015 50.6493C87.7015 30.021 70.979 13.2985 50.3507 13.2985C29.7225 13.2985 13 30.021 13 50.6493C13 71.2775 29.7225 88 50.3507 88C70.979 88 87.7015 71.2775 87.7015 50.6493Z" fill="#BCFF52" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M63.8167 37.8734C60.6384 34.6951 56.4006 33 51.951 33C42.6279 33 35 40.6279 35 49.951C35 52.9174 35.8476 55.8838 37.3308 58.4265L35 66.902L43.8993 64.5712C46.4419 65.8425 49.1964 66.6901 51.951 66.6901C61.274 66.6901 68.902 59.0621 68.902 49.7391C68.902 45.2895 66.995 41.0517 63.8167 37.8734ZM51.951 63.9355C49.4083 63.9355 46.8657 63.2999 44.7468 62.0286L44.323 61.8167L39.0258 63.2999L40.5091 58.2146L40.0853 57.5789C38.6021 55.2482 37.9664 52.7055 37.9664 50.1629C37.9664 42.5349 44.323 36.1783 51.951 36.1783C55.765 36.1783 59.1552 37.6615 61.9097 40.2042C64.6642 42.9587 65.9356 46.3489 65.9356 50.1629C65.9356 57.5789 59.7908 63.9355 51.951 63.9355ZM59.5789 53.3412C59.1552 53.1293 57.0363 52.0699 56.6125 52.0699C56.1888 51.858 55.9768 51.858 55.7649 52.2817C55.553 52.7055 54.7055 53.5531 54.4937 53.9768C54.2818 54.1887 54.0698 54.1887 53.6461 54.1887C53.2223 53.9768 51.951 53.5531 50.2559 52.0699C48.9846 51.0104 48.137 49.5272 47.9251 49.1034C47.7132 48.6797 47.9251 48.4678 48.137 48.2559C48.3489 48.044 48.5608 47.8321 48.7727 47.6202C48.9846 47.4083 48.9846 47.1964 49.1965 46.9846C49.4084 46.7727 49.1965 46.5608 49.1965 46.3489C49.1965 46.137 48.3489 44.0181 47.9251 43.1706C47.7132 42.5349 47.2895 42.5349 47.0776 42.5349C46.8657 42.5349 46.6538 42.5349 46.23 42.5349C46.0181 42.5349 45.5943 42.5349 45.1706 42.9587C44.7468 43.3825 43.6874 44.4419 43.6874 46.5608C43.6874 48.6797 45.1706 50.5866 45.3825 51.0104C45.5944 51.2223 48.3489 55.6719 52.5866 57.367C56.1887 58.8502 56.8244 58.4265 57.672 58.4265C58.5195 58.4265 60.2146 57.367 60.4265 56.5195C60.8502 55.4601 60.8503 54.6125 60.6384 54.6125C60.4265 53.5531 60.0027 53.5531 59.5789 53.3412Z" fill="#222222" />
                                    </svg>
                                </span>
                            </WhatsAppButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>)
}