import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from '../../../components/Api';

import DataTable from 'react-data-table-component';
import Filter from '../../../components/Filter';
import Swal from 'sweetalert2';

import Modal from 'react-modal';
import Session from "../../../components/Session";

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

const Lista = _ => {

    // Usuário Logado
    const user = Session.getSession();

    //Variavel de Controle
    const [listaQuantidade, setListaQuantidade] = useState([]);
    const [campos, setCampos] = useState();
    const [atual, setAtual] = useState();
    const [vestimentas, setVestimentas] = useState([])

    //Controle Modal
    const [modalIsOpen, setModalIsOpen] = useState(false)

    //Navegação
    const navigate = useNavigate();

    const openModal = _ => {
        setModalIsOpen(true);
    }

    const afterOpenModal = async(_) => {
        setCampos(await atual.quantidade.map((item, i) => {
            let aux = { 
                id: item.id,
                idItem: item.idItem,
                dataAlteracao: item.dataAlteracao,
                quantidade: item.quantidade,
                quantidadeUsado: item.quantidadeUsado,
                quantidadeVinculado: item.quantidadeVinculado,
                tamanho: item.tamanho,
                ativado: item.ativado
            }

            listaQuantidade.push(aux);

            setListaQuantidade(listaQuantidade);

            return (
                <div className="row" key={`listaQuantidades${i}`}>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="nome">Tamanho</label>
                            <input type="text" className="form-control" value={item.tamanho} disabled/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="nome">Quantidade Novo</label>
                            <input type="text" className="form-control" defaultValue={item.quantidade} onChange={e => {handleQuantidadeNova(i, e.target.value)}}/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="nome">Quantidade Usado</label>
                            <input type="text" className="form-control" defaultValue={item.quantidadeUsado} onChange={e => {handleQuantidadeUsada(i, e.target.value)}}/>
                        </div>
                    </div>
                </div>                
            )
        }))
    }

    const closeModal = _ => {
        setModalIsOpen(false);
        setCampos(null);
    }

    const handleQuantidadeNova = (i, valor) => {
        let lista = listaQuantidade;
        lista[i].quantidade = valor;
        setListaQuantidade(lista);
    }

    const handleQuantidadeUsada = (i, valor) => {
        let lista = listaQuantidade;
        lista[i].quantidadeUsado = valor;
        setListaQuantidade(lista);
    }

    const salvaQuantidade = _ => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()

                let res = await Api.queryPut(`/controllerestoque/${user.id}`, listaQuantidade);

                if(res.result === false)
                {
                    Swal.fire("OPS!", res.message, "error");
                }
                else
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        closeModal();
                        setListaQuantidade([]);
                        loadVestimentas();
                    });
                    
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const loadVestimentas = async () => {
        Swal.showLoading();
        const res = await Api.queryGet('/controllervestimenta');
        if(res.result) {
            Swal.close();
            setVestimentas(await res.lista.map((vestimenta) => {
                return(
                    {
                        id: vestimenta.id,
                        nome: vestimenta.nome,
                        tamanhoPesquisa: vestimenta.tamanho.toString(),
                        tamanho:<button onClick={e => {
                            setAtual(vestimenta)
                            openModal()
                        }} className="btn btn-inverse-warning btn-rounded btn-fw">Gerenciar Tamanhos</button>,
                        preco: vestimenta.preco,
                        ativo: <button type="button" className={`btn btn-inverse-${vestimenta.ativo === 1 ? 'danger' : 'warning'} btn-rounded btn-fw`} onClick={ _ => {
                            handleAtivoVestimenta(vestimenta)
                        }}>{vestimenta.ativo === 1 ? <i className='mdi mdi-close-circle-outline'></i> : <i className=' mdi mdi-checkbox-marked-circle-outline'></i>}</button>,
                        editar: <button type="button" className="btn btn-inverse-warning  btn-rounded btn-fw" onClick={e => {
                            Session.setParam(vestimenta.idVestimenta)
                            navigate("/vestimenta");
                        }}><i className='mdi mdi-border-color'></i></button>,
                        excluir: <button type="button" className="btn btn-inverse-danger btn-rounded btn-fw" onClick={ _ => {
                            handleDeletaVestimenta(vestimenta)
                        }}><i className='mdi mdi-delete'></i></button>
                    }
                )
            }));
        }
    }

    const handleAtivoVestimenta = (data) => {
        let texto = data.ativo === 1 ? "desativar" : "ativar"
        let textoFlex = data.ativo === 1 ? "Desativando" : "Ativando"
        let novoAtivo = data.ativo === 1 ? 0 : 1;
        Swal.fire({
            title: 'Tem certeza?',
            html: `Deseja ${texto} a vestimenta: ${data.nome}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then((result) => {
            if (result.isConfirmed) {
            Swal.fire({
                text: `${textoFlex} vestimenta...`,
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: async () => {
                    Swal.showLoading();

                    let res;
                    if(novoAtivo === 1)
                    {
                        res = await Api.queryPut(`/controllervestimenta/ativaVestimenta/${data.idVestimenta}`);
                    }
                    else
                    {
                        res = await Api.queryDelete(`/controllervestimenta/${data.idVestimenta}/${novoAtivo}`);
                    }

                    if(res.result === true)
                    {
                        Swal.fire("Sucesso!", data.nome+" "+(novoAtivo === 1 ? 'Ativado' : 'Desativado')+" com sucesso", "success").then(() => {
                            loadVestimentas();
                        });
                    }
                    else
                    {
                        Swal.fire("Ops!", res.message, "warning");
                    }
                }
            })
            }
        })
    }

    const handleDeletaVestimenta = (data) => {
        Swal.fire({
            title: 'Tem certeza?',
            html: `Deseja remover a vestimenta: ${data.nome}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then((result) => {
            if (result.isConfirmed) {
            Swal.fire({
                text: 'Excluindo vestimenta...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: async () => {
                    Swal.showLoading();

                    const res = await Api.queryDelete(`/controllervestimenta/${data.idVestimenta}/${2}`);
                    if(res.result === true)
                    {
                        Swal.fire("Sucesso!", res.message, "success").then(() => {
                            loadVestimentas();
                        });
                    }
                    else
                    {
                        Swal.fire("Ops!", res.message, "warning");
                    }
                }
            })
            }
        })
    }

    useEffect(() => {
        loadVestimentas()
    }, []);

    const columns = [
        {
            name: 'Tamanho',
            width: '20%',
            wrap: true,
            selector: row => row.tamanho,
            sortable: true,
        },
        {
            name: 'Nome',
            width: '20%',
            wrap: true,
            selector: row => row.nome,
            sortable: true,
        },
        {
            name: 'preço',
            width: '15%',
            selector: row => row.preco,
            sortable: true,
        },
        {
            name: 'Ativo/Desativo',
            width: '15%',
            selector: row => row.ativo,
            sortable: true,
        },
        {
            name: 'Editar',
            width: '15%',
            selector: row => row.editar,
            sortable: true,
        },
        {
            name: 'Excluir',
            width: '15%',
            selector: row => row.excluir,
            sortable: true,
        },
    ];

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = vestimentas.filter(
		item => (item.nome && item.nome.toLowerCase().includes(filterText.toLowerCase())) || 
                (item.tamanhoPesquisa && item.tamanhoPesquisa.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.preco && item.preco.toString().toLowerCase().includes(filterText.toLowerCase()))
	);

	const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<Filter onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
		);
	}, [filterText, resetPaginationToggle]);

    return (
        <>
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Lista de Vestimentas</h4>
                    <button type="button" className="btn btn-inverse-primary btn-rounded btn-fw" onClick={e => {
                        Session.setParam("")
                        navigate("/vestimenta")
                    }}>Inserir Vestimentas</button>
                    <DataTable
                        columns={columns} 
                        data={filteredItems || []}
                        pagination
                        noDataComponent="Nenhum resultado encontrado"
                        paginationResetDefaultPage={resetPaginationToggle}
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                        persistTableHead
                    />
                </div>
            </div>
        </div>
        <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} style={customStyles} contentLabel="Example">
            <div className="row">
                <div className="col-lg-10">
                    Gerenciamento de Tamanho
                </div>
                <div className="col-lg-2 text-right">
                    <button onClick={closeModal} className="btn btn-inverse-danger btn-rounded btn-fw">X</button>
                </div>
            </div>
            {campos}
            <div className="row">
                <div className="col-lg-12">
                    <button className="btn btn-inverse-warning btn-rounded btn-fw" onClick={salvaQuantidade}>Salvar</button>
                </div>
            </div>
        </Modal>
        </>
    );
}

export default Lista;