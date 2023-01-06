import './App.css'
import React, { useState } from "react";
import { Navigate, Route, Routes } from 'react-router-dom';

import Login from './views/login/Login';
import Session from './components/Session';
import { useEffect } from 'react';
import Api from './components/Api';
import MainTemplate from './components/MainTemplate';

import Home from "./views/home/Home";
import CadastraProduto from "./views/epi/produtos/Cadastra";
import ListaProduto from "./views/epi/produtos/Lista";
import CadastraCategoria from "./views/epi/categoria/Cadastra";
import ListaCategoria from "./views/epi/categoria/Lista";
import CadastraFornecedor from "./views/epi/fornecedor/Cadastro";
import ListaFornecedor from "./views/epi/fornecedor/Lista";
import InfoColaborador from "./views/colaboradores/InfoVestimenta";
import InfoEpi from "./views/colaboradores/InfoEPI";
import ListaColaboradores from "./views/colaboradores/Lista";
import CadastraTamanhos from "./views/epi/tamanhos/Cadastrar";
import CadastraCertificado from "./views/epi/certificado/Cadastra";
import ListaCertificado from "./views/epi/certificado/Lista";
import GerenciarEstoque from './views/epi/estoque/GerenciarEstoque';
import InserirEstoque from './views/epi/estoque/InserirEstoque';
import SolicitarEPI from './views/epi/solicitacao/SolicitarEPI';
import ListaVestimenta from "./views/vestimenta/vestimentas/Lista";
import CadastraVestimenta from "./views/vestimenta/vestimentas/Cadastra";
import ListaItens from "./views/vestimenta/vestimentas/ListaItens";
import ListaVestimentas from "./views/vestimenta/solicitacao/ListaVestimentas";
import DetalhesVestimentas from "./views/vestimenta/solicitacao/DetalhesVestimentas";
import Itens from "./views/vestimenta/compras/Itens";
import ListaComprasVestimentas from "./views/vestimenta/compras/ListaCompras";
import DetalhesComprasVestimentas from "./views/vestimenta/compras/DetalhesCompras";
import Pendente from "./views/colaboradores/Pendente";
import Autentifica from "./views/colaboradores/Autentifica";
import ListaCompraAvulso from "./views/vestimenta/compras/Avulsa";
import Listao from "./views/vestimenta/solicitacao/Listao";
import ListaVestimentasFinalizada from './views/vestimenta/solicitacao/ListaVestimentaFinalizada';
import Teste from './views/Teste';
import AdicionarHistorico from './views/colaboradores/AdicionarHistorico';

const App = props => {

    const [token, setToken] = useState(Session.getSession());
    const [tokenValidado, setTokenValidado] = useState();
    
    const saveToken = (mLogado, id, nome, email, admin, compras) => {
        let json = {id, nome, email, admin, compras}
        Session.setSession(mLogado, json)
        setToken(json)
    };

    useEffect(() => {
        const verificaToken = async() => {
            let tokenApi = await Session.getToken();
            if(tokenApi && tokenApi.status !== 401) {
                let diff = new Date(new Date() - new Date(tokenApi.data))
                if(diff.getUTCMinutes() > 10)
                {
                    let  res = await Api.getToken();
                    setTokenValidado(res)
                }
                else
                {
                    let minRestante = 12 - diff.getUTCMinutes();
                    setTimeout(() => {
                        let res = Api.getToken();
                        setTokenValidado(res)
                    }, (minRestante * 60000))
                }
            }
            else
            {
                Session.deleteSession();
                let res = JSON.parse(sessionStorage.getItem('reload'))
                if(res == null)
                {
                    sessionStorage.setItem('reload', JSON.stringify({reload: false}));
                    res = JSON.parse(sessionStorage.getItem('reload'))
                    window.location.reload();
                }
                else if(res.reload === true)
                {
                    sessionStorage.setItem('reload', JSON.stringify({reload: false}));
                    res = JSON.parse(sessionStorage.getItem('reload'))
                    window.location.reload();
                }                    
            }
        }
        verificaToken();
        return () => clearTimeout(verificaToken);
    }, [tokenValidado, token])

    if(!token)
    {
        return (
            <Login setToken={saveToken}/>
        )
    }else{
        return (
            
            <Routes>
                {/* Vestimenta */}
                <Route path="/" element={<MainTemplate/>}>
                    <Route index element={<Home/>} />
                    <Route path="listaColaboradores" element={<ListaColaboradores/>} />                
                    <Route path="colaborador" element={<InfoColaborador/>} />
                    <Route path="pendente" element={<Pendente/>} />
                    <Route path="autentificaUsuario" element={<Autentifica/>} />
                    <Route path="listaVestimentas" element={<ListaVestimenta/>}/>
                    <Route path="vestimenta" element={<CadastraVestimenta/>} />
                    <Route path="vestimentaItens" element={<ListaItens/>}/>
                    <Route path="listaPedidoVestimentas" element={<ListaVestimentas/>}/>
                    <Route path="listaVestimentasFinalizadas" element={<ListaVestimentasFinalizada/>}/>
                    <Route path="listaoPedidoVestimentas" element={<Listao/>} />
                    <Route path="detalhesVestimentas" element={<DetalhesVestimentas/>} />
                    <Route path="listaItensCompras" element={<Itens/>}/>
                    <Route path="listaComprasVestimentas" element={<ListaComprasVestimentas/>}/>
                    <Route path="detalhesComprasVestimentas" element={<DetalhesComprasVestimentas/>} />
                    <Route path="listaCompraAvulsa" element={<ListaCompraAvulso/>}/>
                    <Route path="adicionarHistorico" element={<AdicionarHistorico/>}/>
                    <Route path="*" element={<Navigate to ="/" />}/>
                    <Route path="urlrecepca" element={<Teste />}/>

                {/* EPI */}
                    <Route path="cadastraCategoria" element={<CadastraCategoria/>} />
                    <Route path="listaCategorias" element={<ListaCategoria/>} />
                    <Route path="cadastraFornecedor" element={<CadastraFornecedor/>} />
                    <Route path="listaFornecedor" element={<ListaFornecedor/>} />
                    <Route path="cadastraProduto" element={<CadastraProduto/>} />
                    <Route path="listaProduto" element={<ListaProduto/>} />
                    <Route path="cadastraTamanhos" element={<CadastraTamanhos/>} />
                    <Route path="cadastraCertificado" element={<CadastraCertificado/>} />
                    <Route path="listaCertificado" element={<ListaCertificado/>} />
                    <Route path="gerenciarEstoque" element={<GerenciarEstoque/>} />
                    <Route path="inserirEstoque" element={<InserirEstoque/>} />
                    <Route path="solicitarEPI" element={<SolicitarEPI/>} />
                    <Route path="infoEPI" element={<InfoEpi/>} />
                </Route>
            </Routes>
        )
    }
}

export default App