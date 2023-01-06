import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../../components/Api";
import Helpers from "../../components/Helpers";
import Session from "../../components/Session";

const Info = _ => {

    //Variavel
    const id = Session.getParam();

    ///Parametro
    const user = Session.getSession();

    //Variavel de Controle
    const [colaborador, setColaborador] = useState([]);
    const [listaVinculo, setListaVinculo] = useState([]);
    const [listaVestimenta, setListaVestimenta] = useState([]);
    const [emUso, setEmUso] = useState(0);
    const [pendente, setPendente] = useState(0);
    const [aberto, setAberto] = useState(0);

    //Controle de Desativado
    const [disabledButton, setDisabledButton] = useState(true);

    //Navegação
    const navigate = useNavigate();

    const idColaborador = id !== "" ? id : user.id
    
    const loadDocumento = async() => {
        const res = await Api.queryGet(`/controllerPdfvinculo/${idColaborador}`);

        if(res.result) {
            const link = document.createElement('a');
            link.href = "data:application/pdf;base64,"+res.pdf;
            link.setAttribute(
                'download',
                `${colaborador.nome.replaceAll(" ", "_")}.pdf`,
            );

            document.body.appendChild(link);

            link.click();

            link.parentNode.removeChild(link);
        }
    }

    useEffect(() => {
        let contUso = 0
        let contPendente = 0

        const loadColaborador = async() => {
            const res = await Api.queryGet(`/controllerColaborador/${idColaborador}`);

            if(res.result)
                setColaborador(res.colaborador)
        }

        const loadSituacoes = async() => {
            const res = await Api.queryGet(`/controllerVestVinculo/situacoes/${idColaborador}`);

            if(res.result) {
                setEmUso(res.vinculado);
                setPendente(res.pendente)
                setAberto(res.pedidosPendentes);
            }
        }

        const loadVestimentas = async() => {
            const res = await Api.queryGet(`/controllerVestVinculo/vinculados/${idColaborador}`);
            if(res.result){
                if(res.lista.length > 0)
                {
                    setDisabledButton(false);
                    setListaVestimenta(res.lista.map((item, i) => {
                        return (
                            <tr key={"linhas"+item.idVinculado}>
                                <td>{item.vestimenta}</td>
                                <td>{item.tamanho}</td>
                                <td>{item.quantidade}</td>
                                <td>{item.usado === "Y" ? "SIM" : "NÃO"}</td>
                                <td>{Helpers.formataData(item.dataVinculo)}</td>
                                <td>{item.dataDesvinculo === "0001-01-01T00:00:00" ? '-'  : Helpers.formataData(item.dataDesvinculo)}</td>
                                <td>
                                    {
                                        item.dataDesvinculo === "0001-01-01T00:00:00" && user.admin ?
                                        <button type="button" className="btn btn-inverse-danger btn-rounded btn-fw" onClick={ _ => {
                                                handleDeletaVinculo(item)
                                            }}>
                                            <i className='mdi mdi-account-remove'></i>
                                        </button> : "-"
                                    }
                                    
                                </td>
                            </tr>
                        )
                    }))
                }
                else
                {
                    setDisabledButton(true);
                    setListaVestimenta(
                        <tr key={"linhas0"}>
                            <td className={"text-center"} colSpan={4}>Nenhum Item Vinculado</td>
                        </tr>
                    )
                }
            }
        }

        const loadEpiVinculo = async() => {
            const res = await Api.queryGet(`/controllerEpiVinculo/${idColaborador}`);
            
            if(res.result) {
                setListaVinculo(res.data.map(function(item) {
                    
                    setEmUso(contUso)
                    setPendente(contPendente)
                    return (
                        <tr key={"linhas"+item.id}>
                            <td>{item.nome}</td>
                            <td>{Helpers.formataData(item.dataVinculo)}</td>
                            <td>{item.categoria}</td>
                            <td>{item.fornecedor}</td>
                            <td>{"-"}</td>
                            <td>
                                <button type="button" className="btn btn-inverse-danger btn-rounded btn-fw" onClick={ _ => {
                                        handleDeletaVinculo(item)
                                    }}>
                                    <i className='mdi mdi-account-remove'></i>
                                </button>
                            </td>
                        </tr>
                    );
                }))
            }
        }

        const handleDeletaVinculo = (data) => {
            Swal.fire({
                title: 'Tem certeza?',
                html: `Deseja remover este vinculo: ${data.vestimenta}?`,
                icon: 'warning',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Enviar para estoque',
                cancelButtonText: 'Cancelar',
                denyButtonText: 'Apenas Desvincular',
            }).then((result) => {
                if(result.isDismissed !== true) {
                    let estoque = false;
                    if(result.isConfirmed === true) {
                        estoque = true;
                    }
                    else if(result.isDenied === true)
                    {
                        estoque = false;
                    }

                    Swal.fire({
                        text: 'Excluindo vinculo...',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        didOpen: async () => {
                            Swal.showLoading();
                            const res = await Api.queryPut(`/controllerVestvinculo/desvincular/${estoque}/${data.idVinculado}`);
                            if(res.result === true)
                            {
                                Swal.fire("Sucesso!", res.message, "success");
                                loadEpiVinculo();
                            }
                            else
                            {
                                Swal.fire("Ops!", res.message, "warning");
                            }
                        }
                    })
                }
                
            })
        }

        loadColaborador();
        loadSituacoes();
        // loadEpiVinculo();
        loadVestimentas()
    }, [idColaborador])
    

    return(
        <div>
            <div className="row">
                <div className="col-md-4 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between justify-content-md-center justify-content-xl-between flex-wrap mb-4">
                                <div className="mb-3">
                                    <p className="mb-4 text-md-center text-lg-left">Itens em Uso</p>
                                    <h1 className="mb-0">{emUso}</h1>
                                </div>
                                <i className="typcn typcn-briefcase icon-xl text-secondary"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between justify-content-md-center justify-content-xl-between flex-wrap mb-4" onClick={e => {
                                Session.setParam(idColaborador);
                                navigate("/pendente")
                            }}>
                                <div className="mb-3">
                                    <p className="mb-4 text-md-center text-lg-left">Confirmação Pendente(s)</p>
                                    <h1 className="mb-0">{pendente}</h1>
                                </div>
                                <i className="typcn typcn-briefcase icon-xl text-secondary"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between justify-content-md-center justify-content-xl-between flex-wrap mb-4" onClick={e => {
                                navigate("/listaPedidoVestimentas")
                            }}>
                                <div className="mb-3">
                                    <p className="mb-4 text-md-center text-lg-left">Pedidos Abertos</p>
                                    <h1 className="mb-0">{aberto}</h1>
                                </div>
                                <i className="typcn typcn-briefcase icon-xl text-secondary"></i>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="col-md-3 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between justify-content-md-center justify-content-xl-between flex-wrap mb-4">
                                <div>
                                    <p className="mb-2 text-md-center text-lg-left">Itens proximos do vencimento</p>
                                    <h1 className="mb-0">{pendente}</h1>
                                </div>
                                <i className="typcn typcn-briefcase icon-xl text-secondary"></i>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="row">
                <div className="col-lg-12 stretch-card">
                    <div className='card'>
                        <div className='card-body'>
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="form-group">
                                        <label htmlFor="">Nome</label>
                                        <input type="text" className="form-control" id="nome" name="nome" defaultValue={colaborador?.nome} readOnly/>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="form-group">
                                        <label htmlFor="">Cargo</label>
                                        <input type="text" className="form-control" id="cargo" name="cargo" defaultValue={colaborador?.cargo} readOnly/>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="form-group">
                                        <label htmlFor="">Departamento</label>
                                        <input type="text" className="form-control" id="departamento" name="departamento" defaultValue={colaborador?.departamento} readOnly/>
                                    </div>
                                </div>
                            </div>
                                <div className={`row mt-5 `}>
                                    <div className="col-lg-12 text-right">
                                        <button type="button" className={`btn btn-inverse-primary mr-3 ${disabledButton === true ? 'd-none' : ''}`} onClick={e => loadDocumento()}>Baixar Histórico</button>
                                        {
                                            user.admin &&
                                            <button type="button" className="btn btn-inverse-primary" onClick={e => {
                                                Session.setParam(idColaborador);
                                                navigate("/adicionarHistorico")
                                            }}>Adicionar Historico de Vinculo</button>
                                        }
                                    </div>
                                </div>
                            <div className="row mt-5">
                                <div className="col-lg-12">
                                    <h4 className="mb-2 text-md-center text-lg-left">Lista de Vestimenta(s)</h4>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Vestimenta</th>
                                                    <th>Tamanho</th>
                                                    <th>Quantidade</th>
                                                    <th>Usado</th>
                                                    <th>Data de Vinculo</th>
                                                    <th>Data de Desvinculo</th>
                                                    <th>Ação</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listaVestimenta}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row mt-5">
                                <div className="col-lg-12">
                                    <h4 className="mb-2 text-md-center text-lg-left">Lista de Epi(s)</h4>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Produto</th>
                                                    <th>Data de Vinculo</th>
                                                    <th>Categoria</th>
                                                    <th>Fornecedor</th>
                                                    <th>Status</th>
                                                    <th>Tempo para Vencimento</th>
                                                    <th>Excluir</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listaVinculo}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="row mt-5">
                                <div className="col-lg-12">
                                    <Link to="/listaColaboradores" className="btn btn-inverse-secondary">Voltar</Link>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info