import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Api from '../../../components/Api'
import { EPIContext } from "../../../context/EPIContext";

const SolicitarEPI = _ => {

    const [lista, setLista] = useState(false);
    const {setGlobalData} = useContext(EPIContext);

    const [quantidade, setQuantidade] = useState([]);
    const [tamanho, setTamanho] = useState([]);
    const [listaTamanhos, setListaTamanhos] = useState([])

    const loadTamanhos = async () => {
        const res = await Api.queryGet('/ControllerTamanhos');        
        if (res.result) {
            setListaTamanhos(res.data);            
        }
    }

    const insereLista = (cont) => {
        let item = {
            id: lista[cont].id,
            nome: lista[cont].nome,
            img: lista[cont].foto,
            quantidade: quantidade[cont],
            tamanho: tamanho[cont]
        }

        if(tamanho[cont] !== "")
        {
            if(quantidade[cont] !== "" && quantidade[cont] !== 0)
            {
                let listaProduto = [];
                let listaRaw = localStorage.getItem('listaProduto');
                listaProduto = JSON.parse(listaRaw);
        
                let verifMaximo = 1;

                if(listaProduto !== null) {

                    let verif = 0;
                    for(let i=0; i<listaProduto.length; i++) {
                        if(listaProduto[i].id === item.id && listaProduto[i].tamanho === tamanho[cont])
                        {
                            if(parseInt(listaProduto[i].quantidade) + parseInt(quantidade[cont]) <= lista[cont].maximo)
                                listaProduto[i].quantidade = parseInt(listaProduto[i].quantidade) + parseInt(quantidade[cont]);
                            else
                                verifMaximo = 0;

                            verif = 1;
                        }
                    }

                    if(verif === 0)
                        listaProduto.push(item);
                }
                else
                {
                    listaProduto = [];
                    listaProduto.push(item);
                }

                if(verifMaximo === 1)
                {
                    localStorage.setItem('listaProduto', JSON.stringify(listaProduto));
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

    const montaListaTamanho = () => {
        return (
            listaTamanhos.map((item, i) => {
                return (
                    <option key={`T${i}`} value={item.id}>{item.tamanho}</option>
                )
            })
        )
    }

    const montaListaQuantidade = (quantidadeTotal) => {
        let lista = [];
        for(let i=0; i<quantidadeTotal; i++) {
            lista.push(i+1)
        }

        return(lista.map((item, i) => (<option key={`selectedQuantidade${i}`} value={i+1}>{i+1}</option>)));
    }

    useEffect(() => {        
        
        const loadProdutos = async() => {
            Swal.fire({
                backdrop: true,
                didOpen: async () => {
                  Swal.showLoading();
                  const res = await Api.queryGet(`/ControllerProdutos/`);
                  if(res.result) { 
                    loadTamanhos();   
                    setLista(res.lista);
                    Swal.close();
                  } else {
                    Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
                  }   
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }

        loadProdutos();         
        
    }, [])

    return (
            <div className="row">
                <div className="col-lg-12">
                    <h4 className='card-title'>Solicitação de EPI's</h4>
                </div>
                {                    
                    lista && lista.map((item, i) => (
                    <>
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
                                        <select className="form-control" defaultValue={0} id={`tm${i}`} onChange={e => {
                                                let tamanhoLista = listaTamanhos;                                            
                                                tamanhoLista[i] = e.target.value;
                                                setTamanho(tamanhoLista)
                                            }}
                                        > 
                                            <option value="">Selecione um tamanho</option>                                            
                                            {montaListaTamanho()}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="quantidade">Quantidade</label>
                                        <select className="form-control" defaultValue={0} id={`quantidade${i}`} onChange={e => {
                                                let quantidadeLista = quantidade
                                                quantidadeLista[i] = e.target.value;
                                                setQuantidade(quantidadeLista);
                                            }}
                                        >
                                            <option value="0">Selecione a quantidade</option>
                                            {montaListaQuantidade(item.maximo)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-12 text-right">
                                    <button type="button" className="btn btn-inverse-primary mr-2" value={i} onClick={e => insereLista(e.target.value)}>Adicionar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                ))}
            </div>
        )
}

export default SolicitarEPI;