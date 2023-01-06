import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Api from '../../../components/Api';
import Helpers from '../../../components/Helpers';
import Session from '../../../components/Session';

const DetalhesVestimentas = props => {

    //Usuário Logado
    const user = Session.getSession();

    //Variavel de Controle
    const [pedido, setPedido] = useState();
    const [tabela, setTabela] = useState();
    const [dataPedido, setDataPedido] = useState();
    const [liberado, setLiberado] = useState([]);

    //Controle de Desativado
    const [disabledSalvar, setDisabledSalvar] = useState(true)

    //Parametro
    const id = Session.getParam();

    //Navegação
    const navigate = useNavigate();

    const definiStatusItem = (i, status, usado = 'N') => {
        let lista = liberado;
        lista[i].status = status;
        lista[i].dataAlteracao = dateNow();
        lista[i].usado = usado
        setLiberado(lista);
        setDisabledSalvar(false)
    }

    const dateNow = _ => {
        let dataNow = new Date();
        let dia = (dataNow.getDate() <= 9 ? "0"+dataNow.getDate() : dataNow.getDate()) ;
        let mes = (dataNow.getMonth() + 1) <= 9 ? "0"+(dataNow.getMonth()+1) : dataNow.getMonth()+1;
        let ano = dataNow.getFullYear()
        let hora = dataNow.getHours() <= 9 ? "0"+dataNow.getHours() : dataNow.getHours();
        let minuto = dataNow.getMinutes() <= 9 ? "0"+dataNow.getMinutes() : dataNow.getMinutes();
        let segundo = dataNow.getSeconds() <= 9 ? "0"+dataNow.getSeconds() : dataNow.getSeconds();

        return ano+"-"+mes+"-"+dia+"T"+hora+":"+minuto+":"+segundo;
    }

    const salvaPedido = () => {

        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()

                let ped = {
                    "id": pedido.id,
                    "item": liberado,
                    "idUsuario": pedido.idUsuario,
                    "dataPedido": pedido.dataPedido,
                    "status": pedido.idStatus,
                    "dataAlteracao": dateNow(),
                    "idUsuarioAlteracao": pedido.idUsuarioAlteracao,
                    "observacoes": pedido.observacoes
                }
                let res = await Api.queryPut(`/controllervestpedidos/atualizastatuspedidoitem/`, ped);

                if(res.result === false)
                    Swal.fire("OPS!", res.message, "error");
                else
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        setDisabledSalvar(true)
                        setLiberado([]);
                    });
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const loadPedido = async () => {
        Swal.fire({
            backdrop: true,
            didOpen: async () => {
              Swal.showLoading();
              const res = await Api.queryGet(`/controllervestpedidos/${id}`);
              if(res.result) {
                setPedido(res.pedido[0]);
                loadTabela(res.pedido[0].pedido)
                setDataPedido(Helpers.formataData(res.pedido[0].dataPedido))
                Swal.close();
              } else {
                Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
              }   
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const loadTabela = async (pedidos) => {        
        setTabela(pedidos.map((item, i) => {
            let lista = liberado;
            let value = {
                "id": item.id,
                "nome": item.nome,
                "quantidade": item.quantidade,
                "dataAlteracao": item.dataAlteracao,
                "status": item.status,
                "tamanho": item.tamanho,
                "usado": item.usado
            }
            lista.push(value);
            setLiberado(lista);

            return(
                <tr key={`tabelas${i}`}>
                    <td>{item.nome}</td>
                    <td>{item.tamanho}</td>
                    {
                        user.admin ?
                            <td className={item.quantidade <= item.estoque || item.status === 4 ? 'text-success' : 'text-danger'}>{item.quantidade}</td>
                        :
                            <td>{item.quantidade}</td>
                    }
                    
                    { user.admin && <td>{item.estoque}</td> }
                    { user.admin && <td>{item.estoqueUsado}</td> }
                    <td>{item.statusNome}</td>
                    { user.admin &&
                    <td>
                        <div className="form-check form-check-warning">
                            <label className="form-check-label">
                                <input type="radio" className="form-check-input" name={`vincular${i}`} id={`ExampleRadio${1}`} defaultChecked={(item.status === 4 && item.usado === 'N') ? true : false} disabled={((item.status !== 1 && item.status !== 7) || item.quantidade > item.estoque) ? true : false} onClick={e => definiStatusItem(i, 4)}/>
                                <i className="input-helper"></i> Novo
                            </label>
                        </div>
                    </td>
                    }
                    { user.admin &&
                    <td>
                        <div className="form-check form-check-warning">
                            <label className="form-check-label">
                                <input type="radio" className="form-check-input" name={`vincular${i}`} id={`ExampleRadio${1}`} defaultChecked={(item.status === 4 && item.usado === 'S') ? true : false} disabled={((item.status !== 1 && item.status !== 7 && item.status !== 3) || item.quantidade > item.estoqueUsado) ? true : false} onClick={e => definiStatusItem(i, 4, 'S')}/>
                                <i className="input-helper"></i> Usado
                            </label>
                        </div>
                    </td>
                    }
                    { user.admin &&
                    <td>
                        <div className="form-check form-check-warning">
                            <label className="form-check-label">
                                <input type="radio" className="form-check-input" name={`vincular${i}`} id={`ExampleRadio${1}`} defaultChecked={item.status === 5 ? true : false} disabled={(item.status === 1) ? false : true} onClick={e => definiStatusItem(i, 5)}/>
                                <i className="input-helper"></i> Comprar
                            </label>
                        </div>
                    </td>
                    }
                    { user.admin &&
                    <td>
                        <div className="form-check form-check-warning">
                            <label className="form-check-label">
                                <input type="radio" className="form-check-input" name={`vincular${i}`} id={`ExampleRadio${1}`} defaultChecked={item.status === 3 ? true : false} disabled={(item.status === 1 || (item.status === 5 && item.enviadoCompra === "N")) ? false : true} onClick={e => definiStatusItem(i, 3)}/>
                                <i className="input-helper"></i> Reprovar
                            </label>
                        </div>
                    </td>
                    }
                </tr>
            )
        }))
    }

    useEffect(() => {

        loadPedido();

    }, [id, liberado])

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Detalhes da Solicitação</h4>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-group">
                                <label htmlFor="nome">Solicitante</label>
                                <input type="text" className="form-control" id="emissor" name="emissor" placeholder="Emissor: " defaultValue={pedido?.nome} readOnly/>
                            </div>
                        </div>
                        <div className='col-lg-2'>
                            <div className="form-group">
                                <label htmlFor="nome">Status</label>
                                <input type="text" className="form-control" id="emissor" name="emissor" placeholder="Emissor: " defaultValue={pedido?.status} readOnly/>
                            </div>
                        </div>
                        <div className='col-lg-2'>
                            <div className="form-group">
                                <label htmlFor="nome">Número do Pedido</label>
                                <input type="text" className="form-control" id="emissor" name="emissor" placeholder="Emissor: " defaultValue={pedido?.id} readOnly/>
                            </div>
                        </div>
                        <div className='col-lg-2'>
                            <div className="form-group">
                                <label htmlFor="nome">Data de Abertura</label>
                                <input type="text" className="form-control" id="emissor" name="emissor" placeholder="Emissor: " defaultValue={dataPedido} readOnly/>
                            </div>
                        </div>
                        <div className='col-lg-12'>
                            <div className='form-group'>
                                <label htmlFor='observacoes'>Observações</label>
                                <textarea rows="4" className='form-control' value={pedido && pedido.observacoes? pedido.observacoes : 'Nenhuma Observação foi inserida'} readOnly></textarea>
                            </div>
                        </div>
                        { user.admin &&
                        <div className='col-lg-12  mb-4'>
                            <button type="button" className='btn btn-inverse-warning' onClick={e => {
                                Session.setParam(pedido.idUsuario)
                                navigate("/colaborador")
                            }}>Ver Vínculos do Colaborador</button>
                        </div>
                        }
                    </div>
                    <div className='row'>
                        <div className="col-lg-12">
                            <div className='table-responsive'>
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Tamanho</th>
                                            <th>Quantidade</th>
                                            { user.admin && <th>Estoque</th>}
                                            { user.admin && <th>Estoque Usado</th>}
                                            <th>Status do Item</th>
                                            { user.admin && <th colSpan={2}>Liberar para o Colaborador</th>}
                                            { user.admin && <th>Enviar para Compras</th>}
                                            { user.admin && <th>Reprovar Item</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tabela}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='row mt-5'>
                        <div className='col-lg-12'>
                            <Link to="/listaPedidoVestimentas" className="btn btn-inverse-secondary mr-3">Voltar</Link>
                            {user.admin && <button type="button" className="btn btn-inverse-primary" disabled={disabledSalvar} onClick={e => salvaPedido()}>Salvar</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetalhesVestimentas