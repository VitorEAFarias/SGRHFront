import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from "../../../components/Api";

import DataTable from 'react-data-table-component';
import Filter from '../../../components/Filter';
import Swal from 'sweetalert2';
import Session from "../../../components/Session";

const Lista = _ => {

    const [categorias, setCategorias] = useState([])

    const navigate = useNavigate();

    useEffect(() => {

        const loadCategorias = async () => {
            const res = await Api.queryGet('/ControllerCategorias');
            if(res.result) {
                setCategorias(await res.lista.map((categoria) => {
                    return(
                        {
                            id: categoria.id,
                            nome: categoria.nome,
                            editar: <button type="button" className="btn btn-inverse-warning  btn-rounded btn-fw" onClick={ _ => {
                                Session.setParam(categoria.id)
                                navigate("/cadastraCategoria");
                            }}><i className='mdi mdi-border-color'></i></button>,
                            excluir: <button type="button" className="btn btn-inverse-danger btn-rounded btn-fw" onClick={ _ => {
                                handleDeletaCategoria(categoria)
                            }}><i className='mdi mdi-delete'></i></button>
                        }                        
                    )
                }));
            }
        }

        const handleDeletaCategoria = (data) => {
            Swal.fire({
                title: 'Tem certeza?',
                html: `Deseja remover a categoria: ${data.nome}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then((result) => {
                if (result.isConfirmed) {
                Swal.fire({
                    text: 'Excluindo categoria...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        Swal.showLoading();
                        const res = await Api.queryDelete(`/ControllerCategorias/${data.id}`);
                        if(res.result === true)
                        {
                            Swal.fire("Sucesso!", res.message, "success");
                            loadCategorias();
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

            loadCategorias()
    }, []);

    const columns = [
        {
            name: 'Nome',
            selector: row => row.nome,
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
	const filteredItems = categorias.filter(
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
                    <h4 className='card-title'>Lista de Categoria</h4>
                    <button type="button" className="btn btn-inverse-primary btn-rounded btn-fw" onClick={e => {
                        Session.setParam("")
                        navigate("/cadastraCategoria")
                    }}>Inserir Categoria</button>
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