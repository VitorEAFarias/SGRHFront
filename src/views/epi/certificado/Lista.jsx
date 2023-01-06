import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from "../../../components/Api";
import Helpers from "../../../components/Helpers";
import DataTable from 'react-data-table-component';
import Filter from '../../../components/Filter';
import Swal from 'sweetalert2';
import Session from "../../../components/Session";

const Lista = _ => {

    const [certificados, setCertificados] = useState([])

    const navigate = useNavigate();

    useEffect(() => {

        const loadCertificados = async () => {
            const res = await Api.queryGet('/ControllerCertificadoAprovacao');
            if(res.result) {
                setCertificados(await res.data.map((certificado) => {
                    return(
                        {
                            id: certificado.id,
                            numero: certificado.numero,
                            validade: Helpers.formataData(certificado.validade),
                            editar: <button type="button" className="btn btn-inverse-warning  btn-rounded btn-fw" onClick={ _ => {
                                Session.setParam(certificado.id)
                                navigate("/cadastraCertificado");
                            }}><i className='mdi mdi-border-color'></i></button>,
                            ativo: <button type="button" className={`btn btn-inverse-${certificado.ativo === "S" ? 'danger' : 'warning'} btn-rounded btn-fw`} onClick={ _ => {
                                handleStatusCertificado(certificado)
                            }}>{certificado.ativo === "S" ? <i className='mdi mdi-close-circle-outline'></i> : <i className=' mdi mdi-checkbox-marked-circle-outline'></i>}</button>,
                        }                        
                    )
                }));
            }
        }

        const handleStatusCertificado = (data) => {
            let texto = data.ativo === "S" ? "desativar" : "ativar";
            let texto2 = data.ativo === "S" ? "Desativando" : "Ativando";
            let status = data.ativo === "S" ? "N" : "S";
            Swal.fire({
                title: 'Tem certeza?',
                html: `Deseja ${texto} o certificado: ${data.numero}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        text: `${texto2} certificado ${data.numero} ...`,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        didOpen: async () => {
                            Swal.showLoading();

                            let res = await Api.queryPut(`/ControllerCertificadoAprovacao/status/${status}/${data.id}`);

                            if (res.result === true)
                            {
                                Swal.fire("Sucesso!", "Certificado: " +data.numero+" "+(status === "S" ? 'Ativado' : 'Desativado')+" com sucesso", "success").then(() => {
                                    loadCertificados();
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

            loadCertificados()
    }, []);

    const columns = [
        {
            name: 'Número',
            selector: row => row.numero,
            sortable: true,
        },
        {
            name: 'Validade',
            selector: row => row.validade,
            sortable: true,
        },
        {
            name: 'Editar',
            selector: row => row.editar,
            sortable: true,
        },
        {
            name: 'Ativo/Desativo',
            width: '15%',
            selector: row => row.ativo,
            sortable: true,
        },
    ]

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = certificados.filter(
		item => (item.numero && item.numero.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.validade && item.validade.toLowerCase().includes(filterText.toLowerCase()))
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
                    <h4 className='card-title'>Lista de Certificados</h4>
                    <button type="button" className="btn btn-inverse-primary btn-rounded btn-fw" onClick={e => {
                        Session.setParam("")
                        navigate("/cadastraCertificado")
                    }}>Inserir Certificado</button>
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