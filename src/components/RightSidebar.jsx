import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import { VestimentaContext } from "../context/VestimentaContext";
import Api from "./Api";
import Session from "./Session";

const RightSidebar = _ => {

    const [user] = useState(Session.getSession());
    const {global, setGlobalData} = useContext(VestimentaContext);
    const [carrinhoEstado, setCarrinhoEstado] = useState("")
    const [lista, setLista] = useState([]);
    const [valueTip, setValueTip] = useState();
    const [motivo, setMotivo] = useState("");
    const navigate = useNavigate();

    const mudaEstado = () => {
        let aux = carrinhoEstado;

        if(aux === "")
            setCarrinhoEstado("open");
        else
            setCarrinhoEstado("");
    }

    const realizarPedido = () => {
        let tokenString = localStorage.getItem('listaVestimentas');
        if(tokenString)
        {
            let listaVestimenta = JSON.parse(tokenString);

            if(listaVestimenta !== null && listaVestimenta.length > 0)
            {
                
                Swal.fire({
                    title: 'Descreva o motivo da Solicitação',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Enviar',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    preConfirm: (text) => {
                        setMotivo(text)
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then(async (result) => {
                    if(result.isConfirmed === true) {
                        Swal.fire({
                            didOpen: async () => {
                                Swal.showLoading();
                                if(result.isConfirmed)
                                {
                                    let itens = [];
                                    for(let i = 0; i < listaVestimenta.length; i++) {
                                        let item = {
                                            id: listaVestimenta[i].id,
                                            nome: listaVestimenta[i].nome,
                                            tamanho: listaVestimenta[i].tamanho,
                                            quantidade: listaVestimenta[i].quantidade,
                                            status: 1
                                        }
                                        itens.push(item);
                                    }
                    
                                    let pedido = {
                                        id: 0,
                                        item: itens,
                                        observacoes: result.value,
                                        idUsuario: user.id,
                                        status: 1
                                    };
    
                                    let res = await Api.queryPost(`/controllervestpedidos/`, pedido);
    
                                    if(res.result === false)
                                    {
                                        Swal.fire("OPS!", res.message, "error");
                                    }
                                    else
                                    {
                                        localStorage.setItem('listaVestimentas', JSON.stringify([]));
                                        setGlobalData();
                                        Swal.fire("Sucesso!", res.message, "success").then(() => {
                                            navigate("/listaPedidoVestimentas");
                                        });
                                    }
                                }
                                else
                                {
                                    Swal.fire("OPS!", "Erro ao salvar o motivo", "error");
                                }
                            },
                            allowOutsideClick: () => !Swal.isLoading()
                        });
                    }                
                })
            }
            else
            {
                Swal.fire("OPS!", "Não há nenhum item na lista de pedido", "error");
            }
        }
    }

    useEffect(() => {
        
        const mostraTips = _ => {
            if(valueTip)
            {
                valueTip.show();
                setTimeout(() => {
                    valueTip.hide();
                }, 5000);
            }
        }

        const loadLista = _ => {
            let tokenString = localStorage.getItem('listaVestimentas');
            if(tokenString)
            {
                if(carrinhoEstado !== "open")
                    mostraTips();

                setLista(JSON.parse(tokenString))
            }
        }
        
        loadLista();
    }, [global, valueTip, carrinhoEstado])

    let location = useLocation();

    if(location.pathname !== "/vestimentaItens")
    {
        return (<div></div>)
    }
    else
    {
        return (
            <div>
                <div className="theme-setting-wrapper">
                    { 
                        lista.length > 0 ? <Tippy content="Há item(ns) em seu carrinho" showOnCreate={false} delay={[100, 500]} onCreate={tip => setValueTip(tip)}><div id="settings-trigger" onClick={e => {
                            mudaEstado()
                        }}><i className="typcn typcn-shopping-cart"></i><span style={{color: "white"}}>&nbsp; {lista.length}</span></div></Tippy> : <div id="settings-trigger" onClick={e => mudaEstado()}><i className="typcn typcn-shopping-cart"></i></div>
                    } 
                    
                    <div id="theme-settings" className={`settings-panel ${carrinhoEstado}`}>
                        <i className="settings-close typcn typcn-times" onClick={e => {
                            mudaEstado()
                        }}></i>
                        <p className="settings-heading">Carrinho de Vestimenta</p>
                        {global}
                        <div className="row">
                            <div className="col-lg-12 text-right mt-5 pr-3">
                                <button type="submit" className="btn btn-inverse-primary mr-2" onClick={e => realizarPedido()}>Solicitar Item(ns)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RightSidebar;