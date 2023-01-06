import env from "react-dotenv";
import Session from "./Session";

const BASE_URL = (env.API_PORT !== "") ? `${env.API_HOST}:${env.API_PORT}/api` : `${env.API_HOST}/api`;

async function queryGet(url) {
    let token = await Session.getToken();
    return fetch(BASE_URL+url, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer ' + token.token,
          'Content-Type': 'application/json'
        },
    }).then(async (req) => {
        if(req.status === 401)
        {
          return req.status;
        }
        else
        {
          let ret = await req.json();
          if(req.ok) {        
            return ret;
          } else {
            return ret;
          }
        }
    }).catch(function(error) {      
        return { result: false, message: 'Impossível comunicar com o servidor.' };
    });
}

async function queryPostLogin(url, data) {
    return fetch(BASE_URL+url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(async (req) => {
        let ret = await req.json();
        if(req.ok) {        
          return ret;
        } else {
          return ret;
        }
    }).catch(function(error) {      
        return { result: false, message: 'Impossível comunicar com o servidor.' };
    });
}

async function queryPost(url, data) {
    let token = await Session.getToken();
    return fetch(BASE_URL+url, {
        method: 'POST',
        headers: {
          'authorization': 'Bearer ' + token.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(async (req) => {
        let ret = await req.json();
        if(req.ok) {        
          return ret;
        } else {
          return ret;
        }
    }).catch(function(error) {      
        return { result: false, message: 'Impossível comunicar com o servidor.' };
    });
}

async function queryPostForm(url, data) {
  let token = await Session.getToken();
  return fetch(BASE_URL+url, {
      method: 'POST',
      headers: {
        'authorization': 'Bearer ' + token.token,
      },
      body: data,
  }).then(async (req) => {
      let ret = await req.json();
      if(req.ok) {        
        return ret;
      } else {
        return ret;
      }
  }).catch(function(error) {      
      return { result: false, message: 'Impossível comunicar com o servidor.' };
  });
}

async function queryPut(url, data) {
    let token = await Session.getToken();
    return fetch(BASE_URL+url, {
        method: 'PUT',
        headers: {
          'authorization': 'Bearer ' + token.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(async (req) => {
        let ret = await req.json();
        if(req.ok) {        
          return ret;
        } else {
          return ret;
        }
    }).catch(function(error) {      
        return { result: false, message: 'Impossível comunicar com o servidor.' };
    });
}

async function queryPutForm(url, data) {
  let token = await Session.getToken();
  return fetch(BASE_URL+url, {
      method: 'PUT',
      headers: {
        'authorization': 'Bearer ' + token.token,
      },
      body: data,
  }).then(async (req) => {
      let ret = await req.json();
      if(req.ok) {        
        return ret;
      } else {
        return ret;
      }
  }).catch(function(error) {      
      return { result: false, message: 'Impossível comunicar com o servidor.' };
  });
}

async function queryDelete(url) {
    let token = Session.getToken();
    return fetch(BASE_URL+url, {
        method: 'DELETE',
        headers: {
          'authorization': 'Bearer ' + token.token,
          'Content-Type': 'application/json'
        },
    }).then(async (req) => {
        let ret = await req.json();
        
        return ret;
    }).catch(function(error) {      
        return { result: false, message: 'Impossível comunicar com o servidor.' };
    });
}

async function getToken() {
  let token = await Session.getToken();
  return fetch(BASE_URL+'/controllerlogin/token/', {
    method: 'PUT',
    headers: {
      'authorization': 'Bearer ' + token.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token: token.token}),
}).then(async (req) => {
    if(req.status === 401)
    {
      sessionStorage.setItem('reload', JSON.stringify({reload: true}));
      return req;
    }
    else if(req.status === 200)
    {
      let ret = await req.json();
    
      if(req.ok) { 
        Session.setToken({token: ret.token, data: new Date()});
        return ret.token;
      } else {
        return ret;
      }
    }
    else
    {
      Session.deleteSession();
    }
}).catch(function(error) {      
    return { result: false, message: 'Impossível comunicar com o servidor.' };
});
}

const Api = {
    queryGet,
    queryPost,
    queryPostLogin,
    queryPostForm,
    queryPut,
    queryPutForm,
    queryDelete,
    getToken
}

export default Api