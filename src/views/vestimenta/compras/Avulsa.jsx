import React, { useState } from "react";
import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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

const Avulso = _ => {
    //Usuário logado
    const user = Session.getSession();

    //Campos do Formulário
    const [idItem, setIdItem] = useState();
    const [nomeItem, setNomeItem] = useState();
    const [tamanho, setTamanho] = useState();
    const [quantidade, setQuantidade] = useState();
    const [preco, setPreco] = useState()

    //Variaveis de Estado
    const [listaCompra, setListaCompra] = useState([]);
    const [listaItens, setListaItens] = useState([]);
    const [selectItens, setSelectItens] = useState();
    const [selectTamanho, setSelectTamanho] = useState();
    const [tabela, setTabela] = useState();
    const [blocoPrecoTotal, setBlocoPrecoTotal] = useState();

    //Controle de itens desativados
    const [disabledTabela, setDisabledTabela] = useState(true);
    const [disabledSalvar, setDisabledSalvar] = useState(true);

    //Variavel de Navegação
    const navigate = useNavigate();

    const montaSelect = (lista) => {
        setSelectItens(lista.map((item, i) => {
            return (
                <option value={i} key={`item${i}`}>{item.nome}</option>
            )
        }))
    }

    const montaTamanho = (id) => {

        setIdItem(listaItens[id].idVestimenta)
        setNomeItem(listaItens[id].nome);
        setPreco(listaItens[id].preco);

        setSelectTamanho(listaItens[id].tamanho.map((item, i) => {
            return (
                <option value={item.tamanho} key={`tamanho${i}`}>{item.tamanho}</option>
            )
        }))
    }

    const adicionarListaCompra = _ => {
        let listaC = listaCompra;

        let verif = 1;
        listaC.map((item, i) => {
            if(item.id === idItem && item.tamanho === tamanho)
            {
                verif = 0;
                item.quantidade = parseInt(item.quantidade) + parseInt(quantidade);
                item.precoTotal = item.quantidade * parseFloat(item.preco);
            }
        })

        if(verif === 1)
        {
            var item = {
                id: idItem,
                nome: nomeItem,
                tamanho: tamanho,
                quantidade: quantidade,
                preco: preco,
                precoTotal: parseFloat(preco) * quantidade
            }
    
            listaC.push(item);
        }

        setDisabledTabela(false);
        setDisabledSalvar(false);

        setListaCompra(listaC);
        montaTotal();
        montaTabela(listaC);
    }

    const montaTabela = (lista) => {
        setTabela(lista.map((item, i) => {
            return (
                <tr key={`linha${i}`}>
                    <td>{item.nome}</td>
                    <td>{item.tamanho}</td>
                    <td>{item.quantidade}</td>
                    <td>{item.preco}</td>
                    <td>{item.precoTotal}</td>
                    <td><button className="btn btn-inverse-danger" onClick={e => excluiItem(i)}>Excluir</button></td>
                </tr>
            )
        }))
    }

    const excluiItem = i => {

        listaCompra.splice(i, 1);
        setListaCompra(listaCompra);

        if(listaCompra.length <=0)
        {
            setDisabledTabela(true)
            setDisabledSalvar(true);
        }
            
        montaTotal();
        montaTabela(listaCompra)
    }

    const salvaCompra = () => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let lista = [];

                if (listaCompra.length > 0)
                {
                    for(let i=0; i<listaCompra.length; i++)
                    {
                        let value = {
                            idRepositorio: [0],
                            idItem: listaCompra[i].id,
                            tamanho: listaCompra[i].tamanho,
                            preco: listaCompra[i].preco,
                            quantidade: listaCompra[i].quantidade,
                        }
    
                        lista.push(value)
                    }
    
                    let post = {
                        id: 0,
                        dataCompra: dateNow(),
                        idUsuario: user.id,
                        status: 1,
                        itensRepositorio: lista,
                        descricao: ""
                    };
                    
                    let res = await Api.queryPost(`/controllerVestrepositorio/`, post);
                    if(res.result !== false)
                    {
                        Swal.fire("Sucesso!", res.message, "success").then(() => {
                            navigate('/listaComprasVestimentas');
                        });
                    }
                    else
                    {
                        Swal.fire("OPS!", res.message, "error");
                    }
                }
                else
                {
                    Swal.fire("OPS!", "Nenhum Item foi adicionado na lista de Compra", "error");
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const montaTotal = _ => {

        var valor = 0.00;

        listaCompra.map((item, i) => {
            valor += parseFloat(item.precoTotal)
        })

        setBlocoPrecoTotal(<p><span className="font-weight-bold">Preço Total: </span>R$ {valor}</p>)
    }

    const loadVestimentas = async() => {
        Swal.fire({
            backdrop: true,
            didOpen: async () => {
              Swal.showLoading();
              const res = await Api.queryGet(`/controllerVestimenta/`);
              if(res.result) {
                setListaItens(res.lista);
                montaSelect(res.lista);
                Swal.close();
              } else {
                Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
              }   
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    useEffect(() => {
        loadVestimentas();
    }, [])

    return (
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Formulário de Compra Avulsa</h4>
                    <div className='row'>
                        <div className='col-lg-12 col-md-12'>
                            <div className="form-group">
                                <label htmlFor='nome'>Solicitante</label>
                                <input type="text" className="form-control" id="nome" name="nome" defaultValue={user?.nome} readOnly/>
                            </div>
                        </div>
                        <div className='col-lg-6 col-xl-6'>
                            <div className="form-group">
                                <label htmlFor="item">Item</label>
                                <select className="form-control" defaultValue={-1} onChange={e => montaTamanho(e.target.value)}>
                                    <option value={-1} disabled>Selecione o item</option>
                                    {selectItens}
                                </select>
                            </div>
                        </div>
                        <div className='col-lg-3 col-xl-6'>
                            <div className="form-group">
                                <label htmlFor="item">Tamanho</label>
                                <select className="form-control" defaultValue={-1} onChange={e => setTamanho(e.target.value)}>
                                    <option value={-1} disabled>Selecione um tamanho</option>
                                    {selectTamanho}
                                </select>
                            </div>
                        </div>
                        <div className='col-lg-2 col-xl-6'>
                            <div className="form-group">
                                <label htmlFor="item">Quantidade</label>
                                <input type="number" className="form-control" id="quantidade" name="quantidade" onChange={e => setQuantidade(e.target.value)}/>
                            </div>
                        </div>
                        <div className="col-lg-1 col-xl-2">
                            <br/>
                            <button type="button" className="btn btn-inverse-primary" onClick={e => adicionarListaCompra()}>Adicionar</button>
                        </div>
                    </div>
                    <div className={`row ${disabledTabela?'d-none':''}`}>
                        <div className="col-lg-12">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Tamanho</th>
                                        <th>Quantidade</th>
                                        <th>Preço Unitario</th>
                                        <th>Preço Total</th>
                                        <th>Excluir</th>
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
                    <div className='row mt-5'>
                        <div className='col-lg-12'>
                            <Link to={`/listaComprasVestimentas`} className="btn btn-inverse-secondary mr-3">Voltar</Link>
                            <button type="button" className="btn btn-inverse-primary" disabled={disabledSalvar} onClick={e => salvaCompra()}>Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Avulso;