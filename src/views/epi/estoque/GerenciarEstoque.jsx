import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from "../../../components/Api";
import DataTable from 'react-data-table-component';
import Filter from '../../../components/Filter';
import Swal from 'sweetalert2';
import Session from "../../../components/Session";
import Modal from 'react-modal';

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

const GerenciarEstoque = _ => {

    const [listaQuantidade, setListaQuantidade] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalCampos, setModalCampos] = useState();
    const [atual, setAtual] = useState();
    const [estoques, setEstoque] = useState([]);
    const navigate = useNavigate();

    const openModal = _ => {
        setModalIsOpen(true);
    }

    const closeModal = _ => {
        setModalIsOpen(false);
        setModalCampos(null);
    }

    const handleQuantidade = (i, valor) => {
        let lista = listaQuantidade;
        lista[i].quantidade = valor;
        setListaQuantidade(lista);
    }

    const afterOpenModal = async(_) => {
        setModalCampos(await atual.quantidade.map((item, i) => {
            let aux = { 
                id: item.id,
                idProduto: item.idProduto,
                quantidade: item.quantidade,
                idTamanho: item.idTamanho,
                ativo: item.ativo
            }

            console.log(atual)
            listaQuantidade.push(aux);

            setListaQuantidade(listaQuantidade);

            return (
                <div className="row" key={`listaQuantidades${i}`}>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="nome">Tamanho</label>
                            <input type="text" className="form-control" value={item.idTamanho} disabled/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="nome">Quantidade</label>
                            <input type="text" className="form-control" defaultValue={item.quantidade} onChange={e => {handleQuantidade(i, e.target.value)}}/>
                        </div>
                    </div>
                </div>                
            )
        }))
    }

    const salvaQuantidade = _ => {
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()

                let res = await Api.queryPut('/ControllerProdutosEstoque/estoque', listaQuantidade);

                if(res.result === false)
                {
                    Swal.fire("OPS!", res.message, "error");
                }
                else
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        closeModal();
                        setListaQuantidade([]);
                        loadEstoque();
                    });                    
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    const loadEstoque = async () => {
        const res = await Api.queryGet('/ControllerProdutosEstoque');
        if(res.result) {
            Swal.close();
            setEstoque(await res.lista.map((estoque) => {
                return(
                    {
                        id: estoque.id,
                        produto: estoque.produto,
                        quantidade:<button onClick={e => {
                            setAtual(estoque)
                            openModal()
                        }} className="btn btn-inverse-warning btn-rounded btn-fw">Gerenciar Estoque</button>,
                        preco: estoque.preco,
                        certificado: estoque.certificado,
                        validadeCertificado: estoque.validadeCertificado,
                        ativo: <button type="button" className={`btn btn-inverse-${estoque.ativo === "S" ? 'danger' : 'warning'} btn-rounded btn-fw`} onClick={ _ => {
                            handleAtivaEstoque(estoque)
                        }}>{estoque.ativo === "N" ? <i className='mdi mdi-close-circle-outline'></i> : <i className=' mdi mdi-checkbox-marked-circle-outline'></i>}</button>,
                        editar: <button type="button" className="btn btn-inverse-warning  btn-rounded btn-fw" onClick={e => {
                            Session.setParam(estoque.id)
                            navigate("/inserirEstoque");
                        }}><i className='mdi mdi-border-color'></i></button>
                    }
                )
            }));
        }
    }

    const handleAtivaEstoque = (data) => {
        let texto = data.ativo === "S" ? "desativar" : "ativar";
        let texto2 = data.ativo === "S" ? "Desativando" : "Ativando";
        let status = data.ativo === "S" ? "N" : "S";
        Swal.fire({
            title: 'Tem certeza?',
            html: `Deseja ${texto} o produto: ${data.produto}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(data)
                Swal.fire({
                    text: `${texto2} produto ${data.produto} ...`,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        Swal.showLoading();
                        let res = await Api.queryPut(`/ControllerProdutosEstoque/status/${data.idProduto}/${status}`);

                        if (res.result === true)
                        {
                            Swal.fire("Sucesso!", "Produto: " +data.produto+" "+(status === "S" ? 'Ativado' : 'Desativado')+" com sucesso", "success").then(() => {
                                loadEstoque();
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

        loadEstoque();

    }, []);

    const columns = [
        {
            name: '',
            width: '20%',
            wrap: true,
            selector: row => row.quantidade,
            sortable: true,
        },
        {
            name: 'Produto',
            selector: row => row.produto,
            sortable: true,
        },
        {
            name: 'Preço',
            selector: row => row.preco,
            sortable: true,
        },
        {
            name: 'Certificado de Aprovação',
            selector: row => row.certificado,
            sortable: true,
        },
        {
            name: 'Validade Certificado',
            selector: row => row.validadeCertificado,
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
            selector: row => row.editar,
            sortable: true,
        },
    ]

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = estoques.filter(
		item => (item.produto && item.produto.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.certificado && item.certificado.toLowerCase().includes(filterText.toLowerCase()))
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
                    <h4 className='card-title'>Lista de Produtos em Estoque</h4>
                    <button type="button" className="btn btn-inverse-primary btn-rounded btn-fw" onClick={e => {
                        Session.setParam("")
                        navigate("/inserirEstoque")
                    }}>Inserir Estoque</button>
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
                    Gerenciamento de Quantidades
                </div>
                <div className="col-lg-2 text-right">
                    <button onClick={closeModal} className="btn btn-inverse-danger btn-rounded btn-fw">X</button>
                </div>
            </div>
            {modalCampos}
            <div className="row">
                <div className="col-lg-12">
                    <button className="btn btn-inverse-warning btn-rounded btn-fw" onClick={salvaQuantidade}>Salvar</button>
                </div>
            </div>
        </Modal>
    </>
    )
}

export default GerenciarEstoque;