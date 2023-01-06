import React, { useEffect, useMemo, useState } from 'react';
import Api from "../../../components/Api";
import DataTable from 'react-data-table-component';
import Filter from '../../../components/Filter';
import Swal from 'sweetalert2';
import Session from '../../../components/Session';
import { useNavigate } from 'react-router-dom';

const Lista = _ => {

    const [produtos, setProdutos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const loadProdutos = async () => {
            const res = await Api.queryGet('/ControllerProdutos');           
            if(res.result) {
                setProdutos(await res.data.map((produto) => {                   
                    return(
                        {
                            id: produto.id,
                            nome: produto.nomeProduto,
                            categoria: produto.categoria,
                            preco: produto.preco,
                            ca: produto.ca,
                            validadeEmUso: produto.validadeEmUso,
                            editar: <button type="button" className="btn btn-inverse-warning  btn-rounded btn-fw" onClick={ _ => {
                                Session.setParam(produto.id)
                                navigate("/cadastraProduto");
                            }}><i className='mdi mdi-border-color'></i></button>,
                            ativo: <button type="button" className={`btn btn-inverse-${produto.ativo === "S" ? 'danger' : 'warning'} btn-rounded btn-fw`} onClick={ _ => {
                                handleStatusProduto(produto)
                            }}>{produto.ativo === "S" ? <i className='mdi mdi-close-circle-outline'></i> : <i className=' mdi mdi-checkbox-marked-circle-outline'></i>}</button>
                        }
                        
                    )
                }));
            }
        }

        const handleStatusProduto = (data) => {
            let texto = data.ativo === "S" ? "desativar" : "ativar";
            let texto2 = data.ativo === "S" ? "Desativando" : "Ativando";
            let status = data.ativo === "S" ? "N" : "S";
            Swal.fire({
                title: 'Tem certeza?',
                html: `Deseja ${texto} o produto: ${data.nomeProduto}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        text: `${texto2} produto ${data.nomeProduto} ...`,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        didOpen: async () => {
                            Swal.showLoading();

                            let res = await Api.queryPut(`/ControllerProdutos/status/${status}/${data.id}`);

                            if (res.result === true)
                            {
                                Swal.fire("Sucesso!", "Produto: " +data.nomeProduto+" "+(status === "S" ? 'Ativado' : 'Desativado')+" com sucesso", "success").then(() => {
                                    loadProdutos();
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

            loadProdutos()
    }, []);

    const columns = [
        {
            name: 'Nome',
            selector: row => row.nome,
            sortable: true,
        },
        {
            name: 'Categoria',
            selector: row => row.categoria,
            sortable: true,
        },
        {
            name: 'Preço',
            selector: row => row.preco,
            sortable: true,
        },
        {
            name: 'CA (Certificado de Aprovação)',
            selector: row => row.ca,
            sortable: true,
        },
        {
            name: 'Validade em uso',
            selector: row => row.validadeEmUso,
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
    ];

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = produtos.filter(
		item => (item.nome && item.nome.toLowerCase().includes(filterText.toLowerCase())) || 
                (item.ca && item.ca.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.valor && item.valor.toString().toLowerCase().includes(filterText.toLowerCase())) ||
                (item.fornecedor && item.fornecedor.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.categoria && item.categoria.toLowerCase().includes(filterText.toLowerCase()))
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
                    <h4 className='card-title'>Lista de Produtos</h4>
                    <button type="button" className="btn btn-inverse-primary btn-rounded btn-fw" onClick={e =>{
                        Session.setParam("");
                        navigate("/cadastraProduto");
                    }}>Inserir Produto</button>
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

export default Lista