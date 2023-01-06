import React, { useState } from 'react';
import { useEffect } from 'react';
import Api from '../../../components/Api';
import Swal from 'sweetalert2';
import Session from '../../../components/Session';
import { Link, Navigate } from 'react-router-dom';

const Solicita = _ => {
    //Usuário logado
    const user = Session.getSession();

    // Selects da pagina
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [motivos, setMotivos] = useState([]);

    const [tabela, setTabela] = useState();

    const [disabledProdutos, setDisabledProdutos] = useState(1);
    const [showList, setShowList] = useState(0);

    //Dados que será enviados.
    const [produtoId, setProdutoId] = useState(0);
    const [produtoNome, setProdutoNome] = useState("");
    const [quantidade, setQuantidade] = useState(0);
    const [motivo, setMotivo] = useState(0);
    const [descricao, setDescricao] = useState("");
    const [listaItens, setListaItens] = useState([]);

    const loadProdutos = async (e) => {
        var idCategoria = e.target.value;
        const res = await Api.queryGet(`/produtos/categoria/${idCategoria}`);
        if(res.result){
            
            if(res.lista.length > 0)
            {
                setProdutos(res.lista);
                setDisabledProdutos(0);
            }
            else
            {
                var item = [{id: 1, nome: "Nenhum item encontrado para essa categoria"}];
                setProdutos(item)
                setDisabledProdutos(1);
            }
        }
        else{
            setDisabledProdutos(1);
        }
    }

    const handleProduto = async (e) => {
        setProdutoId(e.target.value)
        setProdutoNome(e.target.selectedOptions[0].innerText)
    }

    const handleRemoveItem = (index) => {
        listaItens.splice(index, 1);
        setListaItens(listaItens);

        if(listaItens.length <= 0)
            setShowList(0);

        montaTabela();
    }

    const adicionaItem = _ => {

        let found = listaItens.find(element => element.nome === produtoNome);
        
        if(found) {
            Swal.fire("OPS!", "Este produto já foi selecionado", "error");
        }
        else 
        {
            if(quantidade > 0)
            {
                var item = {
                    id: produtoId,
                    nome: produtoNome,
                    quantidade: quantidade,
                    entregue: false
                }
                listaItens.push(item)
                setListaItens(listaItens)
                if(showList === 0)
                    setShowList(1);
        
                montaTabela();
            }
            else
            {
                Swal.fire("OPS!", "O campo 'Quantidade' deve ser preenchido", "error");
            }
        }
    }

    function montaTabela() {
        
        setTabela(listaItens.map((item, i) => {
            return (
                <tr key={`listaItens${item.id}`}>
                    <td className='text-center'>{item.nome}</td>
                    <td className='text-center'>{item.quantidade}</td>
                    <td className='text-center'><button type="button" className='btn btn-inverse-danger' onClick={e => handleRemoveItem(i)}>Remove Item</button></td>
                </tr>
            )
        }))
    }

    const salvaSolicitacao = _ => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let date = new Date();
                let date_formated = date.getFullYear() + "-" +
                    ((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1)) + "-" +
                    (date.getDate() < 10 ? "0"+date.getDate() : date.getDate()) + " " +
                    (date.getHours() > 9 ? date.getHours() : "0"+date.getHours()) + ":" +
                    (date.getMinutes() > 9 ? date.getMinutes() : "0"+date.getMinutes()) + ":" +
                    (date.getSeconds() > 9 ? date.getSeconds() : "0"+date.getSeconds());

                var data = {
                    data: date_formated,
                    idUsuario: user.id,
                    descricao: descricao,
                    motivo: motivo,
                    produtos: listaItens,
                    idStatus: 1
                }
                let res = await Api.queryPost(`/Pedidos/`, data);
                
                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        Navigate("/listaSolicitacoes/")
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

    useEffect(() => {
        const loadCategorias = async() => {
            const res = await Api.queryGet(`/categoria`);
            if(res.result){
                setCategorias(res.lista)
            }
        }

        const loadMotivos = async (e) => {
            const res = await Api.queryGet(`/motivos`);
            if(res.result){
                setMotivos(res.lista);
            }
        }

        loadCategorias();
        loadMotivos();
    }, []);

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Inserir novo Vinculo</h4>
                    <form noValidate className="forms-sample" id="salvaCategoria">
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className="form-group">
                                    <label htmlFor='nome'>Solicitante</label>
                                    <input type="text" className="form-control" id="nome" name="nome" defaultValue={user?.nome} readOnly/>
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="categoria">Categoria</label>
                                    <select className="form-control" id="categoria" onChange={loadProdutos}>
                                        {  
                                            categorias.length > 0 &&
                                            categorias.map((item) => {
                                                return (
                                                    <option key={"categoria"+item.id} value={item.id}>{item.nome}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='col-lg-8'>
                                <div className="form-group">
                                    <label htmlFor="categoria">Produto</label>
                                        <select className="form-control" id="produto" onChange={e => handleProduto(e)} disabled={disabledProdutos}>
                                        <option value={0}>Selecione</option>
                                        {  
                                            produtos.length > 0 &&
                                            produtos.map((item) => {
                                                return (
                                                    <option key={"produtos"+item.id} value={item.id}>{item.nome}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor='quantidade'>Quantidade</label>
                                    <input type="number" className="form-control" onChange={e => setQuantidade(e.target.value)} id="quantidade" name="quantidade"/>
                                </div>
                            </div>
                            <div className='col-lg-2'>
                                <button type="button" className="btn btn-inverse-primary mr-2" onClick={e => adicionaItem()}>Adicionar a lista</button>
                            </div>
                            <div className={`mb-3 col-lg-12 ${!showList?'d-none':''}`}>
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Quantidade</th>
                                            <th>Remover</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tabela}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-3'>
                                <div className="form-group">
                                    <label htmlFor="motivo">Motivo</label>
                                    <select className="form-control" id="motivo" onChange={e => setMotivo(e.target.value)}>
                                        {  
                                            motivos.length > 0 &&
                                            motivos.map((item) => {
                                                return (
                                                    <option key={"motivo"+item.id} value={item.id}>{item.nome}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='col-lg-9'>
                                <div className='form-group'>
                                    <label htmlFor='descricao'>Descrição</label>
                                    <textarea className='form-control' id="descricao" name='descricao' rows="4" onChange={e => setDescricao(e.target.value)}></textarea>
                                </div>
                            </div>
                            <input type="hidden" value={user?.id}/>
                        </div>
                        <div className="row">
                            <div className='col-lg-6'>
                                <Link to={`/listaSolicitacoes/`} className="btn btn-inverse-secondary">Voltar</Link>
                            </div>
                            <div className='col-lg-6 text-right'>
                                <button type="button" className="btn btn-inverse-primary text-right" onClick={salvaSolicitacao}>Salvar</button>  
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Solicita