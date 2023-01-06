import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../../../components/Api";
import Helpers from "../../../components/Helpers";

const Listao = _ => {

    //Variavel de Controle
    const [listaItemC, setListaItemC] = useState([]);
    const [lista, setLista] = useState([])

    const verificaDisponibilidade = (status, usado) => {
        
        let texto = "";
        for (let i=0; i<listaItemC.length; i++) {
            if(listaItemC[i].check === true ) {
                if(status === 4 && usado === 'Y' && listaItemC[i].quantidade > listaItemC[i].quantidadeEstoqueUsado)
                {
                    texto += listaItemC[i].nomeItem+" - "+listaItemC[i].tamanhoItem+" - "+listaItemC[i].emitente+"<br/>";
                }
                else if(status === 4 && listaItemC[i].quantidade > listaItemC[i].quantidadeEstoque)
                {
                    texto += listaItemC[i].nomeItem+" - "+listaItemC[i].tamanhoItem+" - "+listaItemC[i].emitente+"<br/>";
                }
            }
        }

        return texto;
    }

    const salvaLista = (status, usado = 'N') => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let listaCompra = [];

                let texto = verificaDisponibilidade(status, usado);

                if(texto !== "")
                {
                    Swal.fire("Estoque não disponivel para este item", texto, "error");
                }
                else
                {
                    for(let i=0; i<lista.length; i++) {
                    
                        if(listaCompra.length>0)
                        {
                            let verif = 1;
                            for(let j=0; j<listaCompra.length; j++) {
                                if(lista[i].pedido.id === listaCompra[j].id)
                                {
                                    verif = 0;
                                }
                            }
    
                            if(verif === 1)
                            {
                                listaCompra.push(lista[i].pedido)    
                            }
                        }
                        else
                        {
                            listaCompra.push(lista[i].pedido)
                        }
                    }
    
                    for(let i=0; i<listaItemC.length; i++) {
                        if(listaItemC[i].check === true) {
                            for(let j=0; j<listaCompra.length; j++) {
                                for(let k=0; k<listaCompra[j].item.length; k++) {
                                    if(
                                        listaItemC[i].idPedido === listaCompra[j].id && 
                                        listaItemC[i].idItem === listaCompra[j].item[k].id && 
                                        listaItemC[i].tamanhoItem === listaCompra[j].item[k].tamanho
                                    )
                                    {
                                        listaCompra[j].item[k].status = status;
                                        listaCompra[j].item[k].usado = usado;
                                    }
                                }
                            }
                        }
                    }

                    if(listaCompra.length > 0)
                    {
                        let res = await Api.queryPut(`/controllervestpedidos/itens/1`, listaCompra);
                        if(res.result !== false)
                        {
                            Swal.fire("Sucesso!", res.message, "success").then(() => {
                                loadItens();
                            });
                        }
                        else
                        {
                            Swal.fire("OPS!", res.message, "error");
                        }
                    }
                    else
                    {
                        Swal.fire("OPS!", "Selecione pelo menos um item", "error");
                    }
                    
                }


            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const corrigiLista = listaI => {
        let l = listaI.map((item) => {
            return({
                dataInserida: item.pedido.dataPedido,
                emitente: item.emitente,
                idItem: item.idItem,
                idPedido: item.pedido.id,
                nomeItem: item.nomeItem,
                quantidade: item.quantidade,
                quantidadeEstoque: item.quantidadeEstoque,
                quantidadeEstoqueUsado: item.quantidadeEstoqueUsado,
                status: item.status,
                tamanhoItem: item.tamanhoItem,
                check: false
            })
        })
        
        setListaItemC(l);
    }

    const marcaItem = (check, i) => {
        let list = [...listaItemC];
        list[i].check = check;
        setListaItemC(list);
    }

    const loadItens = async() => {
        Swal.fire({
            backdrop: true,
            didOpen: async () => {
                Swal.showLoading();
                const res = await Api.queryGet('/controllervestpedidos');
                if(res.result) {
                    setLista(res.lista);
                    corrigiLista(res.lista);
                    Swal.close();
                } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                }   
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    useEffect(() => {
        loadItens();
    }, [])

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Lista Completa de Solicitações</h4>
                    <div className='row'>
                        <div className='col-lg-12 mt-2'>
                            <button type="button" className="btn btn-inverse-warning mr-4" onClick={e => salvaLista(4)}>Vincular item(ns) com o colaborador</button>
                            <button type="button" className="btn btn-inverse-warning mr-4" onClick={e => salvaLista(4, 'S')}>Vincular item(ns) usados com o colaborador</button>
                            <button type="button" className="btn btn-inverse-warning" onClick={e => salvaLista(5)}>Enviar para compra</button>
                        </div>
                        <div className='col-lg-12 mt-4'>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Item</th>
                                        <th>Tamanho</th>
                                        <th>Quantidade</th>
                                        <th>Estoque</th>
                                        <th>Estoque Usada</th>
                                        <th>Solicitante</th>
                                        <th>Data da Solicitação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listaItemC && listaItemC.map((item, i) => {
                                            return (
                                                <tr key={`itens${i}`}>
                                                    <td>
                                                        <div className="form-check form-check-primary">
                                                            <label className="form-check-label">
                                                                <input type="checkbox" className="form-check-input" defaultChecked={false} onClick={e => marcaItem(e.target.checked, i)}/>
                                                                <i className="input-helper"></i>
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>{item.nomeItem}</td>
                                                    <td>{item.tamanhoItem}</td>
                                                    <td>{item.quantidade}</td>
                                                    <td>{item.quantidadeEstoque}</td>
                                                    <td>{item.quantidadeEstoqueUsado}</td>
                                                    <td>{item.emitente}</td>
                                                    <td>{Helpers.formataData(item.dataInserida)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-12 mt-4">
                            <Link to="/listaPedidoVestimentas" className="btn btn-inverse-secondary mr-3">Voltar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Listao;