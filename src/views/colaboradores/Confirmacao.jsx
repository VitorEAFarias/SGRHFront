import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Filter from '../../components/Filter';
import Swal from "sweetalert2";
import Api from "../../components/Api";

const Confirmacao= _ => {

    //Parametro
    const { id } = useParams(0);

    //Variavel de Controle
    const [pendentes, setPendentes] = useState([]);
    const [lista, setLista] = useState([]);
    
    const abrirModal = _ => {
    }

    useEffect(() => {

        const marcarItem = (id) => {
            // eslint-disable-next-line array-callback-return
            let found = lista.find( (element, index) => {
                if(element  === id) {
                    lista.splice(index, 1);
                    setLista(lista);
                    return element;
                }
            });
            
            if(!found)
            {
                lista.push(id)
                setLista(lista);
            }
        }

        const loadPendentes = async () => {
            Swal.showLoading();
            const res = await Api.queryGet('/controllerEpiVinculo/pendente/'+id);
            if(res.result) {
                Swal.close();
                setPendentes(await res.lista.map((pendente, i) => {
                    return(
                        {
                            selecione: (
                                <input type="checkbox" onClick={e => marcarItem(pendente.id, i)}/>
                            ),
                            produto: pendente.nome,
                            ca: pendente.ca,
                            categoria: pendente.categoria,
                            fornecedor: pendente.fornecedor,
                            quantidade: pendente.quantidade,
                        }
                    )
                }));
            }
        }

        loadPendentes();
    }, [id, lista])

    const columns = [
        {
            name: 'Selecione',
            selector: row => row.selecione,
            sortable: false,
        },
        {
            name: 'Produto',
            selector: row => row.produto,
            sortable: true,
        },
        {
            name: 'CA',
            selector: row => row.ca,
            sortable: true,
        },
        {
            name: 'Categoria',
            selector: row => row.categoria,
            sortable: true,
        },
        {
            name: 'Fornecedor',
            selector: row => row.fornecedor,
            sortable: true,
        },
        {
            name: 'Quantidade',
            selector: row => row.quantidade,
            sortable: true,
        }
    ];

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = pendentes.filter(
		item => (item.produto && item.produto.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.ca && item.ca.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.categoria && item.categoria.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.fornecedor && item.fornecedor.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.quantidade && item.quantidade.toLowerCase().includes(filterText.toLowerCase()))
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
                    <h4 className='card-title'>Vincular Produto</h4>
                    <div className='row'>
                        <div className="col-lg-12">
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
                    <div className="row mb-4">
                        <button type="button" className="btn btn-inverse-primary" onClick={e => abrirModal()}>Atestar recebimento</button>
                    </div>
                    <Link to={`/colaborador/${id}`} className="btn btn-inverse-secondary">Voltar</Link>
                </div>
            </div>
        </div>
    )
}

export default Confirmacao;