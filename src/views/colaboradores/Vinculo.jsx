import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Api from '../../components/Api';
import Swal from 'sweetalert2';
import Session from '../../components/Session';

const Vinculo = _ => {

    //Usuário Logado
    const user = Session.getSession();

    //Formulário do formulário
    const {register, handleSubmit, reset, formState: {errors}} = useForm()
    const [produtoId, setProdutoId] = useState(0);
    const [produtoNome, setProdutoNome] = useState("");
    const [quantidade, setQuantidade] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);

    //Controle de Estado
    const [listaItens, setListaItens] = useState([]);
    const [tabela, setTabela] = useState();

    //Controle de Desativado
    const [disabledProdutos, setDisabledProdutos] = useState(1);
    const [showList, setShowList] = useState(0);
    
    //Parametro
    const { id } = useParams(0);

    const loadProdutos = async (e) => {
        var idCategoria = e.target.value;
        const res = await Api.queryGet(`/controllerProdutos/categoria/${idCategoria}`);
        if(res.result){
            setProdutos(res.lista);
            setDisabledProdutos(0);
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
            var item = {
                id: produtoId,
                nome: produtoNome,
                quantidade: quantidade
            }

            listaItens.push(item)
            setListaItens(listaItens)
            if(showList === 0)
                setShowList(1);
    
            montaTabela();
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

    const salvaVinculo = (dataRaw) => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()

                var data = {
                    usuario: dataRaw.id,
                    usuarioLogado: dataRaw.idUsuarioLogado,
                    produto: listaItens
                }

                let res = await Api.queryPost(`/controllerEpiVinculo/`, data);
                
                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        Navigate(`/colaborador/${id}`);
                        reset(res);
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
            const res = await Api.queryGet(`/controllerCategoria`);
            if(res.result){
                setCategorias(res.lista)
            }
        }

        loadCategorias();
    }, [])

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Inserir novo Vinculo</h4>
                    <form noValidate className="forms-sample" id="salvaVinculo" onSubmit={handleSubmit(salvaVinculo)}>
                        <div className='row'>
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
                                    {errors.categoria?.type === "required" && <small className="text-danger">{ errors.categoria.message }</small> }
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="form-group">
                                    <label htmlFor="produto">Produto</label>
                                    <select className="form-control" id="produto" onChange={e => handleProduto(e)} disabled={disabledProdutos}>
                                        <option value={0}>Selecione</option>
                                        {  
                                            produtos.length > 0 &&
                                            produtos.map((item) => {
                                                return (
                                                    <option key={"produto"+item.id} value={item.id}>{item.nome}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    {errors.produto?.type === "required" && <small className="text-danger">{ errors.produto.message }</small> }
                                </div>
                            </div>
                            <div className='col-lg-2'>
                                <div className='form-group'>
                                    <label htmlFor='quantidade'>Quantidade</label>
                                    <input type="number" className="form-control" id="quantidade" onChange={e => setQuantidade(e.target.value)} placeholder="Ex: 1"/>
                                    {errors.quantidade?.type === "required" && <small className="text-danger">{ errors.quantidade.message }</small> }
                                </div>
                            </div>
                            <div className='col-lg-12 mb-3'>
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
                            <input type="hidden" value={id?id:0} {...register('id')}/>
                            <input type="hidden" value={user?.id} {...register('idUsuarioLogado')} />
                        </div>
                        <button type="submit" className="btn btn-inverse-primary mr-2" disabled={!showList}>Salvar</button>
                        <Link to={`/colaborador/${id}`} className="btn btn-inverse-secondary">Voltar</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Vinculo;