export const validacionInputService = {
    campoVacio,
    esDecimal
};

function esEntero(texto, mensaje) {
    let regex = /^\d{1,99999999999999999999999999999999999999999999999}$/;
    if (regex.test(texto)) {
        return true;
    }
    return false;
}
function esNumero(texto){
    let regex = /^([0-9])*$/;
    if (regex.test(texto)) {
        return true;
    }
    return false;
}
function esDecimalSinMensaje(texto) {
    let regex = /^\d+(\.\d{1,2})?$/;
    if (regex.test(texto)) {
        return true;
    }
    return false;
}

function esDecimal(texto) {
    let regex = /^\d+(\.\d{1,2})?$/;
    if (regex.test(texto)) {
        return true;
    }
    return false;
}

function formatoDecimal(texto) {
    return texto.replace(".", ",");
}

function validacionCedula(texto) {
    let regex = /^[0-9]{10}$/;
    if (!regex.test(texto)) {
        return false;
    }
    return true;
}

function validacionRUC(texto) {
    let regex = /^[0-9]{13}$/;
    if (!regex.test(texto)) {
        return false;
    }
    return true;
}

function validacionPasaporte(texto) {
    let regex = /^[a-zA-Z0-9]{3,15}$/;
    if (!regex.test(texto)) {
        return false;
    }
    return true;
}

function validacionEmail(texto) {
    let regex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(texto)) {
        return false;
    }
    return true;
}

function validacionSinCaracteresEspeciales(texto, campo) {
    let regex = /^[A-Za-z0-9\s]+$/g;
    if (!regex.test(texto)) {
        return false;
    }
    return true;
}

function validacionNombreUsuario(texto) {
    let regex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{5,}$/;
    if (!regex.test(texto)) {
        return false;
    }
    return true;
}

function validacionClave(texto) {
    let regex = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/;
    if (!regex.test(texto)) {
        return false;
    }
    return true;
}

function validacionFrase(texto) {
    if (texto.length < 5) {
        return false;
    }
    return true;
}

function campoVacio(texto, mensaje) {
    if (texto === "") {
        return false;
    }
    return true;
}
