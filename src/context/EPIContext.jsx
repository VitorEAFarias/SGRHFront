import React, { createContext, useEffect, useState } from "react";

const INITIAL_STATE = [
    (
        <div className="border" style={{padding: '13px 35px'}} key={`ListaProduto0`}>
            <div className="row">
                <div className="col-lg-12">
                    Nenhum item adicionado a lista de pedidos
                </div>
            </div>
        </div>
    )
];

export const EPIContext = createContext({ global: INITIAL_STATE, setGlobalData: () => {} });

export const EPIProvider = ({ children }) => {
    const [global, setGlobal] = useState(INITIAL_STATE);
  
    const setGlobalData = (_) => {
      
      let tokenString = localStorage.getItem('listaProduto');
      if(tokenString)
      {
        let listaProduto = JSON.parse(tokenString)

        if(listaProduto !== null && listaProduto.length > 0)
        {
          setGlobal(listaProduto.map((item, i) => {
            return(
              <div className="border" style={{padding: '13px 35px'}} key={`ListaProduto${i}`}>
                  <div className="row">
                      <div className="col-lg-3">
                          <img src={`data:image/jpeg;base64,${item.img}`} style={{maxHeight: '40px'}} alt="aa"/>
                      </div>
                      <div className="col-lg-7">
                          <p>{item.nome}</p>
                          <p>Tamanho: {item.tamanho} Quantidade: {item.quantidade}</p>
                      </div>
                      <div className="col-lg-2 text-center">
                          <button type="button" className="btn btn-danger btn-rounded btn-icon" onClick={e => {
                            
                            let listaProdutoSession = JSON.parse(localStorage.getItem('listaProduto'));
                    
                            listaProdutoSession.splice(i, 1);
                    
                            localStorage.removeItem('listaProduto');
                    
                            localStorage.setItem('listaProduto', JSON.stringify(listaProdutoSession));
                    
                            setGlobalData()
                          }}><i className='mdi mdi-delete'></i></button>
                      </div>
                  </div>
              </div>
            )
          }))
        }
        else
        {
          setGlobal([
            (
              <div className="border" style={{padding: '13px 35px'}} key={`ListaProduto0`}>
                  <div className="row">
                      <div className="col-lg-12">
                          Nenhum item adicionado a lista de pedidos
                      </div>
                  </div>
              </div>
            )
          ]);
        }
      }
    };

    useEffect(() => { 
      setGlobalData()
    }, []);
  
    return (
      <EPIContext.Provider value={{ global, setGlobalData }}>
        {children}
      </EPIContext.Provider>
    );
  };