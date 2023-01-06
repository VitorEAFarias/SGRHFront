import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Api from '../../../components/Api';

import DataTable from 'react-data-table-component';
import Filter from '../../../components/Filter';    
import Session from '../../../components/Session';

function formata_data(data) {
    var data_bruta = new Date(data);

    let dataFormatada = (
        (data_bruta.getDate() > 9 ? data_bruta.getDate() : "0"+data_bruta.getDate()) + "/" + 
        ((data_bruta.getMonth() + 1 < 9 ? "0"+(data_bruta.getMonth() + 1): data_bruta.getMonth() + 1)) + "/" + 
        data_bruta.getFullYear() + " " +
        (data_bruta.getHours() > 9 ? data_bruta.getHours() : "0"+data_bruta.getHours()) + ":" +
        (data_bruta.getMinutes() > 9 ? data_bruta.getMinutes() : "0"+data_bruta.getMinutes()) + ":" +
        (data_bruta.getSeconds() > 9 ? data_bruta.getSeconds() : "0"+data_bruta.getSeconds())
    );
    return dataFormatada
}

const ListaSolicitacoes = _ => {

    const [solicitacoes, setSolicitacoes] = useState([]);

    useEffect(() => {
        const loadSolicitacoes = async () => {
            const user = Session.getSession();
            const res = await Api.queryGet('/pedidos/usuario/'+user.id);
            if(res.result) {
                setSolicitacoes(await res.lista.map((solicitacao) => {
                    return(
                        {
                            info: <Link to={`/detalhesSolicitacoes/${solicitacao.id}`} className="btn btn-inverse-primary btn-rounded btn-fw"><i className='mdi mdi-information-outline'></i></Link>,
                            data: formata_data(solicitacao.data),
                            descricao: solicitacao.descricao,
                            status: solicitacao.status,
                            usuario: solicitacao.usuario,
                        }
                    )
                }));
            }
        }

        loadSolicitacoes();
    }, [])

    const columns = [
        {
            name: 'Info',
            selector: row => row.info,
            sortable: true,
        },
        {
            name: 'Data',
            selector: row => row.data,
            sortable: true,
        },
        {
            name: 'Descrição',
            selector: row => row.descricao,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Solicitante',
            selector: row => row.usuario,
            sortable: true,
        }
    ];

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = solicitacoes.filter(
		item => (item.data && item.data.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.descricao && item.descricao.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.status && item.status.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.usuario && item.usuario.toLowerCase().includes(filterText.toLowerCase()))
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
                    <h4 className='card-title'>Lista de Solicitações</h4>
                    <div className="row">
                        <div className='col-lg-12'>
                            <Link to={`/solicitaItem/`} className="btn btn-inverse-primary">Inserir Solicitação</Link>
                        </div>
                    </div>
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
    )
}

export default ListaSolicitacoes;