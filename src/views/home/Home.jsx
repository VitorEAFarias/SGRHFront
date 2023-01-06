import React, { useMemo, useState } from "react";
// import Api from '../../components/Api';

import DataTable from 'react-data-table-component';
import Filter from '../../components/Filter';
import { useEffect } from "react";

const Home = props => {
    
    //Controle de Estado
    const [lista, setLista] = useState([])

    useEffect(() => {
        const loadLista = async () => {
            setLista([]);
            // const res = await Api.queryGet('/fornecedor');
            // if(res.result) {
            //     setFornecedores(await res.lista.map((fornecedor) => {
            //         return(
            //             {
            //                 id: fornecedor.id,
            //                 nome: fornecedor.nome,
            //                 editar: <Link to={`/fornecedor/${fornecedor.id}`} className="btn btn-inverse-warning  btn-rounded btn-fw"><i className='mdi mdi-border-color'></i></Link>,
            //                 excluir: <button type="button" className="btn btn-inverse-danger btn-rounded btn-fw" onClick={ _ => {
            //                     handleDeletaFornecedor(fornecedor)
            //                 }}><i className='mdi mdi-delete'></i></button>
            //             }
                        
            //         )
            //     }));
            // }
        }

        loadLista();

    }, []);

    const columns = [
        {
            name: 'Equipamento',
            selector: row => row.nome,
            sortable: true,
        },
        {
            name: 'Data de Validade',
            selector: row => row.validade,
            sortable: true,
        },
        {
            name: 'Tempo Restante',
            selector: row => row.tempo,
            sortable: true,
        },
        {
            name: 'Nivel',
            selector: row => row.nivel,
            sortable: false,
        },
    ];

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = lista.filter(
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

    return(
        <div className="row">
            <div className="col-xl-12 grid-margin stretch-card flex-column">
                <h5 className="mb-2 text-titlecase mb-4">Painel Geral</h5>
                <div className="row">
                    <div className="col-md-3 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between justify-content-md-center justify-content-xl-between flex-wrap mb-4">
                                    <div>
                                        <p className="mb-2 text-md-center text-lg-left">Pedidos Pendentes</p>
                                        <h1 className="mb-0">45</h1>
                                    </div>
                                    <i className="typcn typcn-briefcase icon-xl text-secondary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between justify-content-md-center justify-content-xl-between flex-wrap mb-4">
                                    <div>
                                        <p className="mb-2 text-md-center text-lg-left">Pedidos Realizados</p>
                                        <h1 className="mb-0">130</h1>
                                    </div>
                                    <i className="typcn typcn-briefcase icon-xl text-secondary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between justify-content-md-center justify-content-xl-between flex-wrap mb-4">
                                    <div>
                                        <p className="mb-2 text-md-center text-lg-left">Pedidos Reprovados</p>
                                        <h1 className="mb-0">67</h1>
                                    </div>
                                    <i className="typcn typcn-briefcase icon-xl text-secondary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between justify-content-md-center justify-content-xl-between flex-wrap mb-4">
                                    <div>
                                        <p className="mb-2 text-md-center text-lg-left">Pedidos Aprovados</p>
                                        <h1 className="mb-0">53</h1>
                                    </div>
                                    <i className="typcn typcn-briefcase icon-xl text-secondary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row h-100">
                    <div className="col-md-6 grid-margin">
                        <div className='card'>
                            <div className='card-body'>
                                <h4 className='card-title'>Lista Total de Itens Vinculados</h4>
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
                    <div className="col-md-6 grid-margin">
                        <div className='card'>
                            <div className='card-body'>
                                <h4 className='card-title'>Pedidos Pendentes</h4>
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
                </div>
            </div>
        </div>
    );
}

export default Home