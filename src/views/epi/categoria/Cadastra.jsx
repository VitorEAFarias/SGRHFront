import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Swal from "sweetalert2";
import Api from "../../../components/Api";
import Session from "../../../components/Session";

const Cadastra = _ => {

    const {register, handleSubmit, reset, formState: {errors}} = useForm();
    const [categoria, setCategoria] = useState(null);
    const id = Session.getParam();
    const navigate = useNavigate();

    const salvaCategoria = (data) => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let res;
                if(typeof id === "undefined")
                    res = await Api.queryPost('/ControllerCategorias', data);
                else
                    res = await Api.queryPut('/ControllerCategorias', data);
                
                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        navigate("/listaCategorias");
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
        const loadCategoria = async () => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/controllercategorias/${id}`);        
                  if(res.result) {
                    setCategoria(res);
                    reset(res.categoria);
                    Swal.close();            
                  } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                  }   
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }

        if(id > 0)
            loadCategoria()
    }, [id, reset, register])    

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>{id != "" ? "Edita" : "Cadastra"} Categoria</h4>
                    <form noValidate className="forms-sample" id="salvaCategoria" onSubmit={handleSubmit(salvaCategoria)}>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className="form-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input type="text" className="form-control" id="nome" name="nome" placeholder="Nome: " {...register('nome', { required: 'Informe o Nome da Categoria'})} />
                                    {errors.nome?.type === "required" && <small className="text-danger">{ errors.nome.message }</small> }
                                </div>
                            </div>
                            <input type="hidden" value={id?id:0} {...register('id')}/>
                        </div>
                        <button type="submit" className="btn btn-inverse-primary mr-2">Salvar</button>
                        <Link to="/listaCategorias" className="btn btn-inverse-secondary">Voltar</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Cadastra