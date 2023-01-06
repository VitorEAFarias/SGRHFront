import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../../../components/Api";
import Session from "../../../components/Session";


const dateNow = _ => {
    let dataNow = new Date();
    let dia = (dataNow.getDate() <= 9 ? "0"+dataNow.getDate() : dataNow.getDate());
    let mes = (dataNow.getMonth() + 1) <= 9 ? "0"+(dataNow.getMonth()+1) : dataNow.getMonth()+1;
    let ano = dataNow.getFullYear()
    let hora = dataNow.getHours() <= 9 ? "0"+dataNow.getHours() : dataNow.getHours();
    let minuto = dataNow.getMinutes() <= 9 ? "0"+dataNow.getMinutes() : dataNow.getMinutes();
    let segundo = dataNow.getSeconds() <= 9 ? "0"+dataNow.getSeconds() : dataNow.getSeconds();

    return ano+"-"+mes+"-"+dia+"T"+hora+":"+minuto+":"+segundo;
}

const Itens = _ => {

    //Usuario Logado
    const user = Session.getSession();

    //Variavel de Controle
    const [lista, setLista] = useState([])
    const [tabela, setTabela] = useState();
    const [blocoPrecoTotal, setBlocoPrecoTotal] = useState();

    //Controle de Desativado
    const [enviaDisabled, setEnviaDisabled] = useState(true)

    const corrigiLista = async (listaNew) => {
        let list = lista;

        setLista(listaNew.map((item, i) => {
            if(list.length > 0) {
                let verif = false;
                for(let j=0; j<list.length; j++) {
                    if(list[j].idItem === item.idItem && list[j].tamanho === item.tamanho) {
                        list[j].idRepositorio.push(item.id);
                        list[j].quantidade = list[j].quantidade + item.quantidade;
                        list[j].precoTotal = parseFloat(list[j].precoTotal) + parseFloat(item.precoTotal)
                        verif = true;
                    }
                }

                if(verif === false)
                {
                    let value = {
                        idRepositorio: [item.id],
                        nome: item.nome,
                        idItem: item.idItem,
                        tamanho: item.tamanho,
                        preco: item.preco,
                        precoTotal: item.precoTotal,
                        quantidade: item.quantidade,
                        check: false
                    }
    
                    list.push(value)
                }
            }
            else
            {
                let value = {
                    idRepositorio: [item.id],
                    nome: item.nome,
                    idItem: item.idItem,
                    tamanho: item.tamanho,
                    preco: item.preco,
                    precoTotal: item.precoTotal,
                    quantidade: item.quantidade,
                    check: false
                }

                list.push(value)
            }

            return(list);
        }))
    }

    const montaTabela = async () => {
        if(lista.length > 0) {
            setTabela(lista.map((item, i) => {
                return (
                    <tr key={`tabela${i}`}>
                        <td>
                            <div className="form-check form-check-primary">
                                <label className="form-check-label">
                                    <input type="checkbox" name="compras" value={i} className="form-check-input" onClick={ e => montaLista(e.target.checked, i) }/>
                                    <i className="input-helper"></i>
                                </label>
                            </div>
                        </td>
                        <td>{item.nome}</td>
                        <td>{item.tamanho}</td>
                        <td>{item.quantidade}</td>
                        <td>{item.preco}</td>
                        <td>{item.precoTotal}</td>
                    </tr>
                )
            }))
        }
        else
        {
            setTabela(
                <tr key={`tabela0`}>
                    <td className="text-center" colSpan={6}>Nenhum Item encontrado</td>
                </tr>
            )
        }
    }

    const montaLista = (check, i) => {
        let list = lista;
        list[i].check = check;

        if(check === true)
        {
            setEnviaDisabled(false);
        }
        else
        {
            let verif = false;
            list.map((item, i) => {
                if(item.check)
                {
                    setEnviaDisabled(false);
                    verif = true;
                }
            })

            if(verif === false)
                setEnviaDisabled(true);
        }

        setLista(list);
        montaTotal();
    }

    const montaTotal = _ => {

        var valor = 0.00;

        lista.map((item, i) => {
            if(item.check)
                valor += parseFloat(item.precoTotal)
        })

        setBlocoPrecoTotal(<p><span className="font-weight-bold">Preço Total: </span>R$ {valor}</p>)
    }

    const enviaSolicitacao = async () => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let listaCompra = [];

                for(let i=0; i<lista.length; i++)
                {
                    if (lista[i].check) {
                        let value = {
                            idRepositorio: lista[i].idRepositorio,
                            idItem: lista[i].idItem,
                            tamanho: lista[i].tamanho,
                            preco: lista[i].preco,
                            quantidade: lista[i].quantidade,
                        }
    
                        listaCompra.push(value)
                    }
                }

                let post = {
                    id: 0,
                    dataCompra: dateNow(),
                    idUsuario: user.id,
                    status: 1,
                    itensRepositorio: listaCompra,
                    descricao: ""
                };
                
                // setTabela(null)
                // setBlocoPrecoTotal(null);
                // setEnviaDisabled(true)
                // loadListaItens();

                let res = await Api.queryPost(`/controllervestrepositorio/`, post);
                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        window.location.reload();
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

    const loadListaItens = async () => {
        Swal.fire({
            backdrop: true,
            didOpen: async () => {
              Swal.showLoading();
              const res = await Api.queryGet(`/controllervestrepositorio/repositorio/${'N'}`);
              if(res.result) {
                await corrigiLista(res.lista);
                montaTabela();
                Swal.close();
              } else {
                Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
              }   
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    useEffect(() => {
        loadListaItens()        
    }, [])

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Lista de Itens com necessidade de Compra</h4>
                    <div className="row mt-5">
                        <div className='col-lg-12'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nome</th>
                                        <th>Tamanho</th>
                                        <th>Quantidade</th>
                                        <th>Preço Unitario</th>
                                        <th>Preço Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabela}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-12 text-right">
                            {blocoPrecoTotal}
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-12">
                            <Link to="/listaComprasVestimentas" className="btn btn-inverse-secondary mr-3">Voltar</Link>
                            <button type="button" className="btn btn-inverse-primary" disabled={enviaDisabled} onClick={e => enviaSolicitacao()}>Solicitar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Itens;