import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Session from "../../../components/Session";
import CurrencyFormat from 'react-currency-format';
import Modal from 'react-modal';
import Api from '../../../components/Api'
import DatePicker from 'react-date-picker';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      width: '60%',
      maxHeight: '75%',
      overflow: 'auto',
      transform: 'translate(-50%, -50%)',
    },
};

const Cadastra = _ => {
       
    const {register, handleSubmit, reset, formState: {errors}} = useForm()
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaCertificados, setListaCertificados] = useState([]);
    const [afterModal, setAfterModal] = useState();
    const [validade, setValidade] = useState(new Date());
    const [preco, setValor] = useState("0.00");
    const [numero, setNumero] = useState([]);
    const [produto, setProduto] = useState(null);    
    const id = Session.getParam();
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = _ => {
        setModalIsOpen(true);
    }

    const closeModal = _ => {
        setModalIsOpen(false);
        afterModal(null);
    }

    const salvaCertificado = _ => {
        let data = {
            numero: numero,
            validade: validade
        }
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading();
                let res;  
                res = await Api.queryPost('/ControllerCertificadoAprovacao', data);
                
                if(res.result === false)
                {
                    Swal.fire("OPS!", res.message, "error");
                }
                else
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        closeModal();                        
                        navigate("/cadastraProduto");                        
                    });                    
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }    

    const afterOpenModal = async(_) => {
        setAfterModal(            
            <div className='card-body'>                
                <div className="row">        
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label htmlFor="ca">CA (Certificado de Aprovação)</label>
                            <input type="text" className="form-control" id="numero" name="numero" placeholder="Certificado de aprovação: " onChange={e => {setNumero(e.target.value)}}/>
                        </div>
                    </div>                    
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label htmlFor="validadeEmUso">Tempo de Validade</label>
                            <DatePicker calendarIcon={null} clearIcon={null} className={'form-control'} onChange={setValidade} value={validade}/>
                        </div>                           
                    </div>
                </div>
            </div>             
        )
    }   

    const salvaProduto = (data) => {        
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                data.preco = preco;
                let res;
                if(typeof id === "undefined" || data.id === "0")
                    res = await Api.queryPost('/ControllerProdutos/', data);
                else
                    res = await Api.queryPut('/ControllerProdutos/', data);

                if(res.result === false)
                {
                    Swal.fire("OPS!", res.message, "error");
                }
                else
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        navigate("/listaProduto");
                    });
                    
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const loadCertificado = async () => {
        const res = await Api.queryGet('/ControllerCertificadoAprovacao');
        if (res.result) {
            setListaCertificados(res.data);
        }
    }

    const loadCategoria = async () => {
        const res = await Api.queryGet('/ControllerCategorias');
        if(res.result) {
            setListaCategorias(res.lista);
        }
    }

    useEffect(() => {
        const loadProduto = async () => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/ControllerProdutos/${id}`);
                  if(res.result) {
                    setProduto(res.data);
                    reset(res);
                    Swal.close();
                  } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                  }   
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }

        loadCertificado();
        loadCategoria();
        
        if(id > 0)
        {
            loadProduto();
        }
            
    }, [id, reset, register]);
    
    return (
        <>
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Cadastra Produto</h4>
                    <form noValidate className="forms-sample" id="salvaProduto" onSubmit={handleSubmit(salvaProduto)}>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input type="text" className="form-control" id="nome" name="nome" placeholder="Nome: " defaultValue={produto?.nome} {...register('nome', { required: 'Informe o Nome do Produto',})} />
                                    {errors.nome?.type === "required" && <small className="text-danger">{ errors.nome.message }</small> }
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="categoria">Categoria</label>
                                    <select className="form-control" id="categoria" defaultValue={""} {...register('idCategoria', { required: 'Selecione a Categoria do Produto',})}>
                                        <option value="" disabled> Selecione uma Categoria</option>
                                        {  
                                            listaCategorias.length > 0 &&
                                            listaCategorias.map((item) => {
                                                return (
                                                    <option key={"idCategoria"+item.id} value={item.id} selected={produto && produto.idCategoria === item.id}>{item.nome}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    {errors.idCategoria?.type === "required" && <small className="text-danger">{ errors.idCategoria.message }</small> }
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className="form-group">
                                    <label htmlFor="preco">Preço</label>
                                    <CurrencyFormat className="form-control" value={preco} onValueChange={(values) => {
                                        let val = parseFloat(values.value);
                                        setValor(val.toFixed(2))
                                    }} {...register('preco')}/>
                                    {errors.preco?.type === "required" && <small className="text-danger">{ errors.preco.message }</small> }
                                </div>
                            </div>
                            <div className='col-lg-3'>
                                <div className="form-group">
                                    <label htmlFor="validadeEmUso">Validade do Produto em Uso</label>
                                    <input type="text" className="form-control" id="validadeEmUso" placeholder="Validade em Uso" defaultValue={produto?.validadeEmUso} {...register('validadeEmUso', { required: 'Informe a validade de uso do produto',})}/>
                                    {errors.validadeEmUso?.type === "required" && <small className="text-danger">{ errors.validadeEmUso.message }</small> }
                                </div>
                            </div> 
                            <div className='col-lg-5'>
                                <div className="form-group">
                                    <label htmlFor="ca">CA (Certificado de Aprovação)</label>
                                    <select className="form-control" id="idCertificadoAprovacao" defaultValue={""} {...register('idCertificadoAprovacao', { required: 'Selecione o CA do Produto',})}>
                                    <option value="" disabled> Selecione um Certificado</option>
                                    {
                                        listaCertificados.length > 0 &&
                                        listaCertificados.map((item) => {
                                            return (
                                                <option key={"idCertificadoAprovacao"+item.id} value={item.id} selected={produto && produto.idCertificadoAprovacao === item.id}>{item.numero}</option>
                                            )
                                        })
                                    }
                                    </select>
                                    {errors.idCertificadoAprovacao?.type === "required" && <small className="text-danger">{ errors.idCertificadoAprovacao.message }</small> }
                                </div>                                
                            </div>
                            <div className='col-lg-4' >
                                <div className="form-group" style={{textAlign:'center'}}>
                                    <br/>
                                    <button type="button" className="btn btn-inverse-primary" onClick={e => {
                                        openModal()
                                    }}>Cadastrar Novo Certificado</button>
                                </div>                                
                            </div>                 
                            <input type="hidden" value={id?id:0} {...register('id')}/>
                        </div>
                        <button type="submit" className="btn btn-inverse-primary mr-2">Salvar</button>
                        <Link to="/listaProduto" className="btn btn-inverse-secondary">Voltar</Link>
                    </form>
                </div>
            </div>            
        </div>
        <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} style={customStyles} contentLabel="Example">         
            <div className="row">
                <div className="col-lg-10">
                    Cadastrar Novo Certificado de Aprovação
                </div>
                <div className="col-lg-2 text-right">
                    <button onClick={closeModal} className="btn btn-inverse-danger btn-rounded btn-fw">X</button>
                </div>
            </div>
            {afterModal}
            <div className="row">
                <div className="col-lg-12">
                    <button type="button" className="btn btn-inverse-warning btn-rounded btn-fw" onClick={e => {salvaCertificado() 
                        Session.setParam("")                        
                        }}>Salvar</button>
                </div>
            </div>
        </Modal>
        </>               
    )
}

export default Cadastra