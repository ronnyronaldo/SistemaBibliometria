// import config from 'config';
const baseUrl = `http://localhost:8040/accounts`;
export const fetchWrapper = {
    get,
    post,
    postCore,
    postRefresh,
    put,
    authHeader,
    delete: _delete
}

function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}


function postRefresh(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function postCore(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', ...authHeader(url)},
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', ...authHeader(url)},
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {

            if ([401, 403].includes(response.status)) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                console.log("Error en el servicio");
            }

            const error = (data && data.mensajeUsuario) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
