import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import Api from '../../../components/Api';

const Detalhes = _ => {
    const [solicitacao, setSolicitacao] = useState(null);
    const [tabela, setTabela] = useState();
    const [status, setStatus] = useState(-1);
    const [descricao, setDescricao] = useState("");
    const { id } = useParams(0)

    const salvaAlteracaoSolicitacao = _ => {
        var data = {status: status, descricao: descricao};
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let res = await Api.queryPost(`/produtos/${687}`, data);

                if(res.result === false)
                {
                    Swal.fire("OPS!", res.message, "error");
                }
                else
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        Navigate("/detalhesSolicitacoes/"+id);
                    });
                    
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    useEffect(() => {
        const loadSolicitacoes = async () => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/pedidos/${id}`);
                  if(res.result) {
                    setSolicitacao(res.pedido);
                    setTabela(res.pedido.produtos.map((item, i) => {
                        
                        let color = (item.quantidade > item.estoque) ? 'red' : 'green'

                        return (
                            <tr key={`listaItens${item.id}`}>
                                <td className='text-center'>{item.nome}</td>
                                <td className='text-center'>{item.quantidade}</td>
                                <td className='text-center' style={{color: color}}>{item.estoque}</td>
                            </tr>
                        )
                    }))
                    Swal.close();            
                  } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                  }   
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }

        loadSolicitacoes();
    }, [id])

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Detalhes da Solicitação</h4>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className="form-group">
                                <label htmlFor="nome">Emissor</label>
                                <input type="text" className="form-control" id="emissor" name="emissor" placeholder="Emissor: " defaultValue={solicitacao?.usuario} readOnly/>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div className="form-group">
                                <label htmlFor="nome">Motivo</label>
                                <input type="text" className="form-control" id="motivo" name="motivo" placeholder="Motivo: " defaultValue={solicitacao?.motivo} readOnly/>
                            </div>
                        </div>
                        <div className='col-lg-8'>
                            <div className="form-group">
                                <label htmlFor="nome">Descrição</label>
                                <textarea className='form-control' id="descricao" name='descricao' rows="4" defaultValue={solicitacao?.descricao} readOnly></textarea>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Quantidade</th>
                                        <th>Estoque</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabela}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-12">
                            <hr/>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-4'>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select className="form-control" id="status" defaultValue={-1} onChange={e => setStatus(e.target.value)}>
                                    <option value={-1} disabled>Selecione a opção</option>
                                    <option key={"status1"} value={1}>Aprovar</option>
                                    <option key={"status2"} value={2}>Aprovar e abrir pedido de compras</option>
                                    <option key={"status0"} value={0}>Reprovar</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-lg-8'>
                            <div className="form-group">
                                <label htmlFor="nome">Descrição</label>
                                <textarea className='form-control' id="descricao_status" name='descricao_status' rows="5" onChange={e => setDescricao(e.target.value)}></textarea>
                            </div>
                        </div>
                    </div>
                    <button type="button" className="btn btn-inverse-primary mr-3" onClick={salvaAlteracaoSolicitacao}>Salvar</button>
                    <Link to="/listaSolicitacoes" className="btn btn-inverse-secondary">Voltar</Link>
                </div>
            </div>
        </div>
    )
}

export default Detalhes;