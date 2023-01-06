import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../../components/Api";
import Session from "../../components/Session";

const Pendente = _ => {

    //Parametro
    const id  = Session.getParam();

    //Variavel de Controle
    const [lista, setLista] = useState([]);
    const [tabela, setTabela] = useState([]);
    const [itemMarcado, setItemMarcado] = useState([]);

    //Controle de Desativada
    const [disabledButton, setDisabledButton] = useState(true)

    //Navegação
    const navigate = useNavigate();

    const salvaItens = async() => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()

                var ped = [];

                if(itemMarcado.length > 0)
                {
                    for(let i=0; i<itemMarcado.length; i++){
                        if(itemMarcado[i].marcado === true)
                        {
                            let verif = 0;
                            for(let j=0; j<ped.length; j++)
                            {
                                if(itemMarcado[i].idPedido === ped[j].idPedido)
                                {
                                    ped[j].idItens.push({idItem: itemMarcado[i].idItem, tamanho: itemMarcado[i].tamanho});
                                    verif = 1;
                                }
                            }
                            if(verif === 0)
                            {
                                let listItens = [];
            
                                listItens.push({idItem: itemMarcado[i].idItem, tamanho: itemMarcado[i].tamanho});
                                ped.push({idPedido: itemMarcado[i].idPedido, idItens: listItens})
                            }
                        }
                    }
                }

                sessionStorage.setItem('liberarItens', JSON.stringify(ped));
                
                Swal.close();
                Session.setParam(id)
                navigate(`/autentificaUsuario`);
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const marcaItem = (checked, i) => {
        let itens = itemMarcado;
        itens[i].marcado = checked;
        setItemMarcado(itens);

        marcaDisabledButton();
    }

    const marcaDisabledButton = () => {
        let cont = 0;
        itemMarcado.map((item) => {
            if(item.marcado === true)
            {
                cont++;
            }
        })

        if(cont > 0) 
            setDisabledButton(false)
        else
            setDisabledButton(true)
    }

    const montaTabela = async(listaItens) => {

        if(listaItens.length > 0)
        {
            setTabela(listaItens.map((item, i) => {
                let itens = itemMarcado;
                
                itens.push({idPedido: item.idPedido, idItem: item.idItem, tamanho: item.tamanho, marcado: false})
                
                setItemMarcado(itens);
                
                return (
                    <tr key={`linha${i}`}>
                        <td width={"10%"}>
                            <div className="form-check form-check-primary">
                                <label className="form-check-label">
                                    <input type="checkbox" className="form-check-input" onClick={e => marcaItem(e.target.checked, i)}/>
                                    <i className="input-helper"></i>
                                </label>
                            </div>
                        </td>
                        <td>{item.nomeVestimenta}</td>
                        <td>{item.tamanho}</td>
                    </tr>
                )    
            }));
        }
        else
        {
            setTabela(
                <tr key={`linha0`}>
                    <td colSpan={3} className="text-center">Nenhum Item Pendente</td>
                </tr>
            )
        }
    }

    const loadLista = async() => {
        Swal.showLoading();
        const res = await Api.queryGet(`/controllerVestVinculo/status/4/${id}`);
        if(res.result) {  
            setLista(res.lista)
            montaTabela(res.lista);
            Swal.close();
        }
    }

    useEffect(() => {

        setItemMarcado([])

        loadLista();
    }, [])

    return (
        <div className="row">
            <div className="col-lg-12 stretch-card">
                <div className='card'>
                    <div className='card-body'>
                        <h4 className='card-title'>Pendencia na Confirmação de Recebimento</h4>
                        <div className="row">
                            <div className="col-lg-12">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Item</th>
                                            <th>Tamanho</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tabela}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-lg-12">
                                <button type="button" className="btn btn-inverse-secondary mr-3" onClick={e => {
                                    Session.setParam(id);
                                    navigate("/colaborador")
                                }}>Voltar</button>
                                <button type="button" className="btn btn-primary mr-4" disabled={disabledButton} onClick={e => salvaItens()}>Aceitar</button>
                                {/* <button type="button" className="btn btn-danger">Recusar</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Pendente;