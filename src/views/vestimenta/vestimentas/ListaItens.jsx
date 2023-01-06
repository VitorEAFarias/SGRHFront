import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Api from '../../../components/Api'
import { VestimentaContext } from "../../../context/VestimentaContext";

const ListaItens = _ => {

    //Variavel de Controle
    const [lista, setLista] = useState();

    //Campos do Formulário
    const [idItem, setIdItem] = useState([])
    const [nomeItem, setNomeItem] = useState([])
    const [imagemItem, setImagemItem] = useState([])
    const [quantidade, setQuantidade] = useState([]);
    const [tamanho, setTamanho] = useState([]);
    const [maximo, setMaximo] = useState([]);

    //Carrinho
    const {setGlobalData} = useContext(VestimentaContext);

    const insereLista = (cont) => {

        let item = {
            id: idItem[cont],
            nome: nomeItem[cont],
            img: imagemItem[cont],
            quantidade: quantidade[cont],
            tamanho: tamanho[cont]
        }

        if(tamanho[cont] !== "")
        {
            if(quantidade[cont] !== "" && quantidade[cont] !== 0)
            {
                let listaVestimenta = [];
                let listaRaw = localStorage.getItem('listaVestimentas');
                listaVestimenta = JSON.parse(listaRaw);
        
                let verifMaximo = 1;

                if(listaVestimenta !== null) {

                    let verif = 0;
                    for(let i=0; i<listaVestimenta.length; i++) {
                        if(listaVestimenta[i].id === idItem[cont] && listaVestimenta[i].tamanho === tamanho[cont])
                        {
                            if(parseInt(listaVestimenta[i].quantidade) + parseInt(quantidade[cont]) <= maximo[cont])
                                listaVestimenta[i].quantidade = parseInt(listaVestimenta[i].quantidade) + parseInt(quantidade[cont]);
                            else
                                verifMaximo = 0;

                            verif = 1;
                        }
                    }

                    if(verif === 0)
                        listaVestimenta.push(item);
                }
                else
                {
                    listaVestimenta = [];
                    listaVestimenta.push(item);
                }

                if(verifMaximo === 1)
                {
                    localStorage.setItem('listaVestimentas', JSON.stringify(listaVestimenta));
                }
                else
                    Swal.fire("OPS!", "Não foi possivel adicionar a quantidade pois irá ultrapassar o limite maximo de pedido do Item", "error");
        
                setGlobalData()
            }
            else
            {
                Swal.fire("OPS!", "Selecione a quantidade", "error");
            }
        }
        else
        {
            Swal.fire("OPS!", "Selecione o tamanho", "error");
        }
    }

    const montaListaTamanho = (listaTamanho) => {
        return (
            listaTamanho.map((item, i) => {
                return (
                    <option key={`tamanho${i}`}>{item.tamanho}</option>
                )
            })
        )
    }

    const montaListaQuantidade = (quantidadeTotal) => {
        let lista = [];
        for(let i=0; i<quantidadeTotal; i++) {
            lista.push(i+1)
        }

        return(lista.map((item, i) => {
            return (<option key={`selectedQuantidade${i}`} value={i+1}>{i+1}</option>)
        }))
    }

    const montaLista = (arrayVestimentas) => {
        setLista(arrayVestimentas.map((item, i) => {

            let quat = quantidade;
            quat.push(0);
            setQuantidade(quat);

            let tam = tamanho;
            tam.push("");
            setTamanho(tam)

            let idIte = idItem;
            idIte.push(item.idVestimenta)
            setIdItem(idIte);

            let nomeIte = nomeItem;
            nomeIte.push(item.nome);
            setNomeItem(nomeIte)

            let imagemIte = imagemItem;
            imagemIte.push(item.foto);
            setImagemItem(imagemIte);

            let maximoIte = maximo;
            maximoIte.push(item.maximo);
            setMaximo(maximoIte);

            if(item.ativo === 1)
            {
                return (
                    <div className="col-lg-4 stretch-card mb-4" key={i}>
                        <div className='card'>
                            <div className='card-body'>
                                <div className="col-lg-12 text-center" style={{border: '2px solid #364958', padding: '15px'}}>
                                    <img src={`data:image/jpeg;base64,${item.foto}`} alt="" className="text-center" style={{maxWidth: 200, minWidth: 200, maxHeight: 200, minHeight: 200}}/>
                                </div>
                                <div className="col-lg-12 mt-4">
                                    <h4 className="card-title">{item.nome}</h4>
                                    <div className="form-group">
                                        <label htmlFor="tamanho">Tamanho</label>
                                        <select className="form-control" defaultValue={0} id="fornecedor" onChange={e => {
                                            let tamanhoLista = tamanho
                                            tamanhoLista[i] = e.target.value
                                            setTamanho(tamanhoLista)
                                        }}>
                                            <option value="0" disabled>Selecione um tamanho</option>
                                            {montaListaTamanho(item.tamanho)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="tamanho">Quantidade</label>
                                        <select className="form-control" defaultValue={0} id="fornecedor" onChange={e => {
                                            let quantidadeLista = quantidade
                                            quantidadeLista[i] = e.target.value;
                                            setQuantidade(quantidadeLista);
                                        }}>
                                            <option value="0" disabled>Selecione a quantidade</option>
                                            {montaListaQuantidade(item.maximo)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-12 text-right">
                                    <button type="submit" className="btn btn-inverse-primary mr-2" value={i} onClick={e => insereLista(e.target.value)}>Adicionar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            else
                return null;
        }))
    }

    useEffect(() => {

        const loadVestimentas = async() => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/controllervestimenta/`);
                  if(res.result) {
                    montaLista(res.lista);
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

    return (
        <div className="row">
            <div className="col-lg-12">
                <h4 className='card-title'>Lista Itens de Vestimentas</h4>
            </div>
            {lista}
        </div>
    )
}

export default ListaItens;
