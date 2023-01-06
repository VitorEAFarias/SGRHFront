import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../../../components/Api";
import Helpers from "../../../components/Helpers";
import Session from "../../../components/Session";

const dateNow = _ => {
    let dataNow = new Date();
    let dia = (dataNow.getDate() <= 9 ? "0"+dataNow.getDate() : dataNow.getDate());
    let mes = (dataNow.getMonth() + 1) <= 9 ? "0"+(dataNow.getMonth()+1) : dataNow.getMonth()+1;
    let ano = dataNow.getFullYear()
    let hora = dataNow.getHours() <= 9 ? "0"+dataNow.getHours() : dataNow.getHours();
    let minuto = dataNow.getMinutes() <= 9 ? "0"+dataNow.getMinutes() : dataNow.getMinutes();
    let segundo = dataNow.getSeconds() <= 9 ? "0"+dataNow.getSeconds() : dataNow.getSeconds();

    return dia+"_"+mes+"_"+ano+"_"+hora+"_"+minuto+"_"+segundo;
}

const DetalhesCompras = _ => {

    //Usuario logado
    const user = Session.getSession();

    //Variaveis de Controle
    const [compras, setCompras] = useState();
    const [status, setStatus] = useState();
    const [tabela, setTabela] = useState();
    const [blocoPrecoTotal, setBlocoPrecoTotal] = useState();

    //Controle de desativados
    const [disabledSalvar, setDisabledSalvar] = useState(true)

    //Parametro
    const id = Session.getParam()

    const baixarDocumento = async() => {
        const res = await Api.queryGet(`/controllerVestRepositorio/relatorio/${compras.id}`);

        if(res.result) {
            const link = document.createElement('a');
            link.href = "data:application/pdf;base64,"+res.pdf;
            link.setAttribute(
                'download',
                `${dateNow()}.pdf`,
            );

            document.body.appendChild(link);

            link.click();

            link.parentNode.removeChild(link);
        }
    }

    const salvaCompra = _ => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()

                let post = {
                    id: compras.id,
                    idUsuario: compras.idUsuario,
                    dataCompra: compras.dataCompra,
                    itensRepositorio: compras.itensRepositorio,
                    status: status
                };

                let res;
                if(status === "8")
                    res = await Api.queryPut(`/controllervestcompras/processoCompra/${id}`, post);
                else if(status === 2)
                    res = await Api.queryPut(`/controllervestcompras/comprarItens/${id}`, post);
                else
                    res = await Api.queryPut(`/controllervestcompras/reprovarCompra/${id}`, post);

                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        loadCompras();
                        setDisabledSalvar(true);
                    });
                }
                else
                {
                    Swal.fire("OPS!", res.message, "error");
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const loadTabela = async (compra) => {
        setTabela(compra.itensRepositorio.map((item, i) => {
            return(
                <tr key={`tabelas${i}`}>
                    <td>{item.nome}</td>
                    <td>{item.tamanho}</td>
                    <td>{item.quantidade}</td>
                    <td>{item.preco}</td>
                    <td>{item.precoTotal}</td>
                </tr>
            )
        }))
    }

    const loadCompras = async () => {
        Swal.fire({
            backdrop: true,
            didOpen: async () => {
              Swal.showLoading();
              const res = await Api.queryGet(`/controllervestcompras/${id}`);
              if(res.result) {
                setCompras(res.compra);
                loadTabela(res.compra)
                montaPrecoTotal(res.compra)
                if(res.compra.idStatus === 8) {
                    setStatus(2)
                }
                Swal.close();
              } else {
                Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
              }   
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const montaPrecoTotal = (compra) => {

        var valor = 0.00;

        compra.itensRepositorio.map((item, i) => {
            valor += parseFloat(item.precoTotal)
        })

        setBlocoPrecoTotal(<p><span className="font-weight-bold">Preço Total: </span>R$ {valor}</p>)
    }

    useEffect(() => {
        loadCompras();
    }, [id])

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Detalhes do Pedido de Compra</h4>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-group">
                                <label htmlFor="nome">Solicitante</label>
                                <input type="text" className="form-control" id="emissor" name="emissor" placeholder="Emissor: " defaultValue={compras?.nome} readOnly/>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div className="form-group">
                                <label htmlFor="nome">Status</label>
                                <input type="text" className="form-control" id="emissor" name="emissor" placeholder="Emissor: " defaultValue={compras?.status} readOnly/>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div className="form-group">
                                <label htmlFor="nome">Data de Abertura</label>
                                <input type="text" className="form-control" id="dataAbertura" name="dataAbertura" placeholder="Data de Abertura: " defaultValue={compras? Helpers.formataData(compras.dataCompra):''} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-lg-12">
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Tamanho</th>
                                        <th>Quantidade</th>
                                        <th>Preço Unitario</th>
                                        <th>Preço Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabela}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-12 text-right">
                            {blocoPrecoTotal}
                        </div>
                    </div>
                    {user.compras && compras && compras.idStatus !== 2 && compras.idStatus !== 3 && compras.idStatus !== 8 &&
                        <div className="row mt-5">
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select className="form-control" id="status" defaultValue={-1} onChange={e => {
                                        setStatus(e.target.value)
                                        setDisabledSalvar(false);
                                        }}>
                                        <option value={-1} disabled>Selecione a opção</option>
                                        <option key={"status1"} value={8}>Aprovar</option>
                                        <option key={"status0"} value={3}>Reprovar</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    }
                    { user.compras && compras && compras.idStatus === 8 &&
                        <button type="button" className="btn btn-inverse-primary" onClick={e => {
                            salvaCompra()
                        }}>Item(ns) Entregue(s) ao RH</button>
                    }
                    <div className='row mt-5'>
                        <div className='col-lg-12'>
                            <Link to="/listaComprasVestimentas" className="btn btn-inverse-secondary mr-3">Voltar</Link>
                            {user.compras && compras && compras.idStatus !== 2 && compras.idStatus !== 3 && compras.idStatus !== 8 && <button type="button" className="btn btn-inverse-primary" disabled={disabledSalvar} onClick={e => salvaCompra()}>Salvar</button>}
                            {user.admin && compras && compras.idStatus === 2 && <button type="button" className="btn btn-inverse-primary" onClick={e => baixarDocumento()}>Gerar Lista Comprada</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetalhesCompras;