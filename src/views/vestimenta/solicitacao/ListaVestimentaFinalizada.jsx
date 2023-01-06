import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../components/Api";

import DataTable from 'react-data-table-component';
import Filter from "../../../components/Filter";
import Session from "../../../components/Session";

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

const ListaVestimentasFinalizada = _ => {

    //Variavel de Controle
    const [pedidos, setPedidos] = useState([]);

    //Usuário Logado
    const user = Session.getSession();

    //Navegação
    const navigate = useNavigate();

    useEffect(() => {
        const loadSolicitacoes = async () => {
            let res;
            if(user.admin)
            {
                res = await Api.queryGet('/controllervestpedidos/status/2');
            }
            else
            {
                res = await Api.queryGet('/controllervestpedidos/usuario/'+user.id);
            }
            
            if(res.result) {
                setPedidos(await res.lista.map((item) => {
                    return(
                        {
                            info: <button type="button" className="btn btn-inverse-primary btn-rounded btn-fw" onClick={e => {
                                Session.setParam(item.id)
                                navigate("/detalhesVestimentas")
                            }}><i className='mdi mdi-information-outline'></i></button>,
                            data: formata_data(item.dataPedido),
                            quantidade: item.pedido.length,
                            status: item.status,
                            solicitante: item.nome,
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
            name: 'Quantidade(por unidade)',
            selector: row => row.quantidade,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Solicitante',
            selector: row => row.solicitante,
            sortable: true,
        }
    ];

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = pedidos.filter(
		item => (item.data && item.data.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.quantidade && item.quantidade.toString().toLowerCase().includes(filterText.toLowerCase())) ||
                (item.status && item.status.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.solicitante && item.solicitante.toLowerCase().includes(filterText.toLowerCase()))
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
                    <h4 className='card-title'>Lista de Solicitações de Vestimentas</h4>
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
                    <div className="row">
                        <div className='col-lg-12'>
                            <Link to={`/listaPedidoVestimentas`} className="btn btn-inverse-secondary mr-3">Voltar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListaVestimentasFinalizada;