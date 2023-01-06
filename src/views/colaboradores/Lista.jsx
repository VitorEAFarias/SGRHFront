import React, { useEffect, useMemo, useState } from 'react';
import Api from '../../components/Api';

import DataTable from 'react-data-table-component';
import Filter from '../../components/Filter';
import Swal from 'sweetalert2';
import Session from '../../components/Session';
import { useNavigate } from 'react-router-dom';

const Lista = _ => {

    //Usuário Logado
    const user = Session.getSession();

    //Controle de Estado
    const [colaboradores, setColaboradores] = useState([]);

    //Navegação
    const navigate = useNavigate();

    useEffect(() => {
        const loadColaboradores = async () => {
            Swal.showLoading();
            let res;
            if(user.admin)
                res = await Api.queryGet('/controllerColaborador/superior/0');
            else
                 res = await Api.queryGet(`/controllerColaborador/superior/${user.id}`);
            
            if(res.result) {
                Swal.close();
                setColaboradores(await res.lista.map((colaborador) => {
                    return(
                        {
                            info: <button type="button" onClick={e => { 
                                Session.setParam(colaborador.idColaborador) 
                                navigate("/colaborador");
                            }} className="btn btn-inverse-primary btn-rounded btn-fw"><i className='mdi mdi-information-outline'></i></button>,
                            id: colaborador.idColaborador,
                            nome: colaborador.nome,
                            cargo: colaborador.cargo,
                            departamento: colaborador.departamento,
                        }
                    )
                }));
            }
        }

        loadColaboradores();
    }, [])

    const columns = [
        {
            name: 'Info',
            selector: row => row.info,
            sortable: true,
        },
        {
            name: 'Nome',
            selector: row => row.nome,
            sortable: true,
        },
        {
            name: 'Cargo',
            selector: row => row.cargo,
            sortable: true,
        },
        {
            name: 'Departamento',
            selector: row => row.departamento,
            sortable: true,
        }
    ];

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = colaboradores.filter(
		item => (item.nome && item.nome.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.cargo && item.cargo.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.departamento && item.departamento.toLowerCase().includes(filterText.toLowerCase()))
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
                    <h4 className='card-title'>Lista de Colaboradores</h4>
                    <DataTable 
                        columns={columns} 
                        data={filteredItems || []}
                        noDataComponent="Nenhum resultado encontrado"
                        pagination
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