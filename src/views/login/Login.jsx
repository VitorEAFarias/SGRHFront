import React, { useState } from "react";
import Swal from "sweetalert2";
import Api from "../../components/Api";
import Helpers from "../../components/Helpers";
import Session from "../../components/Session";

const Login = props => {

    //Campos do Formulário
    const cb = props.setToken;
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [check, setCheck] = useState(false);

    const autentificaUsuario = _ => {

        if(cpf.length === 14)
        {
            if(senha !== "")
            {
                Swal.fire({
                    didOpen: async () => {
                        Swal.showLoading()
                        let res = await Api.queryPostLogin(`/controllerLogin/`, {cpf: Helpers.somenteNumeros(cpf), senha: senha});
                        if(res.data === false)
                        {
                            Swal.fire("OPS!", res.message, "error");
                        }
                        else
                        {
                            Session.setToken({token: res.token, data: new Date()})
                            Session.setParam("");
                            if(res.result !== false)
                            {
                                cb(check, res.id, res.nome, res.email, res.adm, res.compras)
                                Swal.close()
                            }
                            else
                            {
                                Swal.fire("OPS!", res.message, "error");
                            }
                        }
                        
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                })
            }
            else
            {
                Swal.fire("OPS!", "Erro na senha", "error");
            }
        }
        else
        {
            Swal.fire("OPS!", "Erro no cpf", "error");
        }
    }

    const handleCpfField = value => {
        var cpfField = Helpers.cpfMask(value);
        setCpf(cpfField);
    }

    const handleEnter = value => {
        if(value.key === 'Enter'){
            autentificaUsuario()
        }
    }

    return (
        <div className="container-scroller">
            <div className="container-fluid page-body-wrapper full-page-wrapper">
                <div className="content-wrapper d-flex align-items-center auth px-0">
                    <div className="row w-100 mx-0">
                        <div className="col-lg-4 mx-auto">
                            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                <div className="brand-logo text-center">
                                    <img src="./assets/img/Logo_RO.png" alt="logo" style={{width: "50%"}}/>
                                </div>
                                <h4>Bem vindo ao sistema de Vestimenta</h4>
                                <h6 className="font-weight-light">Para continuar realizar a autentificação no sistema.</h6>
                                <form className="pt-3">
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-lg" id="cpfField" value={cpf} placeholder="Usuário" onChange={e => handleCpfField(e.target.value)} onKeyPress={e => handleEnter(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" id="senhaField" placeholder="Senha" onChange={e => setSenha(e.target.value)} onKeyPress={e => handleEnter(e)}/>
                                    </div>
                                    <div className="mt-3">
                                        <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" type="button" onClick={ _ => {autentificaUsuario()}}>Entrar</button>
                                    </div>
                                    {/* <div className="my-2 d-flex justify-content-between align-items-center">
                                        <div className="form-check">
                                            <label className="form-check-label text-muted">
                                                <input type="checkbox" className="form-check-input" onChange={e => {setCheck(e.target.checked)}}/>
                                                Manter Logado
                                            </label>
                                        </div>
                                        <a href="/#" className="auth-link text-black">Forgot password?</a>
                                    </div>       */}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login