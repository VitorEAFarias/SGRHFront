import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Swal from "sweetalert2";
import Api from "../../../components/Api";
import Session from "../../../components/Session";
import DatePicker from 'react-date-picker';
import Helpers from "../../../components/Helpers";

const Cadastra = _ => {

    const {register, handleSubmit, reset, formState: {errors}} = useForm();
    const [certificado, setCertificado] = useState(null);
    const [validade, setValidade] = useState(new Date());
    const id = Session.getParam();
    const navigate = useNavigate();

    const salvaCertificado = (data) => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let res; 
                data.validade =  Helpers.formataDataUs(validade)+"T12:00:00";
                
                if(data.id === '0')
                    res = await Api.queryPost('/ControllerCertificadoAprovacao', data);
                else
                    res = await Api.queryPut('/ControllerCertificadoAprovacao', data);
                
                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        navigate("/listaCertificado");
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
        const loadCertificado = async () => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/ControllerCertificadoAprovacao/${id}`);    
                  if(res.result) {
                    setValidade(res.data.validade)
                    setCertificado(res.data);
                    reset(res.certificado);
                    Swal.close();            
                  } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                  }   
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }

        if(id > 0)        
            loadCertificado()
    }, [id, reset, register])    

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>{id != "" ? "Edita" : "Cadastra"} Certificado de Aprovação</h4>
                    <form noValidate className="forms-sample" id="salvaCertificado" onSubmit={handleSubmit(salvaCertificado)}>
                        <div className='row'>
                            <div className='col-lg-5'>
                                <div className="form-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input type="text" className="form-control" defaultValue={certificado?.numero} id="numero" name="numero" placeholder="Numero: " {...register('numero', { required: 'Informe o Numero do Certificado'})} />
                                    {errors.numero?.type === "required" && <small className="text-danger">{ errors.numero.message }</small> }
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="form-group">
                                    <label htmlFor="validade">Data de Validade do CA</label>
                                    <DatePicker calendarIcon={null} clearIcon={null} className={'form-control'}  onChange={setValidade} value={validade}/>
                                </div>
                            </div>
                            <input type="hidden" value={id?id:0} {...register('id')}/>
                        </div>
                        <button type="submit" className="btn btn-inverse-primary mr-2">Salvar</button>
                        <Link to="/listaCertificado" className="btn btn-inverse-secondary">Voltar</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Cadastra