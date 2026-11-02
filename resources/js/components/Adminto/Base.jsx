import React, { useContext, useEffect, useState } from "react";
import Footer from "./Footer";
import Menu from "./Menu";
import NavBar from "./NavBar";
import RigthBar from "./RightBar";
import { LanguageProvider } from "../../context/LanguageContext";
import "tippy.js/dist/tippy.css";

//import WhatsAppModal from '../modals/WhatsAppModal'

moment.tz.setDefault("UTC");

const Base = ({ children, title, ...props }) => {
    return (
        <LanguageProvider>
            <div id="wrapper">
                <NavBar
                    {...props}
                    title={title}
                    //whatsappStatus={whatsappStatus}
                />
                <Menu {...props} />
                <div className="content-page">
                    <div className="content">
                        <div className="container-fluid">{children}</div>
                    </div>
                    <Footer />
                </div>
            </div>
            {/*<WhatsAppModal status={whatsappStatus} setStatus={setWhatsappStatus} />*/}
            <RigthBar {...props} />
            <div className="rightbar-overlay"></div>
        </LanguageProvider>
    );
};

export default Base;
