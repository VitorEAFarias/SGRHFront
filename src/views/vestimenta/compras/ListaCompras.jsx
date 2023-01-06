import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const ListaCompra = _ => {

    //Variavel de Controle
    const [lista, setLista] = useState([]);

    //Navegação
    const navigate = useNavigate();

    useEffect(() => {
        const loadLista = async () => {
            const res = await Api.queryGet('/controllervestcompras/');
            if(res.result) {
                setLista(await res.lista.map((solicitacao) => {
                    return(
                        {
                            info: <button type="button" className="btn btn-inverse-primary btn-rounded btn-fw" onClick={e => {
                                Session.setParam(solicitacao.id);
                                navigate("/detalhesComprasVestimentas")
                            }}><i className='mdi mdi-information-outline'></i></button>,
                            quantidade: ""+solicitacao.itensRepositorio.length,
                            dataCompra: formata_data(solicitacao.dataCompra),
                            status: solicitacao.status,
                            tipo: solicitacao.itensRepositorio[0].idRepositorio[0] === 0 ? "Avulso" : "Pedido",
                            usuario: solicitacao.nome
                        }
                    )
                }));
            }
        }

        loadLista();
    }, [])

    const columns = [
        {
            name: 'Info',
            selector: row => row.info,
            sortable: true,
        },
        {
            name: 'Quantidade de Itens',
            selector: row => row.quantidade,
            sortable: true,
        },
        {
            name: 'Data de Compra',
            selector: row => row.dataCompra,
            sortable: true,
        },
        {
            name: 'Tipo de Compra',
            selector: row => row.tipo,
            sortable: true
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
	const filteredItems = lista.filter(
		item => (item.quantidade && item.quantidade.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.dataCompra && item.dataCompra.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.status && item.status.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.tipo && item.tipo.toLowerCase().includes(filterText.toLowerCase())) ||
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
                    <h4 className='card-title'>Lista de Solicitações de Compras</h4>
                    <div className="row">
                        <div className='col-lg-12'>
                            <Link to={`/listaItensCompras`} className="btn btn-inverse-primary mr-3">Inserir Solicitação de Compra</Link>
                            <Link to={`/listaCompraAvulsa`} className="btn btn-inverse-primary">Inserir Solicitação de Compra Avulsa</Link>
                        </div>
                    </div>
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

export default ListaCompra;