export const validacionInputService = {
    campoVacio,
    esDecimal,
    valorColor
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

function valorColor(valor){
    if(valor == 1) return "blue"
    if(valor == 2) return "green"
    if(valor == 3) return "orange"
    if(valor == 4) return "red"
    if(valor == 5) return "black"
    if(valor == 6) return "cyan"
    if(valor == 7) return "pink"
    if(valor == 8) return "blue"
    if(valor == 9) return "blue"
    if(valor == 10) return "blue"
    if(valor == 11) return "blue"
    if(valor == 12) return "blue"
    if(valor == 13) return "blue"
    if(valor == 14) return "blue"
}
