import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Session from "../../../components/Session";
import Api from '../../../components/Api';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import Filter from '../../../components/Filter';

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

const Cadastrar = _ => {
    
    const {register, reset, formState: {errors}} = useForm();
    const [tamanho, setTamanho] = useState([]);
    const [tamanhos, setTamanhos] = useState([]);    
    const [afterModal, setAfterModal] = useState();
    const id = Session.getParam();
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [idTamanho, setIdTamanho] = useState(0);

    const openModal = _ => {
        setModalIsOpen(true);
    }

    const closeModal = _ => {
        setModalIsOpen(false);
    }

    const salvaTamanho = _ => {
        let data = {
            id: idTamanho,
            tamanho: tamanho,
            ativo: "S",
        }
        Swal.fire({
            didOpen: async () => {
                Swal.showLoading()
                let res;
                if(typeof data.id === "undefined" || data.id === 0)
                    res = await Api.queryPost('/ControllerTamanhos', data);
                else
                    res = await Api.queryPut('/ControllerTamanhos', data);
                
                if(res.result !== false)
                {
                    Swal.fire("Sucesso!", res.message, "success").then(() => {
                        navigate("/cadastraTamanhos");
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

    const afterOpenModal = async(_) => {
        setAfterModal(            
            <div className='card-body'>                
                <div className="row">        
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label htmlFor="tamanho">Tamanho</label>
                            <input type="text" className="form-control" id="tamanho" name="tamanho" placeholder="Tamanho: " defaultValue={tamanho?.tamanho} onChange={e => {setTamanho(e.target.value)}}/>
                        </div>
                        <input type="hidden" value={id?id:0} {...register('id')}/>
                    </div> 
                </div>
            </div>             
        )
    }

    const loadTamanho = async () => {
        Swal.fire({
            backdrop: true,
            didOpen: async () => {
              Swal.showLoading();
              const res = await Api.queryGet(`/ControllerTamanhos/${id}`);           
              if(res.result) {
                setTamanho(res);
                reset(res.tamanho);
                Swal.close();            
              } else {
                Swal.fire("OPS!", "Não foi possível comunicar com o serviço", "error");
              }   
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    useEffect(() => {

        const loadTamanhos = async () => {
            const res = await Api.queryGet('/ControllerTamanhos');         
            if(res.result) {
                
                setTamanhos(await res.data.map((item) => {        
                    return(
                        {
                            id: item.id,
                            tamanho: item.tamanho,
                            ativo: <button type="button" className={`btn btn-inverse-${item.ativo === "S" ? 'danger' : 'warning'} btn-rounded btn-fw`} onClick={ _ => {
                                handleStatusTamanho(item)
                            }}>{item.ativo === "S" ? <i className='mdi mdi-close-circle-outline'></i> : <i className=' mdi mdi-checkbox-marked-circle-outline'></i>}</button>,
                            editar: <button type="button" className="btn btn-inverse-warning  btn-rounded btn-fw" onClick={ _ => {
                                setIdTamanho(item.id);
                                openModal();
                            }}><i className='mdi mdi-border-color'></i></button>,
                            excluir: <button type="button" className="btn btn-inverse-danger btn-rounded btn-fw" onClick={ _ => {
                                handleDeletaTamanho(item)
                            }}><i className='mdi mdi-delete'></i></button>
                        }
                        
                    )
                }));
            }
        }

        const handleDeletaTamanho = (data) => {
            Swal.fire({
                title: 'Tem certeza?',
                html: `Deseja remover a tamanho: ${data.tamanho}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then((result) => {
                if (result.isConfirmed) {
                Swal.fire({
                    text: 'Excluindo tamanho...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        Swal.showLoading();
                        const res = await Api.queryDelete(`/ControllerCategorias/${data.id}`);
                        if(res.result === true)
                        {
                            Swal.fire("Sucesso!", res.message, "success");
                            loadTamanhos();
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

        const handleStatusTamanho = (data) => {
            let texto = data.ativo === "S" ? "desativar" : "ativar";
            let texto2 = data.ativo === "S" ? "Desativando" : "Ativando";
            let status = data.ativo === "S" ? "N" : "S";
            Swal.fire({
                title: 'Tem certeza?',
                html: `Deseja ${texto} o produto: ${data.tamanho}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        text: `${texto2} produto ${data.tamanho} ...`,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        didOpen: async () => {
                            Swal.showLoading();

                            let res = await Api.queryPut(`/ControllerTamanhos/status/${status}/${data.id}`);

                            if (res.result === true)
                            {
                                Swal.fire("Sucesso!", "Produto: " +data.tamanho+" "+(status === "S" ? 'Ativado' : 'Desativado')+" com sucesso", "success").then(() => {
                                    loadTamanhos();
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

        if(id > 0)
            loadTamanho();

        loadTamanhos();
    }, []) 

    

    const columns = [
        {
            name: 'Tamanho',
            width: '25%',
            selector: row => row.tamanho,
            sortable: true,
        },
        {
            name: 'Ativo/Desativo',
            width: '25%',
            selector: row => row.ativo,
            sortable: true,
        },
        {
            name: 'Editar',
            width: '25%',
            selector: row => row.editar,
            sortable: true,
        }, 
        {
            name: 'Excluir',
            width: '25%',
            selector: row => row.excluir,
            sortable: true,
        },      
    ];

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = tamanhos.filter(
		item => (item.tamanho && item.tamanho.toLowerCase().includes(filterText.toLowerCase()))
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
                    <h4 className='card-title'>Lista de Tamanhos</h4>
                    <button type="button" className="btn btn-inverse-primary btn-rounded btn-fw" onClick={e => {
                        setIdTamanho(0);
                        openModal()
                    }}>Inserir Tamanho</button>
                    <DataTable 
                        columns={columns} 
                        data={filteredItems || []}
                        pagination
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
                    Cadastrar Novo Tamanho
                </div>
                <div className="col-lg-2 text-right">
                    <button onClick={closeModal} className="btn btn-inverse-danger btn-rounded btn-fw">X</button>
                </div>
            </div>
            {afterModal}
            <div className="row">
                <div className="col-lg-12">
                    <button type="button" className="btn btn-inverse-warning btn-rounded btn-fw" onClick={e => {salvaTamanho() 
                        Session.setParam("")                        
                        }}>Salvar</button>
                </div>
            </div>
        </Modal>
        </>
    )
}

export default Cadastrar