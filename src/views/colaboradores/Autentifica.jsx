import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../../components/Api";
import Session from "../../components/Session";

const Autentifica = _ => {

    //Usuário Logado
    const user = Session.getSession();

    //Parametro
    const id = Session.getParam();

    //Campos Formulário
    const [senha, setSenha] = useState();

    //Itens a serem vinculados
    const [itens] = useState(JSON.parse(sessionStorage.getItem('liberarItens')))

    //Navegação
    const navigate = useNavigate();

    const salva = _ => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()

                let res = await Api.queryPut(`/controllerVestvinculo/verificacao/${user.id}/${senha}/`, itens);
                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        Session.setParam(id)
                        navigate(`/pendente`);
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

    return (
        <div className="row">
            <div className="col-lg-12 stretch-card">
                <div className='card'>
                    <div className='card-body'>
                        <h4 className='card-title'>Autentificação do Recebimento do Item</h4>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <label htmlFor="nome">Senha: </label>
                                    <input type="password" className="form-control" id="Senha" name="senha" placeholder="Senha: " onChange={e => setSenha(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <label htmlFor="nome">Nome: </label>
                                    <input type="text" className="form-control" id="Senha" disabled={true} defaultValue={user.nome}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <button type="submit" className="btn btn-inverse-primary mr-2" onClick={e => salva()}>Salvar</button>
                                <button type="button" className="btn btn-inverse-secondary mr-3" onClick={e => {
                                    Session.setParam(id)
                                    navigate('/pendente')
                                }}>Voltar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Autentifica;