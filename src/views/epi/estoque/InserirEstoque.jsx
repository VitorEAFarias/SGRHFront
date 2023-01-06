import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Swal from "sweetalert2";
import Api from "../../../components/Api";
import Session from "../../../components/Session";

const InserirEstoque = _ => {

    const {register, handleSubmit, reset, formState: {errors}} = useForm();
    const [produto, setProduto] = useState(null);
    const [listaProdutos, setListaProdutos] = useState([]);
    const [listaTamanhos, setListaTamanhos] = useState([]);
    const id = Session.getParam();
    const navigate = useNavigate();

    const loadProdutos = async () => {
        const res = await Api.queryGet('/ControllerProdutos');
        if (res.result) {
            setListaProdutos(res.data);
        }
    }

    const loadTamanhos = async () => {
        const res = await Api.queryGet('/ControllerTamanhos');
        if (res.result) {
            setListaTamanhos(res.data);
        }
    }

    const salvaEstoque = (data) => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let res;
                res = await Api.queryPost('/ControllerProdutosEstoque', data);
                
                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        navigate("/gerenciarEstoque");
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
        const loadProdutoEstoque = async () => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/ControllerProdutosEstoque/${id}`);
                  console.log(res)
                  if(res.result) {
                    setProduto(res.produto[0])
                    reset(res.produto[0]);
                    Swal.close();            
                  } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                  }   
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }

        loadProdutos();
        loadTamanhos();

        if(id > 0)       
            loadProdutoEstoque();
        
    }, [id, reset, register])    

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>{id !== "" ? "Edita" : "Cadastra"} Produto em estoque</h4>
                    <form noValidate className="forms-sample" id="salvaEstoque" onSubmit={handleSubmit(salvaEstoque)}>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="produto">Produto</label>
                                    <select className="form-control" id="estoque" defaultValue={""} {...register('idProduto', { required: 'Selecione o Produto',})}>
                                        <option value="" disabled> Selecione um produto</option>
                                        {  
                                            listaProdutos.length > 0 &&
                                            listaProdutos.map((item) => {
                                                return (
                                                    <option key={"idProduto"+item.id} value={item.id} selected={produto && produto.idProduto === item.id}>{item.nomeProduto}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    {errors.idProduto?.type === "required" && <small className="text-danger">{ errors.idProduto.message }</small> }
                                </div>
                            </div>
                            <div className='col-lg-5'>
                                <div className="form-group">
                                    <label htmlFor="quantidade">Quantidade</label>
                                    <input type="text" className="form-control" defaultValue={produto?.quantidade} id="quantidade" name="quantidade" placeholder="Quantidade: " {...register('quantidade', { required: 'Informe a quantidade'})} />
                                    {errors.quantidade?.type === "required" && <small className="text-danger">{ errors.quantidade.message }</small> }
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="produto">Tamanho</label>
                                    <select className="form-control" id="tamanho" defaultValue={""} {...register('idTamanho', { required: 'Selecione o tamanho do produto',})}>
                                        <option value="" disabled> Selecione um tamanho</option>
                                        {  
                                            listaTamanhos.length > 0 &&
                                            listaTamanhos.map((item) => {
                                                return (
                                                    <option key={"idTamanho"+item.id} value={item.id} selected={produto && produto.idTamanho === item.id}>{item.tamanho}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    {errors.idTamanho?.type === "required" && <small className="text-danger">{ errors.idTamanho.message }</small> }
                                </div>
                            </div>
                            <input type="hidden" value={id?id:0} {...register('id')}/>
                        </div>
                        <button type="submit" className="btn btn-inverse-primary mr-2">Salvar</button>
                        <Link to="/gerenciarEstoque" className="btn btn-inverse-secondary">Voltar</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default InserirEstoque;