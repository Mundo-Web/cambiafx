import{j as t}from"./RequirementCard-DEdD30eg.js";import{r as p}from"./index-RYns6xqu.js";import{T as l}from"./TextWithHighlight-DJ4ZjNW2.js";import{S as f,c as y}from"./CuponesSection-Bi6-f3NH.js";import{P as g}from"./pagination-qz-hCLaO.js";import{A as b}from"./autoplay-BgjrnjSJ.js";/* empty css               */import"./Strengths-LTWKrnhl.js";import{m as n}from"./proxy-Dg7W2VMC.js";import"./classes-to-selector-CyqfpjkH.js";const j=`
    .pilares-swiper .swiper-slide {
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .pilares-swiper .swiper-wrapper {
        align-items: center;
    }
    .pilares-swiper .swiper-pagination {
        bottom: 10px !important;
        position: static !important;
        text-align: center !important;
        margin-top: 32px !important;
        width: 100% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
    }
    .pilares-swiper .swiper-pagination-bullet {
        width: 32px !important;
        height: 6px !important;
        background: #1a1a1a !important;
        border: none !important;
        opacity: 1 !important;
        margin: 0 6px !important;
        transition: all 0.4s ease !important;
        border-radius: 3px !important;
        cursor: pointer !important;
        position: relative !important;
    }
    .pilares-swiper .swiper-pagination-bullet:hover {
        background: rgba(26, 26, 26, 0.8) !important;
        transform: scale(1.05) !important;
    }
    .pilares-swiper .swiper-pagination-bullet-active {
        background: #BBFF52 !important;
        transform: scale(1.05) !important;
        box-shadow: 0 2px 8px rgba(198, 255, 107, 0.2) !important;
    }
    /* Sobrescribir estilos por defecto de Swiper */
    .swiper-pagination-custom .swiper-pagination-bullet {
        width: 32px !important;
        height: 6px !important;
        background: #1a1a1a !important;
        border: none !important;
        opacity: 1 !important;
        margin: 0 6px !important;
        transition: all 0.4s ease !important;
        border-radius: 3px !important;
        cursor: pointer !important;
        position: relative !important;
    }
    .swiper-pagination-custom .swiper-pagination-bullet:hover {
        background: rgba(26, 26, 26, 0.8) !important;
        transform: scale(1.05) !important;
    }
    .swiper-pagination-custom .swiper-pagination-bullet-active {
        background: #BBFF52 !important;
        transform: scale(1.05) !important;
        box-shadow: 0 2px 8px rgba(198, 255, 107, 0.2) !important;
    }
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .line-clamp-4 {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`,A=({data:a,core_values:e=[]})=>{const[c,m]=p.useState(0),[d,x]=p.useState(!0);p.useEffect(()=>{if(!d)return;const r=setInterval(()=>{m(i=>{const o=i+1;return o>=e.length?0:o})},3e3);return()=>clearInterval(r)},[e.length,d]);const s=r=>r?r.split(/(\*[^*]+\*)/g).map((o,h)=>{if(o.startsWith("*")&&o.endsWith("*")){const w=o.slice(1,-1);return t.jsx("span",{className:"font-semibold text-constrast",children:w},h)}return t.jsx("span",{children:o},h)}):"",u=r=>{x(!1),m(i=>r==="up"?i>0?i-1:e.length-1:i<e.length-1?i+1:0),setTimeout(()=>x(!0),5e3)};return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:j}),t.jsxs("section",{className:"bg-neutral-dark px-2 md:px-0 w-full relative overflow-hidden font-title",children:[t.jsx("div",{className:"absolute bottom-0 right-0 w-full h-full z-0 pointer-events-none",children:t.jsx("img",{src:"/assets/cambiafx/pilares-overlay.png",alt:"Fondo",className:"h-full object-cover pt-16",style:{maskImage:"linear-gradient(to left, transparent, black 300px)",WebkitMaskImage:"linear-gradient(to left, transparent, black 300px)"}})}),t.jsx("div",{className:"hidden lg:block px-[5%] mx-auto relative z-10",children:t.jsxs("div",{className:"flex flex-col lg:flex-row items-end gap-12",children:[t.jsxs(n.div,{className:"flex-1 relative h-[580px] flex flex-col justify-start items-start",initial:{opacity:0,x:-40},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.2},transition:{duration:.7},children:[t.jsx(n.div,{className:"uppercase text-white text-sm font-medium tracking-widest mb-4",initial:{opacity:0,y:-10},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.5,delay:.1},children:"NUESTROS PILARES"}),t.jsx(n.h2,{className:"text-5xl md:text-[64px] tracking-[94%] font-medium text-white mb-6",initial:{opacity:0,x:-30},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.2},transition:{duration:.7,delay:.2},children:t.jsx(l,{text:a==null?void 0:a.title,color:"bg-secondary font-semibold",split_coma:!0})}),t.jsx(n.p,{className:"text-xl text-white mb-4 max-w-md whitespace-pre-line",initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.7,delay:.3},children:t.jsx(l,{text:a==null?void 0:a.description,color:"bg-white font-semibold"})}),t.jsx(n.img,{src:`/api/landing_home/media/${a==null?void 0:a.image}`,alt:a==null?void 0:a.title,className:"absolute h-[450px] scale-x-[-1] top-56 right-0 object-cover z-10",onError:r=>r.target.src="/api/cover/thumbnail/null",initial:{opacity:0,scale:.9,y:40},whileInView:{opacity:1,scale:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.7,delay:.4}})]}),t.jsxs("div",{className:"relative flex-1",children:[t.jsxs("div",{className:"absolute -right-0 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-4",children:[t.jsx("button",{onClick:()=>u("up"),className:"bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group",children:t.jsx("svg",{className:"w-5 h-5 text-white group-hover:text-[#BBFF52] transition-colors",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 15l7-7 7 7"})})}),t.jsx("button",{onClick:()=>u("down"),className:"bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group",children:t.jsx("svg",{className:"w-5 h-5 text-white group-hover:text-[#BBFF52] transition-colors",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})})]}),t.jsxs("div",{className:"flex-1 flex justify-center items-center relative h-[650px] overflow-x-auto scrollbar-hide overflow-y-hidden",children:[t.jsx("div",{className:"absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-dark to-transparent z-20 pointer-events-none"}),t.jsx("div",{className:"absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-neutral-dark to-transparent z-20 pointer-events-none"}),t.jsxs("div",{className:"flex gap-6 w-full max-w-[600px] justify-center",children:[t.jsx("div",{className:"flex flex-col gap-4 w-[250px] relative",children:t.jsx("div",{className:"flex flex-col gap-4 transition-transform duration-1000 ease-in-out",style:{transform:`translateY(${-130*(c%e.length)}px)`},children:[...e,...e,...e].map((r,i)=>t.jsx(n.div,{className:"bg-white rounded-2xl shadow-xl p-6 w-full min-h-[120px] flex-shrink-0 hover:shadow-2xl transition-shadow duration-300",initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.6,delay:.1+i%e.length*.08},whileHover:{scale:1.04,boxShadow:"0 8px 32px 0 rgba(31, 38, 135, 0.08)"},children:t.jsxs("div",{className:"text-center",children:[t.jsx(n.h3,{className:"text-[32px] leading-[94%] font-medium text-neutral-dark mb-3",initial:{opacity:0,x:-10},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.2},transition:{duration:.5,delay:.15+i%e.length*.08},children:s(r.name)}),t.jsx(n.p,{className:"text-base text-neutral-light font-normal",initial:{opacity:0,y:10},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.5,delay:.18+i%e.length*.08},children:r.description})]})},`col1-${i}`))})}),t.jsx("div",{className:"flex flex-col gap-4 w-[250px] relative",children:t.jsx("div",{className:"flex flex-col gap-4 transition-transform duration-1000 ease-in-out",style:{transform:`translateY(${130*(c%e.length)}px)`},children:[...e.slice(3),...e,...e,...e.slice(0,3)].map((r,i)=>t.jsx(n.div,{className:"bg-white rounded-2xl shadow-xl p-6 w-full min-h-[120px] flex-shrink-0 hover:shadow-2xl transition-shadow duration-300",initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.6,delay:.1+i%e.length*.08},whileHover:{scale:1.04,boxShadow:"0 8px 32px 0 rgba(31, 38, 135, 0.08)"},children:t.jsxs("div",{className:"text-center",children:[t.jsx(n.h3,{className:"text-[32px] leading-[94%] font-medium text-neutral-dark mb-3",initial:{opacity:0,x:10},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.2},transition:{duration:.5,delay:.15+i%e.length*.08},children:s(r.name)}),t.jsx(n.p,{className:"text-base text-neutral-light font-normal",initial:{opacity:0,y:10},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.5,delay:.18+i%e.length*.08},children:r.description})]})},`col2-${i}`))})})]})]})]})]})}),t.jsxs("div",{className:"block lg:hidden py-8 px-4 mx-auto relative z-10",children:[t.jsxs(n.div,{className:"text-center mb-8",initial:{opacity:0,y:40},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.7},children:[t.jsx(n.div,{className:"uppercase text-white text-xs font-medium tracking-widest mb-3",initial:{opacity:0,y:-10},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.5,delay:.1},children:"NUESTROS PILARES"}),t.jsx(n.h2,{className:"text-3xl font-medium text-white mb-4 leading-tight",initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.7,delay:.2},children:t.jsx(l,{text:a==null?void 0:a.title,color:"bg-secondary font-semibold",split_coma:!0})}),t.jsx(n.p,{className:"text-sm text-white mb-6 leading-relaxed whitespace-pre-line",initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.7,delay:.3},children:t.jsx(l,{text:a==null?void 0:a.description,color:"bg-white font-semibold"})})]}),t.jsx(n.div,{className:"relative",initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.7,delay:.5},children:t.jsxs(n.div,{className:"w-full py-2",initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.7,delay:.6},children:[t.jsx(f,{modules:[b,g],spaceBetween:16,slidesPerView:1.5,centeredSlides:!1,autoplay:{delay:3e3,disableOnInteraction:!1,pauseOnMouseEnter:!0},pagination:{clickable:!0,dynamicBullets:!1,el:".swiper-pagination-custom",bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active"},loop:!0,className:"pilares-swiper",watchOverflow:!0,speed:800,effect:"slide",breakpoints:{320:{slidesPerView:1.5,spaceBetween:16},480:{slidesPerView:1.5,spaceBetween:16},640:{slidesPerView:1.5,spaceBetween:20}},children:e==null?void 0:e.map((r,i)=>t.jsx(y,{children:t.jsx(n.div,{className:"bg-white rounded-xl shadow-xl p-6 w-full h-[180px] mx-auto transition-shadow duration-300 flex flex-col",initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.6,delay:.1+i*.05},children:t.jsxs("div",{className:"text-center h-full flex flex-col justify-center",children:[t.jsx(n.h3,{className:"text-xl font-medium text-neutral-dark mb-3 leading-tight line-clamp-2",initial:{opacity:0,y:-10},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.5,delay:.15+i*.05},children:s(r.name)}),t.jsx(n.p,{className:"text-sm text-neutral-light font-normal leading-relaxed line-clamp-4 flex-1 flex items-center",initial:{opacity:0,y:10},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.5,delay:.18+i*.05},children:t.jsx("span",{className:"text-center w-full",children:r.description})})]})})},i))}),t.jsx("div",{className:"swiper-pagination-custom mt-8 flex justify-center"})]})})]})]})]})};export{A as default};
