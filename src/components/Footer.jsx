import React from "react";

const Footer = props => {
    return (
        <footer className="footer">
            <div className="card">
                <div className="card-body">
                    <div className="d-sm-flex justify-content-center justify-content-sm-between">
                        <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © 2022 <a href="https://www.reisoffice.com.br/" className="text-muted" target="_blank">Reis Office</a>. Todos os Direitos Reservado.</span>
                    </div>
                </div>    
            </div>        
        </footer>
    )
}

export default Footer