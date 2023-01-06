
function getSession() {
    let userToken = "";
    let tokenString = "";
    tokenString = sessionStorage.getItem('token');
    userToken = JSON.parse(tokenString);
    if(!userToken)
    {
        tokenString = localStorage.getItem('token');
        userToken = JSON.parse(tokenString);
    }

    return userToken;
}

function setSession(mLogado, json) {
    if(mLogado)
        sessionStorage.setItem('token', JSON.stringify(json));
    else
        localStorage.setItem('token', JSON.stringify(json));
}

function getToken() {
    let tokenString = sessionStorage.getItem('tokenApi');
    return  JSON.parse(tokenString);
}

function setToken(json) {
    sessionStorage.setItem('tokenApi', JSON.stringify(json));
}

function getParam() {
    let tokenString = sessionStorage.getItem('param1');
    return  JSON.parse(tokenString);
}

function setParam(json) {
    sessionStorage.setItem('param1', JSON.stringify(json));
}

function deleteSession() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenApi');
    sessionStorage.removeItem('param1');
    localStorage.removeItem('listaVestimentas');
    localStorage.removeItem('token');
}

const Session = {
    getSession,
    setSession,
    getToken,
    setToken,
    getParam,
    setParam,
    deleteSession
}

export default Session