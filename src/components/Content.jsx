import React from "react";

import { Routes, Route} from "react-router-dom"

import Home from "../views/home/Home";
import CadastraProduto from "../views/epi/produtos/Cadastra";
import ListaProduto from "../views/epi/produtos/Lista";
import CadastraCategoria from "../views/epi/categoria/Cadastra";
import ListaCategoria from "../views/epi/categoria/Lista";
import CadastraFornecedor from "../views/epi/fornecedor/Cadastro";
import ListaFornecedor from "../views/epi/fornecedor/Lista";
import InfoColaborador from "../views/colaboradores/Info";
import ListaColaboradores from "../views/colaboradores/Lista";
import Vinculo from "../views/colaboradores/Vinculo";
import SolicitaItem from "../views/epi/solicitacao/Solicita";
import ListaSolicitacoes from "../views/epi/solicitacao/ListaSolicitacoes";
import Detalhes from "../views/epi/solicitacao/Detalhes";
import Confirmacao from "../views/colaboradores/Confirmacao";
import ListaCompras from "../views/epi/solicitacao/ListaCompras";
import SolicitaCompras from "../views/epi/solicitacao/SolicitaCompras";
import DetalhesCompras from "../views/epi/solicitacao/DetalhesCompras";
import ListaVestimenta from "../views/vestimenta/vestimentas/Lista";
import CadastraVestimenta from "../views/vestimenta/vestimentas/Cadastra";
import ListaItens from "../views/vestimenta/vestimentas/ListaItens";
import Tamanho from "../views/vestimenta/vestimentas/Tamanho";
import ListaVestimentas from "../views/vestimenta/solicitacao/ListaVestimentas";
import DetalhesVestimentas from "../views/vestimenta/solicitacao/DetalhesVestimentas";
import Itens from "../views/vestimenta/compras/Itens";
import ListaComprasVestimentas from "../views/vestimenta/compras/ListaCompras";
import DetalhesComprasVestimentas from "../views/vestimenta/compras/DetalhesCompras";
import VincularItens from "../views/vestimenta/solicitacao/VincularItens";
import Pendente from "../views/colaboradores/Pendente";
import Autentifica from "../views/colaboradores/Autentifica";
import ListaCompraAvulso from "../views/vestimenta/compras/Avulsa";
import Listao from "../views/vestimenta/solicitacao/Listao";


const Content = props => (
    <div className="main-panel">
        <div className="content-wrapper">
            
        </div>
    </div>
)

export default Content