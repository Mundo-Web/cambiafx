import React from "react";
import { motion } from "framer-motion";
import HtmlContent from "../../Utils/HtmlContent";
import TextWithHighlight from "../../Utils/TextWithHighlight";

const PostCard = ({
    id,
    slug,
    name,
    summary,
    category,
    image,
    post_date,
    firstImage = false,
    classCategory,
    classTitle,
    classDescription,
    classBtn
}) => {
    // Animaciones
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const imageVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.2,
                duration: 0.6
            }
        }
    };

    return (
        <motion.a
            href={`/blog/${slug}`}
            className="flex flex-col self-stretch my-auto w-full mt-6 font-title"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
        >
            <div className={`flex flex-col gap-4 ${firstImage && "flex-col-reverse"}`}>
                <div className="space-y-4">
                    <span className={`inline-block  py-1 text-constrast  text-sm tracking-[8%] uppercase font-medium rounded-full ${classCategory}`}>
                        {category?.name}
                    </span>
                    <h3 className={` font-title line-clamp-2 text-2xl lg:text-[28px] font-medium text-neutral-dark group-hover:text-constrast transition-colors duration-300 ${classTitle}`}>
                        {name}
                    </h3>
                    <p className={`font-title line-clamp-2 text-neutral-light text-lg leading-relaxed ${classDescription}`} dangerouslySetInnerHTML={{ __html: summary }}>

                    </p>
                   <button aria-label="leer más" className={`inline-flex items-center gap-2 bg-constrast p-3 rounded-full text-white text-sm font-medium tracking-[8%] uppercase  hover:gap-3 transition-all duration-300 ${classBtn}`}>
                                   LEER MÁS
                                </button>
                </div>

                <motion.div
                    className="flex flex-col w-full overflow-hidden rounded-lg"
                    whileHover="hover"
                >
                    <motion.img
                        src={`/api/posts/media/${image}`}
                        alt={name}
                        className="w-full object-cover aspect-[4/3]"
                        variants={imageVariants}
                        initial={{ scale: 1 }}
                        style={{ originX: 0.5, originY: 0.5 }} // Para que el zoom sea desde el centro
                    />
                </motion.div>
            </div>


        </motion.a>

    );
};

export default PostCard;