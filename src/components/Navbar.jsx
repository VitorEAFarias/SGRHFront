import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Session from "./Session";

const Navbar = props => {

    const [user] = useState(Session.getSession());
    const [hoje, setHoje] = useState("");

    const handleLogout = () => {      
        Swal.fire({
          title: 'Tem certeza?',
          html: 'Deseja sair do sistema?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              text: 'Saindo, por favor aguarde...',
              allowEscapeKey: false,
              allowOutsideClick: false,
              backdrop: true,
              didOpen: () => {
                Swal.showLoading();
                Session.deleteSession();
                localStorage.removeItem('listaVestimentas');
                sessionStorage.setItem('reload', JSON.stringify({reload: true}));
                Swal.fire("Deslogado!", "Até mais ;D", "success").then(() => {
                  window.location.reload();
                });
              }
            })
          }
        })      
      };

    useEffect(() => {
        let monName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        let hoje = new Date();
        setHoje(hoje.getDate()+ " de " + monName[hoje.getMonth()]);
    }, [])

    return (
        <div>
            <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
                <div className="navbar-brand-wrapper d-flex justify-content-center">
                    <div className="navbar-brand-inner-wrapper d-flex justify-content-between align-items-center w-100">
                    <Link to={`/`} className="navbar-brand brand-logo" style={{color: "#ffffff"}} onClick={e => {Session.setParam("")}}>Vestimentas</Link>
                    <Link to={`/`} className="navbar-brand brand-logo-mini" style={{color: "#ffffff"}} onClick={e => {Session.setParam("")}}>Vestimentas</Link>
                    <button className="navbar-toggler navbar-toggler align-self-center" type="button">
                        <span className="typcn typcn-th-menu"></span>
                    </button>
                    </div>
                </div>
                <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
                    <ul className="navbar-nav mr-lg-2">
                    <li className="nav-item nav-profile dropdown">
                        <div className="nav-link" data-toggle="dropdown" id="profileDropdown">
                            <img src="./assets/img/Reis_logo.png" alt="profile"/>
                            <span className="nav-profile-name">{
                                user.nome.toLowerCase().split(" ").map((palavra) => {
                                    if(palavra.length > 0)
                                        return palavra[0].toUpperCase() + palavra.substring(1);
                                }).join(" ")
                            }</span>
                        </div>
                        <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                        <button className="dropdown-item" onClick={ _ => {handleLogout()}}>
                            <i className="typcn typcn-eject text-primary"></i>
                            Sair
                        </button>
                        </div>
                    </li>
                    </ul>
                    <ul className="navbar-nav navbar-nav-right">
                    <li className="nav-item nav-date dropdown">
                        <span className="nav-link d-flex justify-content-center align-items-center">
                            <h6 className="date mb-0">Dia de Hoje: {hoje}</h6>
                            <i className="typcn typcn-calendar"></i>
                        </span>
                    </li>
                    </ul>
                    {/* <li className="nav-item dropdown mr-0">
                        <a className="nav-link count-indicator dropdown-toggle d-flex align-items-center justify-content-center" id="notificationDropdown" href="/#" data-toggle="dropdown">
                        <i className="typcn typcn-bell mx-0"></i>
                        <span className="count"></span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                        <p className="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
                        <a className="dropdown-item preview-item" href="/#">
                            <div className="preview-thumbnail">
                            <div className="preview-icon bg-success">
                                <i className="typcn typcn-info mx-0"></i>
                            </div>
                            </div>
                            <div className="preview-item-content">
                            <h6 className="preview-subject font-weight-normal">Application Error</h6>
                            <p className="font-weight-light small-text mb-0 text-muted">
                                Just now
                            </p>
                            </div>
                        </a>
                        <a className="dropdown-item preview-item" href="/#">
                            <div className="preview-thumbnail">
                            <div className="preview-icon bg-warning">
                                <i className="typcn typcn-cog-outline mx-0"></i>
                            </div>
                            </div>
                            <div className="preview-item-content">
                            <h6 className="preview-subject font-weight-normal">Settings</h6>
                            <p className="font-weight-light small-text mb-0 text-muted">
                                Private message
                            </p>
                            </div>
                            <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                            <button className="dropdown-item" onClick={ _ => {handleLogout()}}>
                                <i className="typcn typcn-eject text-primary"></i>
                                Sair
                            </button>
                            </div>
                        </li>
                    </ul>
                    <ul className="navbar-nav navbar-nav-right">
                        <li className="nav-item nav-date dropdown">
                            <span className="nav-link d-flex justify-content-center align-items-center">
                                <h6 className="date mb-0">Dia de Hoje: {hoje}</h6>
                                <i className="typcn typcn-calendar"></i>
                            </span>
                        </li>
                    </ul> 
                    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                        <span className="typcn typcn-th-menu"></span>
                        </button>*/}
                </div>
            </nav>
            <div className="navbar-breadcrumb col-xl-12 col-12 d-flex flex-row p-0">
            
            </div>
        </div>
    )
}

export default Navbar