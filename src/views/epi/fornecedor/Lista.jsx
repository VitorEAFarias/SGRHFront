import React, { useEffect, useMemo, useState } from 'react';
import Api from "../../../components/Api";

import DataTable from 'react-data-table-component';
import Filter from '../../../components/Filter';
import Swal from 'sweetalert2';
import Session from '../../../components/Session';
import { useNavigate } from 'react-router-dom';

const Lista = _ => {

    const [fornecedores, setFornecedores] = useState([])
    const navigate = useNavigate();
    
    useEffect(() => {
        const loadFornecedores = async () => {
            const res = await Api.queryGet('/controllerfornecedor');
            if(res.result) {
                setFornecedores(await res.data.map((fornecedor) => {                    
                    return(
                        {
                            id: fornecedor.id,
                            nome: fornecedor.nome,
                            cnpj: fornecedor.cnpj,
                            razaoSocial: fornecedor.razaoSocial,
                            email: fornecedor.contato1,
                            telefone: fornecedor.contato2,
                            celular: fornecedor.contato3,
                            ativo: fornecedor.ativo,
                            editar: <button type="button" className="btn btn-inverse-warning  btn-rounded btn-fw" onClick={ _ => {
                                Session.setParam(fornecedor.id)
                                navigate("/cadastraFornecedor");
                            }}><i className='mdi mdi-border-color'></i></button>,
                            ativo: <button type="button" className={`btn btn-inverse-${fornecedor.ativo === "S" ? 'danger' : 'warning'} btn-rounded btn-fw`} onClick={ _ => {
                                handleStatusFornecedor(fornecedor)
                            }}>{fornecedor.ativo === "S" ? <i className='mdi mdi-close-circle-outline'></i> : <i className=' mdi mdi-checkbox-marked-circle-outline'></i>}</button>,
                            excluir: <button type="button" className="btn btn-inverse-danger btn-rounded btn-fw" onClick={ _ => {
                                handleDeletaFornecedor(fornecedor)
                            }}><i className='mdi mdi-delete'></i></button>
                        }                        
                    )
                }));
            }
        }

        const handleStatusFornecedor = (data) => {
            let texto = data.ativo === "S" ? "desativar" : "ativar";
            let texto2 = data.ativo === "S" ? "Desativando" : "Ativando";
            let status = data.ativo === "S" ? "N" : "S";
            Swal.fire({
                title: 'Tem certeza?',
                html: `Deseja ${texto} o fornecedor: ${data.nome}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        text: `${texto2} fornecedor ${data.nome} ...`,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        didOpen: async () => {
                            Swal.showLoading();

                            let res = await Api.queryPut(`/ControllerFornecedor/status/${status}/${data.id}`);

                            if (res.result === true)
                            {
                                Swal.fire("Sucesso!", "Fornecedor: " +data.nome+" "+(status === "S" ? 'Ativado' : 'Desativado')+" com sucesso", "success").then(() => {
                                    loadFornecedores();
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

        const handleDeletaFornecedor = (data) => {
            Swal.fire({
                title: 'Tem certeza?',
                html: `Deseja remover o fornecedor: ${data.nome}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then((result) => {
                if (result.isConfirmed) {
                Swal.fire({
                    text: 'Excluindo fornecedor...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        Swal.showLoading();
                        const res = await Api.queryDelete(`/fornecedor/${data.id}`);
                        if(res.result === true)
                        {
                            Swal.fire("Sucesso!", res.message, "success");
                            loadFornecedores();
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

            loadFornecedores()
    }, []);

    const columns = [
        {
            name: 'Nome',
            selector: row => row.nome,
            sortable: true,
        },
        {
            name: 'CNPJ',
            selector: row => row.cnpj,
            sortable: true,
        },
        {
            name: 'Razão Social',
            selector: row => row.razaoSocial,
            sortable: true,
        },
        {
            name: 'E-Mail',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Telefone',
            selector: row => row.telefone,
            sortable: true,
        },
        {
            name: 'Celular',
            selector: row => row.celular,
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
        {
            name: 'Excluir',
            selector: row => row.excluir,
            sortable: true,
        },
    ];

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = fornecedores.filter(
		item => (item.nome && item.nome.toLowerCase().includes(filterText.toLowerCase()))
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
        <div className="col-lg-12 stretch-card">
            <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title'>Lista de Fornecedores</h4>
                    <button type="button" className="btn btn-inverse-primary btn-rounded btn-fw" onClick={e =>{
                        Session.setParam("");
                        navigate("/cadastraFornecedor");
                    }}>Inserir Fornecedor</button>
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
    )
}

export default Lista;