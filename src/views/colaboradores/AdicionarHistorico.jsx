import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-date-picker';
import Swal from "sweetalert2";
import Api from "../../components/Api";
import Session from "../../components/Session";
import Helpers from "../../components/Helpers";



const AdicionarHistorico = _ => {

    //Variavel
    const id = Session.getParam();

    //Form
    const {register, handleSubmit, reset, formState: {errors}} = useForm();

    const [selectVestimenta, setSelectVestimenta] = useState(null);
    const [selectTamanho, setSelectTamanho] = useState(null);

    const [vestimenta, setVestimenta] = useState("")
    const [listaVestimenta, setListaVestimenta] = useState([])
    const [tamanho, setTamanho] = useState("");
    const [data, setData] = useState(new Date());
    const [usado, setUsado] = useState('N');
    const [quantidade, setQuantidade] = useState(0);

    //Navegação
    const navigate = useNavigate();

    const montaSelect = (lista) => {
        setSelectVestimenta(lista.map((item, i) => {
            return(<option key={`selectVestimenta${i}`} value={item.idVestimenta}>{item.nome}</option>)
        }))
    }

    const montaTamanho = (id) => {
        listaVestimenta.map((item, i) => {
            if(item.idVestimenta.toString() === id.toString())
            {
                setSelectTamanho(item.tamanho.map((value, j) => {
                    return(<option key={`selectTamanho${j}`} value={value.tamanho}>{value.tamanho}</option>)
                }))
            }
        })
    }

    const salvaHistorico = (form) => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let post = {
                    idUsuario: id,
                    idVestimenta: vestimenta,
                    tamanho: tamanho,
                    usado: usado,
                    dataVinculo: Helpers.formataDataUs(data)+"T12:00:00",
                    quantidade: quantidade
                };

                let res = await Api.queryPost(`/controllerVestVinculo/`, post);

                if(res.result === false)
                {
                    Swal.fire("OPS!", res.message, "error");
                }
                else
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        navigate("/Conrcolaborador");
                    });    
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    useEffect(() => {
        const loadVestimentas = async() => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/controllerVestimenta/`);
                  if(res.result) {
                    setListaVestimenta(res.lista);
                    montaSelect(res.lista);
                    Swal.close();
                  } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                  }   
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }

        loadVestimentas();
    }, [])

    return(
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Cadastro de Histórico de Vestimenta</h4>
                    <form noValidate className="forms-sample" id="salvaProduto" onSubmit={handleSubmit(salvaHistorico)}>
                        <div className='row'>
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label htmlFor="tamanho">Vestimenta</label>
                                    <select className="form-control" defaultValue={0} id="vestimenta" onChange={e => {
                                        setVestimenta(e.target.value)
                                        montaTamanho(e.target.value)
                                    }}>
                                        <option value="0" disabled>Selecione uma vestimenta</option>
                                        {selectVestimenta}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label htmlFor="tamanho">Tamanho</label>
                                    <select className="form-control" defaultValue={0} id="tamanho" onChange={e => {
                                        setTamanho(e.target.value)
                                    }}>
                                        <option value="0" disabled>Selecione um tamanho</option>
                                        {selectTamanho}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label htmlFor="data">Data de Recebimento da Vestimenta</label>
                                    <DatePicker calendarIcon={null} clearIcon={null} className={'form-control'} onChange={setData} value={data}/>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label htmlFor="data">Quantidade</label>
                                    <input type="number" className="form-control" maxLength={3} id="quantidade" onChange={e => {
                                        setQuantidade(e.target.value);
                                    }} />
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="form-group">
                                    <label htmlFor="usado">Usado</label>
                                    <div className="row">
                                        <div className="col-lg-1">
                                            <div className="form-check form-check-primary">
                                                <label className="form-check-label">
                                                    <input type="radio" name="tamanho" value={'Y'} className="form-check-input" onClick={e => setUsado('Y')}/>
                                                        Sim
                                                    <i className="input-helper"></i>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-1">
                                            <div className="form-check form-check-primary">
                                                <label className="form-check-label">
                                                    <input type="radio" name="tamanho" value={'N'} defaultChecked={true} className="form-check-input" onClick={e => setUsado('N')}/>
                                                        Não
                                                    <i className="input-helper"></i>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-inverse-primary mr-2">Salvar</button>
                        <Link to="/colaborador" className="btn btn-inverse-secondary">Voltar</Link>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default AdicionarHistorico;