import React from "react";

import { Link} from 'react-router-dom'
import Swal from "sweetalert2";
import Session from "./Session";

const Sidebar = (props) => {

  const user = Session.getSession();

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
              window.location.href = "/";
              //window.location.href = "https://intranet.reisoffice.com.br/smt/";
            });
          }
        })
      }
    })      
  };

  return (
    <nav className="sidebar sidebar-offcanvas custom" id="sidebar">
      <ul className="nav">        
        <li className="nav-item">
          <Link style={{color:'black' }} className="nav-link" onClick={ _ => {Session.setParam("")}} to={"/"}>
            <i className="mdi mdi-home menu-icon"></i>
            <span className="menu-title" style={{cursor:'pointer'}}> Dashboard</span>
          </Link>
          <a style={{color:'black' }} className="nav-link" data-toggle="collapse" href="#minhasVestimentas" aria-expanded="false" aria-controls="minhasVestimentas">              
            <span className="menu-title"> Vestimentas</span>
            <i className="menu-arrow"></i>        
          </a>  
          <div className="collapse" id="minhasVestimentas">
            <Link style={{color:'black' }} className="nav-link" onClick={ _ => {Session.setParam("")}} to={"/colaborador"}>
              <i className="mdi mdi-hanger menu-icon"></i>
              <span className="menu-title" style={{cursor:'pointer'}}> Minhas Vestimentas</span>
            </Link>
            <ul className="nav flex-column sub-menu">  
              <li className="nav-item">
                <a className="nav-link" data-toggle="collapse" href="#solicitacao" aria-expanded="false" aria-controls="solicitacao">
                  <i className="typcn typcn-clipboard menu-icon"></i>
                    <span className="menu-title">Solicitações</span>
                  <i className="menu-arrow"></i>
                </a>
                <div className="collapse" id="solicitacao">
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/vestimentaItens" className="nav-link">Solicitar Vestimentas</Link></li>
                  </ul>
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/listaPedidoVestimentas" className="nav-link">Lista de Vestimentas</Link></li>
                  </ul>
                  { (user.admin || user.compras) &&
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/listaComprasVestimentas" className="nav-link">Lista de Compras</Link></li>
                  </ul>
                  }
                </div>
              </li>            
              {
                user.admin &&
                <li className="nav-item">
                  <a className="nav-link" data-toggle="collapse" href="#configuracao" aria-expanded="false" aria-controls="configuracao">
                    <i className="typcn typcn-cog-outline menu-icon"></i>
                    <span className="menu-title">Configuração</span>
                    <i className="menu-arrow"></i>
                  </a>
                  <div className="collapse" id="configuracao">
                    <ul className="nav flex-column sub-menu">
                      <li className="nav-item"> <Link to="/listaVestimentas" className="nav-link">Lista de Vestimentas</Link></li>
                    </ul>
                  </div>
                </li>
              }   
              {/* </li> */}
            </ul>
          </div>
          <a className="nav-link" data-toggle="collapse" href="#meusEpi" aria-expanded="false" aria-controls="meusEpi">
            <span className="menu-title"> EPI's</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="meusEpi"> 
            <Link style={{color:'black' }} className="nav-link" onClick={ _ => {Session.setParam("")}} to={"/infoEPI"}>
              <i className="mdi mdi-worker menu-icon"></i>
              <span className="menu-title" style={{cursor:'pointer'}}> Meus EPI's</span>
            </Link>             
            <ul className="nav flex-column sub-menu">       
              <li className="nav-item">
                <a className="nav-link" data-toggle="collapse" href="#cadastrarCategoria" aria-expanded="false" aria-controls="cadastrarCategoria">
                  <i className="mdi mdi-folder-multiple-outline menu-icon"></i>
                    <span className="menu-title"> Categorias</span>
                  <i className="menu-arrow"></i>
                </a>
                <div className="collapse" id="cadastrarCategoria">
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/cadastraCategoria" className="nav-link">Cadastrar Categoria</Link></li>
                  </ul>
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/listaCategorias" className="nav-link">Lista de Categorias</Link></li>
                  </ul>
                </div>
              </li>
            </ul>
            <ul className="nav flex-column sub-menu">       
              <li className="nav-item">
                <a className="nav-link" data-toggle="collapse" href="#cadastrarCertificado" aria-expanded="false" aria-controls="cadastrarCertificado">
                  <i className="mdi mdi-certificate menu-icon"></i>
                    <span className="menu-title"> Certificados</span>
                  <i className="menu-arrow"></i>
                </a>
                <div className="collapse" id="cadastrarCertificado">
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/cadastraCertificado" className="nav-link">Cadastrar Certificado</Link></li>
                  </ul>
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/listaCertificado" className="nav-link">Lista de Certificados</Link></li>
                  </ul>
                </div>
              </li>
            </ul>
            <ul className="nav flex-column sub-menu">       
              <li className="nav-item">
                <a className="nav-link" data-toggle="collapse" href="#cadastrarFornecedor" aria-expanded="false" aria-controls="cadastrarFornecedor">
                  <i className="mdi mdi-account-box-outline menu-icon"></i>
                    <span className="menu-title"> Fornecedores</span>
                  <i className="menu-arrow"></i>
                </a>
                <div className="collapse" id="cadastrarFornecedor">
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/cadastraFornecedor" className="nav-link">Cadastrar Fornecedor</Link></li>
                  </ul>
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/listaFornecedor" className="nav-link">Lista de Fornecedores</Link></li>
                  </ul>
                </div>
              </li>
            </ul>
            <ul className="nav flex-column sub-menu">       
              <li className="nav-item">
                <a className="nav-link" data-toggle="collapse" href="#cadastrarProduto" aria-expanded="false" aria-controls="cadastrarProduto">
                  <i className="mdi mdi-barcode menu-icon"></i>
                    <span className="menu-title"> Produtos</span>
                  <i className="menu-arrow"></i>
                </a>
                <div className="collapse" id="cadastrarProduto">
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/cadastraProduto" className="nav-link">Cadastrar Produto</Link></li>
                  </ul>
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/listaProduto" className="nav-link">Lista de Produtos</Link></li>
                  </ul>
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/cadastraTamanhos" className="nav-link">Gerenciar Tamanhos</Link></li>
                  </ul>          
                </div>
              </li>
            </ul>
            <ul className="nav flex-column sub-menu">       
              <li className="nav-item">
                <a className="nav-link" data-toggle="collapse" href="#gerenciarEstoque" aria-expanded="false" aria-controls="gerenciarEstoque">
                  <i className="mdi mdi-poll menu-icon"></i>
                    <span className="menu-title"> Estoque</span>
                  <i className="menu-arrow"></i>
                </a>
                <div className="collapse" id="gerenciarEstoque">
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/gerenciarEstoque" className="nav-link">Gerenciar Estoque</Link></li>
                  </ul>
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/inserirEstoque" className="nav-link">Inserir Estoque</Link></li>
                  </ul>
                </div>
              </li>
            </ul>
            <ul className="nav flex-column sub-menu"> 
              <li className="nav-item">
                <a className="nav-link" data-toggle="collapse" href="#solicitacaoEPI" aria-expanded="false" aria-controls="solicitacaoEPI">
                  <i className="typcn typcn-clipboard menu-icon"></i>
                    <span className="menu-title">Solicitações</span>
                  <i className="menu-arrow"></i>
                </a>
                <div className="collapse" id="solicitacaoEPI">
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/solicitarEPI" className="nav-link">Solicitação de EPI</Link></li>
                  </ul>
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item"> <Link to="/listaPedidoVestimentas" className="nav-link">Troca de EPI</Link></li>
                  </ul>
                </div>
              </li> 
            </ul>
          </div>
          <a style={{color:'black' }} className="nav-link" data-toggle="collapse" href="#colaboradores" aria-expanded="false" aria-controls="colaboradores">
            <i className="typcn typcn-group-outline menu-icon"></i>
            <span className="menu-title"> Colaboradores</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="colaboradores">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item"> <Link to="/listaColaboradores" className="nav-link">Lista de Colaboradores</Link></li>
            </ul>
          </div>
          <a style={{color:'black' }} className="nav-link" onClick={ _ => {handleLogout()}}>
            <i className="typcn typcn-eject-outline menu-icon"></i>
            <span className="menu-title" style={{cursor:'pointer'}}> Sair</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar