import React, { createContext, useEffect, useState } from "react";

const INITIAL_STATE = [
    (
        <div className="border" style={{padding: '13px 35px'}} key={`ListaVestimenta0`}>
            <div className="row">
                <div className="col-lg-12">
                    Nenhum item adicionado a lista de pedidos
                </div>
            </div>
        </div>
    )
];
  
  export const VestimentaContext = createContext({ global: INITIAL_STATE, setGlobalData: () => {} });
  
  // let children = React.ReactNode;

  export const VestimentaProvider = ({ children }) => {
    const [global, setGlobal] = useState(INITIAL_STATE);
  
    const setGlobalData = (_) => {
      
      let tokenString = localStorage.getItem('listaVestimentas');
      if(tokenString)
      {
        let listaVestimenta = JSON.parse(tokenString)

        if(listaVestimenta !== null && listaVestimenta.length > 0)
        {
          setGlobal(listaVestimenta.map((item, i) => {
            return(
              <div className="border" style={{padding: '13px 35px'}} key={`ListaVestimenta${i}`}>
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
                            
                            let listaVestimentaSession = JSON.parse(localStorage.getItem('listaVestimentas'));
                    
                            listaVestimentaSession.splice(i, 1);
                    
                            localStorage.removeItem('listaVestimentas');
                    
                            localStorage.setItem('listaVestimentas', JSON.stringify(listaVestimentaSession));
                    
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
              <div className="border" style={{padding: '13px 35px'}} key={`ListaVestimenta0`}>
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
      <VestimentaContext.Provider value={{ global, setGlobalData }}>
        {children}
      </VestimentaContext.Provider>
    );
  };