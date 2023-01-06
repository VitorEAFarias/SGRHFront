import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import Swal from "sweetalert2";
import Api from "../../../components/Api";
import Session from "../../../components/Session";
import InputMask from 'react-input-mask';

const Cadastro = _ => {
    
    const {register, handleSubmit, reset, control, formState: {errors}} = useForm()
    const [fornecedor, setFornecedor] = useState(null)
    const id = Session.getParam();
    const navigate = useNavigate();
    const [mask, setMask] = useState("(99) 99999-9999");

    const PhoneInput = ({ ...props }) => {                
        return (
            <InputMask
            {...props}
            mask={mask}
            onBlur={e => {
                if (e.target.value.replace("_", "").length === 14) {
                setMask("(99) 9999-9999");
                }
            }}
            onFocus={e => {
                if (e.target.value.replace("_", "").length === 14) {
                setMask("(99) 99999-9999");
                }
            }}
            >
            {inputProps => <input {...inputProps} type="tel" />}
            </InputMask>
        );
    };

    const salvaFornecedor = (data) => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let res;                
                if(typeof id === "undefined")
                    res = await Api.queryPost('/controllerfornecedor/', data);
                else
                    res = await Api.queryPut('/controllerfornecedor/', data);                
                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        navigate("/listaFornecedor");
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
        const loadFornecedor = async () => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/controllerfornecedor/${id}`);                  
                  if(res.result) {
                    setFornecedor(res);
                    reset(res.fornecedor);
                    Swal.close();            
                  } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                  }   
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }

        if(id > 0)
            loadFornecedor()
    }, [id, reset, register])
    
    Session.setParam("")

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>{id != "" ? "Edita" : "Cadastra"} Fornecedor</h4>
                    <form noValidate className="forms-sample" id="salvaFornecedor" onSubmit={handleSubmit(salvaFornecedor)}>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input type="text" className="form-control" id="nome" name="nome" placeholder="Nome " 
                                    defaultValue={fornecedor?.fornecedor.nome} {...register('nome', { required: 'Informe o Nome do Fornecedor',})} />                                    
                                </div>
                            </div>
                            <input type="hidden" value={id?id:0} {...register('id')}/>
                            <input type="hidden" value="S" id="ativo" name="ativo" {...register('ativo')}/>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="razaosocial">Razão Social</label>
                                    <input type="text" className="form-control" id="razaoSocial" name="razaoSocial" placeholder="Razão social " 
                                    defaultValue={fornecedor?.fornecedor.razaoSocial} {...register('razaoSocial', { required: 'Informe a razão social do Fornecedor',})} />                                    
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="cnpj">CNPJ</label>
                                    <input type="text" className="form-control" id="cnpj" name="cnpj" placeholder="CNPJ " 
                                    defaultValue={fornecedor?.fornecedor.cnpj} {...register('cnpj', { required: 'Informe o CNPJ do Fornecedor',})} />                                    
                                </div>
                            </div>
                        </div>
                        <div className='row'>   
                            <div className='col-lg-6'>
                                <div className="form-group">
                                    <label htmlFor="email">E-Mail</label>                                    
                                    <input type="text" className="form-control" id="contato1" name="contato1" placeholder="E-Mail " 
                                    defaultValue={fornecedor?.fornecedor.contato1} {...register('contato1')}/>                                    
                                </div>
                            </div>
                            <div className='col-lg-3'>
                                <div className="form-group">
                                    <label htmlFor="telefone">Telefone</label>
                                    <Controller
                                        render={({ field }) => {
                                            return (
                                            <PhoneInput                                            
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Telefone"
                                                className={`form-control`}
                                            />
                                            )}
                                        }
                                        control={control}
                                        name="contato2"
                                        rules={{
                                            required: "Informe o telefone do Fornecedor",
                                        }} />
                                </div>
                            </div>
                            <div className='col-lg-3'>
                                <div className="form-group">
                                    <label htmlFor="celular">Celular</label>
                                    <Controller
                                        render={({ field }) => {
                                            return (
                                            <PhoneInput                                            
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Telefone"
                                                className={`form-control`}
                                            />
                                            )}
                                        }
                                        control={control}
                                        name="contato3"
                                        rules={{
                                            required: "Informe o celular do Fornecedor",
                                        }} />
                                    </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-inverse-primary mr-2">Salvar</button>
                        <Link to="/listaFornecedor" className="btn btn-inverse-secondary">Voltar</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Cadastro