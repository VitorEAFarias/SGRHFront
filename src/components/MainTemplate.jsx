import React from "react";
import { Outlet } from "react-router-dom";
import { VestimentaProvider } from "../context/VestimentaContext";
import { EPIProvider } from "../context/EPIContext";
import Footer from "./Footer";
import Navbar from "./Navbar";
import VestimentaRightSidebar from "./VestimentaRightSidebar";
import EPIRightSidebar from "./EPIRightSidebar";
import Sidebar from "./Sidebar";

const MainTemplate = _ => {
    return (
        <div className="App">
            <VestimentaProvider>
                <EPIProvider>
                    <div className='container-fluid'>
                        <Navbar />
                        <div className="container-fluid page-body-wrapper">
                            <VestimentaRightSidebar />
                            <EPIRightSidebar />
                            <Sidebar/>
                            <div className="main-panel">
                                <div className="content-wrapper">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </EPIProvider>
            </VestimentaProvider>
        </div>
    )
}

export default MainTemplate;