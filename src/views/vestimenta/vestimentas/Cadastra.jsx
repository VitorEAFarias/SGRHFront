import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'
import CurrencyFormat from 'react-currency-format';
    
import Api from '../../../components/Api'
import Session from "../../../components/Session";

function corrigiPreco(preco) {
    if(preco.toString().includes(".") || preco.toString().includes(","))
    {
        return preco.toString().replace(".", ",")
    }
    else
    {
        return preco+",00";
    }
}

const Cadastra = _ => {

    //Form
    const {register, handleSubmit, reset, formState: {errors}} = useForm();

    //Dados para editar vestimenta
    const [vestimenta, setVestimenta] = useState(null);

    //Campos do formulário
    const [valor, setValor] = useState("0.00");
    const [img, setImg] = useState();
    const [imgEdita, setImgEdita] = useState();
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [tipoTamanho] = useState(["1", "2", "3", "4", "5", "6", "7", "8", "PP", "P", "M", "G", "GG", "XG", "38", "40", "42", "44", "46", "48", "50", "52", "54", "56", "58", "60"]);
    const [tamanho, setTamanho] = useState({"1": false, "2": false, "3": false, "4": false, "5": false, "6": false, "7": false, "8": false, "PP": false, "P": false, "M": false, "G": false, "GG": false, "XG": false, "38": false, "40": false, "42": false, "44": false, "46": false, "48": false, "50": false, "52": false, "54": false, "56": false, "58": false, "60": false});
    const [inputTamanho, setInputTamanho] = useState();

    //Identificador da Vestimentas
    const id = Session.getParam();

    //Navegação
    const navigate = useNavigate();

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

    const salvaVestimenta = (data) => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let verif = 1;
                const formData = new FormData();
                formData.append('maximo', data.maximo)
                formData.append('id', data.id);
                formData.append('ativo', data.ativo)
                if(data.id > 0)
                {
                    formData.append('dataCadastro', dateNow());
                }
                formData.append('nome', data.nomeVestimenta);
                formData.append('preco', corrigiPreco(valor));

                if(img !== undefined)
                {
                    if(img.split(",")[1] !== undefined)
                        formData.append('foto', img.split(",")[1]);
                    else
                        formData.append('foto', img);
                }
                else
                {
                    if(vestimenta)
                    {
                        formData.append('foto', vestimenta.vestimenta.foto);
                    }
                    else
                    {
                        Swal.fire("OPS!", "Nenhuma foto foi inserida", "error");
                        verif = 0;
                    }
                }
                    
                if(verif === 1)
                {
                    let cont = 0;
                    for(let i=0; i<tipoTamanho.length; i++) {
                        if(tamanho[tipoTamanho[i]] === true)
                        {
                            formData.append('tamanho['+cont+'].tamanho', tipoTamanho[i]);
                            cont++;
                        }
                    }
    
                    let res;
                    if(id === "")
                        res = await Api.queryPostForm(`/controllervestimenta/`, formData);
                    else
                        res = await Api.queryPutForm(`/controllervestimenta/${id}`, formData);
    
                    if(res.result === false)
                    {
                        Swal.fire("OPS!", res.message, "error");
                    }
                    else
                    {
                        Swal.fire("Sucesso!", res.message, "success").then(() => {
                            navigate("/listaVestimentas");
                        });
                        
                    }
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    function changeUpload(e) {
        setFileName(e.target.value.replace(/C:\\fakepath\\/i, ''))
        setFile(e.target.files[0]);
    }

    function clickUpload (e) {
        let f = e.target.offsetParent.parentElement.childNodes[1];
        f.click();
    }

    useEffect(() => {
        let fileReader;
        if (file) {  
            fileReader = new FileReader();
          
            fileReader.onload = async (e) => {
                const { result } = e.target;
                if (result) {
                    setImg(result)
                }
                
            }
            fileReader.readAsDataURL(file);
        }

        const montaInput = async () => {
            setInputTamanho(tipoTamanho.map((item, i) => {
                return (
                    <div className="col-lg-1" key={"inputTamanho"+i}>
                        <div className="form-check form-check-primary">
                            <label className="form-check-label">
                                <input type="checkbox" name="tamanho" value={item} defaultChecked={tamanho[item]} className="form-check-input" onClick={e => checkTamanho(item)} {...register('tamanho')}/>
                                    {item}
                                <i className="input-helper"></i>
                            </label>
                        </div>
                    </div>
                )
            }))
        }

        const checkTamanho = async(e) => {
            let arrayTamanho = tamanho;
            if(arrayTamanho[e] === true)
            {
                arrayTamanho[e] = false;
            }
            else
            {
                arrayTamanho[e] = true;
            }
            
            setTamanho(arrayTamanho)
        }

        const loadProduto = async () => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/controllervestimenta/${id}`);
                  if(res.result) {
                    setVestimenta(res);
                    setValor(res.vestimenta.preco);
                    setImgEdita(res.vestimenta.foto);

                    let tamanhoArray = tamanho;
                    for(let i=0; i<res.vestimenta.tamanho.length; i++) {
                        tamanhoArray[res.vestimenta.tamanho[i].tamanho] = true;
                    }
                    setTamanho(tamanhoArray);

                    montaInput();

                    reset(res.vestimenta);
                    Swal.close();
                  } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                  }   
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }

        if(id > 0) {
            loadProduto()
        }
        else
        {
            montaInput();
        }

    }, [id, reset, file, tamanho, tipoTamanho, register]);

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>{id !== "" ? "Edita" : "Cadastra"} Vestimenta</h4>
                    <form noValidate className="forms-sample" id="salvaProduto" onSubmit={handleSubmit(salvaVestimenta)}>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="form-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input type="text" className="form-control" id="nome" name="nome" placeholder="Nome: " defaultValue={vestimenta?.vestimenta.nome} {...register('nomeVestimenta', { required: 'Informe o Nome da Vestimenta',})} />
                                    {errors.nome?.type === "required" && <small className="text-danger">{ errors.nome.message }</small> }
                                </div>
                            </div>
                            <div className='col-lg-3'>
                                <div className="form-group">
                                    <label htmlFor="valor">Preço</label>
                                    <CurrencyFormat className="form-control" value={valor} onValueChange={(values) => {
                                        let val = parseFloat(values.value);
                                        setValor(val.toFixed(2))
                                    }} {...register('valor')}/>
                                    {errors.valor?.type === "required" && <small className="text-danger">{ errors.valor.message }</small> }
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="form-group">
                                    <label>Adicionar Imagem</label>
                                    <input type="file" name="img" className="file-upload-default" onChange={e => changeUpload(e)}/>
                                    <div className="input-group col-xs-12">
                                        <input type="text" className="form-control file-upload-info" value={fileName} disabled placeholder="Escolha a Imagem" />
                                        <span className="input-group-append">
                                        <button className="file-upload-browse btn btn-primary" type="button" onClick={ e => clickUpload(e)}>Carregar</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="form-group">
                                    <label htmlFor="valor">Maximo por Pedido</label>
                                    <input type="text" className="form-control" id="maximo" name="maximo" placeholder="Maximo por Pedido: " defaultValue={vestimenta?.vestimenta.maximo} {...register('maximo', {required: 'Informe o Maximo por Pedido'})}/>
                                    {errors.nome?.type === "required" && <small className="text-danger">{ errors.nome.message }</small> }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-8'>
                                <div className="form-group">
                                    <label htmlFor="quantidade">Tamanho</label>
                                    <div className="row">
                                        {inputTamanho}
                                    </div>
                                    {/* <input type="number" className="form-control" id="quantidade" placeholder="Ex: 1" defaultValue={produto?.produto.quantidade} {...register('quantidade', { required: 'Informe a Quantidade em Estoque',})}/> */}
                                </div>
                            </div>
                            <div className="col-lg-4 text-center">
                                <img src={"data:image/jpeg;base64,"+imgEdita} alt="" style={{maxWidth: "180px"}}/>
                            </div>
                            <input type="hidden" value={id?id:0} {...register('id')}/>
                            <input type="hidden" value={vestimenta?vestimenta.vestimenta.ativo:1} {...register('ativo')}/>
                        </div>
                        <button type="submit" className="btn btn-inverse-primary mr-2">Salvar</button>
                        <Link to="/listaVestimentas" className="btn btn-inverse-secondary">Voltar</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Cadastra;