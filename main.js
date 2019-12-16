/* global Usuario, errores, excepcion, Trabajador, Extra, Cliente, Socio, Lavado */

/********************************BLOQUE CACHEOS********************************/
console.log(navigator.onLine);
//Cacheo
var mostrar = document.getElementById('mostrar');
var izquierdo = document.getElementById('izquierdo');
var idCheck = document.getElementById('idCheck');
var idCheckEdi = document.getElementById('idCheckEdi');
var idMatricula = document.getElementById('txtMatricula');
var txtFecha = document.getElementById('txtFecha');
var crud = document.getElementById('crud');
var usuarios = document.getElementById('usuarios');
var lava = document.getElementById('lava');
var extras = document.getElementById('extras');
var nomina = document.getElementById('nomina');
var txtDniCliente = document.getElementById('txtDniCliente');
var txtId = document.getElementById('txtId');
var txtMatriEdi = document.getElementById('txtMatriEdi');
var txtDniCliEdi = document.getElementById('txtDniCliEdi');
var txtTrabaEdi = document.getElementById('txtTrabaEdi');
var txtFecEdi = document.getElementById('txtFecEdi');
var txtFecIni = document.getElementById('txtFecIni');
var txtFecFin = document.getElementById('txtFecFin');
//var idCheckEdi = document.getElementById('idCheckEdi');

//Cacheo Select
var selTrabaja = document.getElementById('selTrabaja');
var selTraba = document.getElementById('selTraba');
var selLavado = document.getElementById('selLavado');
var seleUsuario = document.getElementById('seleUsuario');
var seleTipo = document.getElementById('seleTipo');

//Cacheo botones
var btnPrecio = document.getElementById('btnPrecio');
var btnCrudUsuarios = document.getElementById('btnCrudUsuarios');
var btnCrudExtras = document.getElementById('btnCrudExtras');
var btnCrudLavados = document.getElementById('btnCrudLavados');
var btnCarAjax = document.getElementById('btnCarAjax');
var btnGuaIndDB = document.getElementById('btnGuaIndDB');
var btnCarIndDB = document.getElementById('btnCarIndDB');
var btnNomina = document.getElementById('btnNomina');
var btnNomCal = document.getElementById('btnNomCal');

var btnAlta = document.getElementById('btnAlta');
var btnBaja = document.getElementById('btnBaja');
var btnEdit = document.getElementById('btnEdit');
var btnList = document.getElementById('btnList');

//Cacheo formularios
var formLavado = document.getElementsByTagName('form')[0];
var formUsuario = document.getElementsByTagName('form')[1];
var formExtras = document.getElementsByTagName('form')[2];
var formLava = document.getElementsByTagName('form')[3];
var formNomina = document.getElementsByTagName('form')[4];

//Si el localStorage no existe lo predeterminamos en español
localStorage.getItem("idioma") === null ? localStorage.setItem("idioma", "es") : localStorage.idioma;

//Creamos la base de datos
var db = new Dexie("dbLavadero");
db.version(1).stores({
    trabajadores: 'dni,nombre,apellidos,sueldoBase',
    clientes: 'dni,nombre,apellidos',
    socios: 'dni,nombre,apellidos,nacimiento',
    extras: 'id,nombre,precio,fecha,activo',
    lavados: 'id,matricula,dniCliente,dniTrabajador,fecha,extras,precioBase'
            // ...add more stores (tables) here...
});

db.open();
//Instanciamos la clase que va a contener el array de objetos
var listaDatos = new Lavadero();

//Función para ajustar el id de lavadero
function pad(n) {
    if (n < 10)
        n = "00" + n;
    else if (n >= 10)
        n = "0" + n;
    else
        n;
    return n;
}

/******************************BLOQUE CARGA AJAX*******************************/
//Hacemos la llamada ajax al json que contien los usuarios
var aTraba = [],
        aLava = [],
        aExt = [], //Arrays para la carga dinámica de de los select y checks del cálculo precio
        idLava = 0;
//btnCarAjax.addEventListener('click', function () {
limpiarSele();
limpiarCheck();
//Incluimos "async: false" para eliminar el asincronismo de la cargar, de manera que hasta que los datos no están cargados no continua el script
obtenerDatosServidor({
    url: 'assets/json/lavadoJSON.json',
    type: 'GET',
    async: false,
    parse: true,
    success: function (data) {
        //var aTraba = [];
        data.personas.trabajador.forEach(function (e) {
            listaDatos.agregarUsuario(
                    new Trabajador(e.dni, e.nombre, e.apellidos, e.sueldoBase)
                    );
            aTraba.push(e.dni);
        });
        cargaSelect(aTraba, selTrabaja);
        cargaSelect(aTraba, selTraba);
        data.personas.cliente.forEach(function (e) {
            listaDatos.agregarUsuario(
                    new Cliente(e.dni, e.nombre, e.apellidos)
                    );
        });

        data.personas.socio.forEach(function (e) {
            listaDatos.agregarUsuario(
                    new Socio(e.dni, e.nombre, e.apellidos, e.nacimiento)
                    );
        });

        //console.log(Object.keys(data.lavados)[0]);//Obtenemos la key del obj
        for (var i = 0, max = Object.keys(data.lavados).length; i < max; i++) {
            aLava.push(Object.keys(data.lavados)[i]);
        }

        data.lavados.Pequeño.forEach(function (e) {
            listaDatos.agregarLavado(
                    new Pequenho(e.id, e.matricula, e.dniCliente, e.dniTrabajador, e.fecha, e.extras, e.precioBase)
                    );
            idLava++;
        });

        data.lavados.Grande.forEach(function (e) {
            listaDatos.agregarLavado(
                    new Grande(e.id, e.matricula, e.dniCliente, e.dniTrabajador, e.fecha, e.extras, e.precioBase)
                    );
            idLava++;
        });

        data.lavados.Furgoneta.forEach(function (e) {
            listaDatos.agregarLavado(
                    new Furgoneta(e.id, e.matricula, e.dniCliente, e.dniTrabajador, e.fecha, e.extras, e.precioBase)
                    );
            idLava++;
        });
        //console.log(aLava);
        cargaSelect(aLava, selLavado);

        data.extras.forEach(function (e) {
            listaDatos.agregarExtra(
                    new Extra(e.id, e.nombre, e.precio, e.fecha, e.activo)
                    );
            aExt.push(e.nombre);
        });
        cargaCheck(aExt);

        listaDatos.guardarIndexedDBDexie();//Guardamos en la indexedDB los datos una vez acabada la carga en la RAM
    },
    error: {
        403: function () {
            "Forbidden access to testAjax.php";
        },
        404: function (errorCode, errorDescription) {
            alert("testAjax.php hasn't been found\n" + errorCode + ": " + errorDescription);
        },
        other: function (errorCode, errorDescription) {
            console.log("Unrecognized error\n" + errorCode + ": " + errorDescription);
        }
    }
});
//});

//******************************BLOQUE DE CREACIÓN ELEMENTOS DOM****************
//Carga los select de trabajadores y lavados dinámicamente
function cargaSelect(a, sel) {
    for (var i = 0; i < a.length; i++) {
        var opt = document.createElement('option');
        var texto = document.createTextNode(a[i]);
        opt.setAttribute('value', i);
        opt.appendChild(texto);
        sel.appendChild(opt);
    }
}

//Función cargar los checks
function cargaCheck(a) {
    for (var i = 0, max = a.length; i < max; i++) {
        var label = document.createElement("label");
        var ch = document.createElement("Input");
        var texto = document.createTextNode(a[i]);
        ch.setAttribute("type", "checkbox");
        ch.setAttribute("value", a[i]);
        ch.setAttribute("class", "elegido");
        label.appendChild(texto);
        idCheck.appendChild(label);
        idCheck.appendChild(ch);
    }
}

//Función cargar los checks para la edición
function cargaCheckEdicion(a) {
    for (var i = 0, max = a.length; i < max; i++) {
        var label = document.createElement("label");
        var ch = document.createElement("Input");
        var texto = document.createTextNode(a[i].nombre);
        ch.setAttribute("type", "checkbox");
        ch.setAttribute("value", a[i].nombre);
        ch.setAttribute("class", "elegido");
        ch.setAttribute("checked", "checked");
        label.appendChild(texto);
        idCheckEdi.appendChild(label);
        idCheckEdi.appendChild(ch);
    }
}

//Limpiar select trabajadores
function limpiarSele() {
    var opti1 = selTrabaja.options.length;
    for (var i = opti1; i > 1; i--) {
        selTrabaja.removeChild(selTrabaja.options[i - 1]);
        selTraba.removeChild(selTraba.options[i - 1]);
    }
}

//limpiar checkbox
function limpiarCheck() {
    while (idCheck.hasChildNodes())
        idCheck.removeChild(idCheck.lastChild);
}

//limpiar checkbox de Edicion
function limpiarCheckEdi() {
    while (idCheckEdi.hasChildNodes())
        idCheckEdi.removeChild(idCheckEdi.lastChild);
}

//Creamos los inputs genércios de los usuarios con el DOM
function formUsuGenericos() {
    var nuevo = document.createElement('label');
    var texto = document.createTextNode('DNI: ');
    nuevo.appendChild(texto);
    formUsuario.appendChild(nuevo);

    var nuevo = document.createElement('input');
    nuevo.setAttribute("id", "txtDni");
    formUsuario.appendChild(nuevo);

    var nuevo = document.createElement('label');
    var texto = document.createTextNode('Nombre: ');
    nuevo.appendChild(texto);
    formUsuario.appendChild(nuevo);

    var nuevo = document.createElement('input');
    nuevo.setAttribute("id", "txtNombre");
    formUsuario.appendChild(nuevo);

    var nuevo = document.createElement('label');
    var texto = document.createTextNode('Apellidos: ');
    nuevo.appendChild(texto);
    formUsuario.appendChild(nuevo);

    var nuevo = document.createElement('input');
    nuevo.setAttribute("id", "txtApellidos");
    formUsuario.appendChild(nuevo);

}

//Creamos el input específico de los usuarios
function inputUltimo(valor1, valor2) {
    var nuevo = document.createElement('label');
    var texto = document.createTextNode(valor1);
    nuevo.appendChild(texto);
    formUsuario.appendChild(nuevo);

    var nuevo = document.createElement('input');
    nuevo.setAttribute("id", valor2);
    formUsuario.appendChild(nuevo);
}

//Borramos los inputs de los usuarios
function limpiaUltInput() {
    var sel = formUsuario.childNodes.length;
    for (var i = sel; i > 6; i--) {
        formUsuario.removeChild(formUsuario.lastChild);
    }
}

//Esta variable esta de ámbito global para ser usada en seleUsuario,btnList,btnCrudUsuarios,btnCrudExtras
var opti = seleUsuario.options[seleUsuario.selectedIndex].value;

//El completa el formulario en función del usuario seleccionado
seleUsuario.addEventListener('change', function () {
    aTeclas = [];
    opti = seleUsuario.options[seleUsuario.selectedIndex].value;
    limpiaUltInput();

    if (opti == 0) {
        formUsuGenericos();
        inputUltimo("Sueldo Base", "txtSueldoBase");
        document.getElementById('txtDni').onkeypress = function (e) {
            buscarUsuario(e, "trabajador");
        };
        document.getElementById('txtDni').onblur = function (e) {
            completarCampos(e);
        };
    }
    else if (opti == 1) {
        formUsuGenericos();
        document.getElementById('txtDni').onkeypress = function (e) {
            buscarUsuario(e, "cliente");
        };
        document.getElementById('txtDni').onblur = function (e) {
            completarCampos(e);
        };
    }
    else if (opti == 2) {
        formUsuGenericos();
        inputUltimo("Nacimiento", "txtNacimiento");
        document.getElementById('txtDni').onkeypress = function (e) {
            buscarUsuario(e, "socio");
        };
        document.getElementById('txtDni').onblur = function (e) {
            completarCampos(e);
        };
    } else {
        opti = -1;
    }
});

//Mostramos el nuevo ingreso o modificación del objeto que corresponda. En respuesta nos llegará un objeto o un cero
function mostrarIngMod(respuesta, valor) {
    if (respuesta instanceof Usuario)
        mostrar.innerHTML = "<b>Usuario " + valor + ": </b><br/>" + respuesta.toString();
    else if (respuesta instanceof Extra)
        mostrar.innerHTML = "<b>Extra " + valor + ": </b><br/>" + respuesta.toString();
    else if (respuesta instanceof Lavado)
        mostrar.innerHTML = "<b>Lavado " + valor + ": </b><br/>" + respuesta.toString();
    else
        mostrar.innerHTML = respuesta;
}

//Array que va a contener los caracteres ingresados en el input
var aTeclas = [];
function buscarUsuario(e, tipoUsuario) {
    //formUsuario.reset();
    switch (e.keyCode) {
        case 8:
            aTeclas.pop();
            break;
        default:
            aTeclas.push(String.fromCharCode(e.which));//Obtenemos el carácter pulsado y lo añadimos al array
    }
    if (aTeclas.length == 3) {
        var valor = aTeclas.join("");
        var datos = listaDatos.localizaUsuario(valor, tipoUsuario);

        try {
            if (datos != '')
                mostrar.innerHTML = datos;
            else
                throw new LavaderoError(errores.ERROR_0007[localStorage.idioma]);
        } catch (excepcion) {
            mostrar.innerHTML = excepcion.message;
            return false;
        }
    }
    else if (aTeclas.length == 0) {
        mostrar.innerHTML = "";
        valor = "";
        tipoUsuario = "";
    }
}

//Completamos el resto de campos del usuario que vamos a editar
var result;
function completarCampos(/*e*/) {
    if (opti == 0) {
        result = listaDatos.busUserEdiciElimin(formUsuario.elements[1].value, 0);
        if (typeof result === 'string')
            mostrar.innerHTML = result;
        else {
            mostrar.innerHTML = result;
            formUsuario[1].value = result.dni;
            formUsuario[2].value = result.nombre;
            formUsuario[3].value = result.apellidos;
            formUsuario[4].value = result.sueldoBase;
        }
    } else if (opti == 1) {
        result = listaDatos.busUserEdiciElimin(formUsuario.elements[1].value, 1);
        if (typeof result === 'string')
            mostrar.innerHTML = result;
        else {
            mostrar.innerHTML = result;
            formUsuario[1].value = result.dni;
            formUsuario[2].value = result.nombre;
            formUsuario[3].value = result.apellidos;
        }
    } else if (opti == 2) {
        result = listaDatos.busUserEdiciElimin(formUsuario.elements[1].value, 2);
        if (typeof result === 'string')
            mostrar.innerHTML = result;
        else {
            mostrar.innerHTML = result;
            formUsuario[1].value = result.dni;
            formUsuario[2].value = result.nombre;
            formUsuario[3].value = result.apellidos;
            formUsuario[4].value = result.nacimiento;
        }
    } else if (opti == "lavado") {
        result = listaDatos.busUserEdiciElimin(formLava.elements[0].value, "lavado");
        if (typeof result === 'string')
            mostrar.innerHTML = result;
        else {
            mostrar.innerHTML = result;
            if (result.precioBase == 16.5)
                seleTipo.value = 0;
            else if (result.precioBase == 18.5)
                seleTipo.value = 1;
            else
                seleTipo.value = 2;
            formLava[2].value = result.matricula;
            formLava[3].value = result.dniCliente;
            formLava[4].value = result.dniTrabajador;
            formLava[5].value = result.fecha;
            limpiarCheckEdi();
            result.extras == null ? null : cargaCheckEdicion(result.extras);
        }
    }
}

//*****************************BLOQUE VALIDACIONES*****************************/
//Validamos campos trabajador
function valiCamposTrabaja() {
    try {
        var validarDni = new RegExp('^[0-9]{8}[A-Z]$');
        if (!validarDni.test(formUsuario[1].value))
            throw new LavaderoError(errores.ERROR_0004[localStorage.idioma]);
    } catch (excepcion) {
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    if (formUsuario[2].value == '') {
        mostrar.innerHTML = "El nombre es requerido";
        return false;
    } else if (formUsuario[3].value == '') {
        mostrar.innerHTML = "Los apellidos son requeridos";
        return false;
    }
    try {
        var validarSueldo = new RegExp('^[0-9]{3,4}$');
        if (!validarSueldo.test(parseFloat(formUsuario[4].value)))
            throw new LavaderoError(errores.ERROR_0009[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    return true;
}

//Validamos campos cliente
function valiCamposCliente() {
    try {
        var validarDni = new RegExp('^[0-9]{8}[A-Z]$');
        if (!validarDni.test(formUsuario[1].value))
            throw new LavaderoError(errores.ERROR_0004[localStorage.idioma]);
    } catch (excepcion) {
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    if (formUsuario[2].value == '') {
        mostrar.innerHTML = "El nombre es requerido";
        return false;
    } else if (formUsuario[3].value == '') {
        mostrar.innerHTML = "Los apellidos son requeridos";
        return false;
    } else
        return true;
}

//Validamos campos Socio
function valiCamposSocio() {
    try {
        var validarDni = new RegExp('^[0-9]{8}[A-Z]$');
        if (!validarDni.test(formUsuario[1].value))
            throw new LavaderoError(errores.ERROR_0004[localStorage.idioma]);
    } catch (excepcion) {
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    if (formUsuario[2].value == '') {
        mostrar.innerHTML = "El nombre es requerido";
        return false;
    } else if (formUsuario[3].value == '') {
        mostrar.innerHTML = "Los apellidos son requeridos";
        return false;
    }
    try {
        var validarFecha = new RegExp('^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{4}$');
        if (!validarFecha.test(formUsuario[4].value))
            throw new LavaderoError(errores.ERROR_0002[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    return true;
}

//Validamos los campos de extra
function valiCamposExtra() {
    if (formExtras[0].value == '') {
        mostrar.innerHTML = "El id es requerido solo valores numéricos";
        return false;
    } else if (formExtras[1].value == '') {
        mostrar.innerHTML = "El nombre es requerido";
        return false;
    }
    try {
        var validarPrecio = new RegExp('^[0-9]{2}$');
        if (!validarPrecio.test(parseFloat(formExtras[2].value)))
            throw new LavaderoError(errores.ERROR_0010[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    try {
        var validarFecha = new RegExp('^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{4}$');
        if (!validarFecha.test(formExtras[3].value))
            throw new LavaderoError(errores.ERROR_0002[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    return true;
}

//Validamos los campos edición lavados
function valiCamposLava() {
    var selTipo = seleTipo.options[seleTipo.selectedIndex].value;
    if (formLava[0].value == '') {
        mostrar.innerHTML = "El id es requerido solo valores numéricos";
        return false;
    }
    try {
        var validarMatricula = new RegExp('^[0-9]{4}[A-Z]{3}$');
        if (!validarMatricula.test(formLava[2].value))
            throw new LavaderoError(errores.ERROR_0008[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    try {
        var validarDni = new RegExp('^[0-9]{8}[A-Z]$');
        if (!validarDni.test(formLava[3].value))
            throw new LavaderoError(errores.ERROR_0004[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    try {
        var validarDni = new RegExp('^[0-9]{8}[A-Z]$');
        if (!validarDni.test(formLava[4].value))
            throw new LavaderoError(errores.ERROR_0004[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    try {
        var validarFecha = new RegExp('^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{4}$');
        if (!validarFecha.test(formLava[5].value))
            throw new LavaderoError(errores.ERROR_0002[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    if (selTipo == -1) {
        mostrar.innerHTML = "Debe seleccionar el lavado";
        return false;
    } else
        return true;
}

//Validar campo dni usuario para su eliminación
function valiCampoElim(dniOid, tipo) {
    if (opti == 0 || opti == 1 || opti == 2) {
        var respBus = listaDatos.busUserEdiciElimin(dniOid, tipo);
        if (dniOid == '') {
            mostrar.innerHTML = "Debe completar el campo Dni";
            return false;
        } else if (typeof respBus === 'string') {
            mostrar.innerHTML = respBus;
            return false;
        } else
            return true;
    }
}

var valSelLav,
        valSelTra;
//Comprobamos que todos los campos esten completos
function valiCamposPrecio() {
    valSelTra = selTrabaja.options[selTrabaja.selectedIndex].value;
    try {
        var validarMatricula = new RegExp('^[0-9]{4}[A-Z]{3}$');
        if (!validarMatricula.test(formLavado[1].value))
            throw new LavaderoError(errores.ERROR_0008[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    try {
        var validarDni = new RegExp('^[0-9]{8}[A-Z]$');
        if (!validarDni.test(formLavado[2].value))
            throw new LavaderoError(errores.ERROR_0004[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    try {
        var validarFecha = new RegExp('^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{4}$');
        if (!validarFecha.test(formLavado[4].value))
            throw new LavaderoError(errores.ERROR_0002[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    if (valSelTra == -1) {
        mostrar.innerHTML = "Debe seleccionar el trabajador";
        return false;
    } else
        return true;
}

function validarNomina() {
    try {
        var validarFechaIni = new RegExp('^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{4}$');
        if (!validarFechaIni.test(formNomina[1].value))
            throw new LavaderoError(errores.ERROR_0002[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    try {
        var validarFechaFin = new RegExp('^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{4}$');
        if (!validarFechaFin.test(formNomina[2].value))
            throw new LavaderoError(errores.ERROR_0002[localStorage.idioma]);
    } catch (excepcion) {
        console.log(excepcion.message);
        mostrar.innerHTML = excepcion.message;
        return false;
    }
    return true;
}

//Confirmación de eliminación
function confirEliminacion() {
    var conf = false;
    if (confirm("Desea realmente eliminar") == true)
        conf = true;
    return conf;
}

//Función en la que pedimos la confimación de la eliminación y eliminamos los usuarios
function eliminacionUsuario(dniOid, tipo) {
    var resp = confirEliminacion();
    if (resp) {
        var respuesta = listaDatos.eliminarUsuario(dniOid, tipo);
        mostrar.innerHTML = '';
        if (typeof (respuesta) === 'object') {
            mostrar.innerHTML = respuesta + '<br/> <b>Ha sido eliminado</b>';
            //opti =-1;
            actualizaArray(dniOid, aTraba);//Actualizamos el array aTraba (trabajadores)
            limpiarSele();
            cargaSelect(aTraba, selTrabaja);//Cargamos el trabajador modificado en el select
            cargaSelect(aTraba, selTraba);
            return 1;
        }
        else
            mostrar.innerHTML = respuesta;
    } else {
        opti = -1;
        limpiaUltInput();
        formUsuario.reset();
        mostrar.innerHTML = "Eliminación cancelada";
        return 0;
    }

}

//Actualizamos el array aTraba
function actualizaArray(dniOid, a) {
    var i = 0,
            encontrado = false,
            lon = a.length;
    while (!encontrado && i < lon) {
        if (a[i] == dniOid) {
            a.splice(i, 1);
            encontrado = true;
        }
        i++;
    }
}

//*********************************BLOQUE CRUD*********************************/
//Reset de los formularios
var resetForm = function () {
    limpiaUltInput();
    formUsuario.reset();
    formExtras.reset();
    formLava.reset();
    formNomina.reset();
};

//ALTAS
btnAlta.addEventListener('click', function () {
    var valor = "Nuevo";
    var nuevaAlta;
    if (opti == -1) {
        mostrar.innerHTML = "Debes hacer una selección";
    } else if (opti == 0) {
        if (valiCamposTrabaja()) {
            nuevaAlta = new Trabajador(formUsuario[1].value, formUsuario[2].value, formUsuario[3].value, parseInt(formUsuario[4].value));
            var resultado = listaDatos.agregarUsuario(nuevaAlta);
            mostrarIngMod(resultado, valor);
            if (typeof resultado != 'string') {//En el caso de pulsar el botón alta y el trabajador exista no lo carge en el array aTraba
                db.trabajadores.put({dni: formUsuario[1].value, nombre: formUsuario[2].value, apellidos: formUsuario[3].value, sueldo: parseInt(formUsuario[4].value)});
                aTraba.push(formUsuario[1].value);
                limpiarSele();
                cargaSelect(aTraba, selTrabaja);//Cargamos el nuevo trabajador en el select
                cargaSelect(aTraba, selTraba);
            }
            limpiaUltInput();
            formUsuario.reset();
            opti = -1;
        }
    } else if (opti == 1) {
        if (valiCamposCliente()) {
            nuevaAlta = new Cliente(formUsuario[1].value, formUsuario[2].value, formUsuario[3].value);
            var resultado = listaDatos.agregarUsuario(nuevaAlta);
            mostrarIngMod(resultado, valor);
            if (typeof resultado != 'string') //En el caso de pulsar el botón alta y el Socio exista no lo carge en la indexedBD
                db.clientes.put({dni: formUsuario[1].value, nombre: formUsuario[2].value, apellidos: formUsuario[3].value});
            limpiaUltInput();
            formUsuario.reset();
            opti = -1;
        }
    } else if (opti == 2) {
        if (valiCamposSocio()) {
            nuevaAlta = new Socio(formUsuario[1].value, formUsuario[2].value, formUsuario[3].value, formUsuario[4].value);
            var resultado = listaDatos.agregarUsuario(nuevaAlta);
            mostrarIngMod(resultado, valor);
            if (typeof resultado != 'string') //En el caso de pulsar el botón alta y el Socio exista no lo carge en la indexedBD
                db.socios.put({dni: formUsuario[1].value, nombre: formUsuario[2].value, apellidos: formUsuario[3].value, nacimiento: formUsuario[4].value});
            limpiaUltInput();
            formUsuario.reset();
            opti = -1;
        }
    } else if (opti == "extra") {
        if (valiCamposExtra()) {
            nuevaAlta = new Extra(formExtras[0].value, formExtras[1].value, parseInt(formExtras[2].value), formExtras[3].value, true);
            var idKey;
            db.extras.put({id: formExtras[0].value, nombre: formExtras[1].value, precio: parseInt(formExtras[2].value), fecha: formExtras[3].value, activo: true});
            db.extras
                    .where('nombre').equalsIgnoreCase(formExtras[1].value)
                    .modify(function (extras) {
                        if (formExtras[3].value != extras.fecha)
                            extras.activo = false;
                    });

            var resultado = listaDatos.agregarExtraPost(nuevaAlta);
            mostrarIngMod(resultado, valor);
            if (typeof resultado != 'string') {//En el caso de pulsar el botón alta y el extra existe no lo carge en el array aExt               
                limpiarCheck();
                cargaCheck(listaDatos.extrasActivos());//Obtenemos la lista con lo extras activos
            }
            formExtras.reset();
            aTeclas = [];
        }
    }
});

//BAJAS
btnBaja.addEventListener('click', function () {
    if (opti == -1) {
        mostrar.innerHTML = "Debes hacer una selección";
    } else {
        if (opti == 0) {
            if (valiCampoElim(formUsuario[1].value, 0)) {
                var resp = eliminacionUsuario(formUsuario[1].value, 0);
                if (resp == 1) {
                    db.trabajadores
                            .where('dni').equalsIgnoreCase(formUsuario[1].value)
                            .delete();
                }
            }
        } else if (opti == 1) {
            if (valiCampoElim(formUsuario[1].value, 1)) {
                var resp = eliminacionUsuario(formUsuario[1].value, 1);
                if (resp == 1) {
                    db.clientes
                            .where('dni').equalsIgnoreCase(formUsuario[1].value)
                            .delete();
                }
            }
        } else if (opti == 2) {
            if (valiCampoElim(formUsuario[1].value, 2)) {
                var resp = eliminacionUsuario(formUsuario[1].value, 2);
                if (resp == 1) {
                    db.socios
                            .where('dni').equalsIgnoreCase(formUsuario[1].value)
                            .delete();
                }
            }
        }
        aTeclas = [];
        opti = -1;
        limpiaUltInput();
        formUsuario.reset();
    }
});

//EDITAR --- Pendiente DEXIE
btnEdit.addEventListener('click', function () {
    var valor = "editado";
    if (opti == -1) {
        mostrar.innerHTML = "Debes hacer una selección";
    } else if (opti == 0) {
        if (valiCamposTrabaja()) {
            result.dni = formUsuario[1].value;
            result.nombre = formUsuario[2].value;
            result.apellidos = formUsuario[3].value;
            result.sueldoBase = formUsuario[4].value;
            aTraba.push(formUsuario[1].value);
            actualizaArray(formUsuario[1].value, aTraba);//Actualizamos el array aTraba (trabajadores)
            limpiarSele();
            cargaSelect(aTraba, selTrabaja);//Cargamos el trabajador modificado en el select
            cargaSelect(aTraba, selTraba);
            mostrarIngMod(result, valor);
            db.trabajadores
                    .where('dni').equalsIgnoreCase(formUsuario[1].value)
                    .modify(function (trabajador) {
                        trabajador.nombre = result.nombre;
                        trabajador.apellidos = result.apellidos;
                        trabajador.sueldoBase = result.sueldoBase;
                    });
            limpiaUltInput();
            formUsuario.reset();
            opti = -1;
        }
    } else if (opti == 1) {
        if (valiCamposCliente()) {
            result.dni = formUsuario[1].value;
            result.nombre = formUsuario[2].value;
            result.apellidos = formUsuario[3].value;
            mostrarIngMod(result, valor);
            db.clientes
                    .where('dni').equalsIgnoreCase(formUsuario[1].value)
                    .modify(function (clientes) {
                        clientes.nombre = result.nombre;
                        clientes.apellidos = result.apellidos;
                    });
            limpiaUltInput();
            formUsuario.reset();
            opti = -1;
        }
    } else if (opti == 2) {
        if (valiCamposSocio()) {
            result.dni = formUsuario[1].value;
            result.nombre = formUsuario[2].value;
            result.apellidos = formUsuario[3].value;
            result.nacimiento = formUsuario[4].value;
            mostrarIngMod(result, valor);
            db.socios
                    .where('dni').equalsIgnoreCase(formUsuario[1].value)
                    .modify(function (socios) {
                        socios.nombre = result.nombre;
                        socios.apellidos = result.apellidos;
                        socios.sueldoBase = result.nacimiento;
                    });
            limpiaUltInput();
            formUsuario.reset();
            opti = -1;
        }
    } else if (opti == "lavado") {
        if (valiCamposLava()) {
            result.id = formLava[0].value;
            result.matricula = formLava[2].value;
            result.dniCliente = formLava[3].value;
            result.dniTrabajador = formLava[4].value;
            result.fecha = formLava[5].value;
            result.extras = obtenerCheck();
            var tipo = seleTipo.options[seleTipo.selectedIndex].text;
            if (tipo == "Pequeño")
                tipo = 16.5;
            else if (tipo == "Grande")
                tipo = 18.5;
            else
                tipo = 22.5;
            result.precioBase = tipo;
            mostrarIngMod(result, valor);
            db.lavados
                    .where('id').equalsIgnoreCase(formLava[0].value)
                    .modify(function (lavados) {
                        lavados.matricula = result.matricula;
                        lavados.dniCliente = result.dniCliente;
                        lavados.dniTrabajador = result.dniTrabajador;
                        lavados.fecha = result.fecha;
                        lavados.extras = result.extras;
                        lavados.precioBase= result.precioBase;
                    });
            limpiarCheckEdi();
            formLava.reset();
        }
    }
});

//LISTADOS ---
btnList.addEventListener('click', function () {

    if (opti == 0) {
        mostrar.style.display = 'inline';
        var datos = listaDatos.listarTrabajadores();
        mostrar.innerHTML = datos;
    } else if (opti == 1) {
        mostrar.style.display = 'inline';
        var datos = listaDatos.listarClientes();
        mostrar.innerHTML = datos;
    } else if (opti == 2) {
        mostrar.style.display = 'inline';
        var datos = listaDatos.listarSocios();
        mostrar.innerHTML = datos;
    } else if (opti == -1) {
        mostrar.style.display = 'inline';
        var datos = listaDatos.listarTrabajadores();
        datos += listaDatos.listarClientes();
        datos += listaDatos.listarSocios();
        mostrar.innerHTML = datos;
    } else if (opti == "extra") {
        mostrar.style.display = 'inline';
        var datos = listaDatos.listarExtras();
        mostrar.innerHTML = datos;
    } else if (opti == "lavado") {
        mostrar.style.display = 'inline';
        var datos = listaDatos.listarLavados();
        mostrar.innerHTML = datos;
    }
});

//Botones para la elección del tipo de objeto sobre el que vamos a realizar el CRUD
btnCrudUsuarios.addEventListener('click', function () {
    opti = seleUsuario.options[seleUsuario.selectedIndex].value;
    usuarios.style.display = "block";
    extras.style.display = "none";
    lava.style.display = "none";
    nomina.style.display = "none";
    btnAlta.style.display = "inline";
    btnBaja.style.display = "inline";
    btnEdit.style.display = "inline";
    btnList.style.display = "inline";
    mostrar.innerHTML = '';
    formLava.reset();
    limpiarCheckEdi();
});

btnCrudExtras.addEventListener('click', function () {
    aTeclas = [];
    opti = "extra";
    //crud.style.display = "block";
    extras.style.display = "block";
    usuarios.style.display = "none";
    lava.style.display = "none";
    nomina.style.display = "none";
    btnAlta.style.display = "inline";
    btnList.style.display = "inline";
    btnBaja.style.display = "none";
    btnEdit.style.display = "none";
    mostrar.innerHTML = '';
    resetForm();
    limpiarCheckEdi();

    document.getElementById('txtIdExtra').onblur = function (e) {
        completarCampos(e);
    };
    document.getElementById('txtIdExtra').onkeypress = function (e) {
        buscarUsuario(e, "extra");
    };
});

btnCrudLavados.addEventListener('click', function () {
    aTeclas = [];
    opti = "lavado";
    //crud.style.display = "block";
    mostrar.innerHTML = '';
    lava.style.display = "block";
    extras.style.display = "none";
    usuarios.style.display = "none";
    nomina.style.display = "none";
    btnEdit.style.display = "inline";
    btnAlta.style.display = "none";
    btnBaja.style.display = "none";
    btnList.style.display = "inline";
    resetForm();

    document.getElementById('txtId').onblur = function (e) {
        completarCampos(e);
    };
    document.getElementById('txtId').onkeypress = function (e) {
        buscarUsuario(e, "lavado");
    };
});

btnNomina.addEventListener('click', function () {
    nomina.style.display = "block";
    btnAlta.style.display = "none";
    btnBaja.style.display = "none";
    btnEdit.style.display = "none";
    btnList.style.display = "none";
    usuarios.style.display = "none";
    lava.style.display = "none";
    extras.style.display = "none";
    mostrar.innerHTML = '';
    resetForm();
    limpiarCheckEdi();
});

//********************BLOQUE CÁLCULO PRECIO Y ALTA LAVADO**********************/

//Tomamos el resto de los datos del extra para poder enviarlo a la clase Lavado del mismo modo en que estan formados en el json
var restoDatosExtra = function (lista) {
    var ext = [];
    for (var i = 0, max = lista.length; i < max; i++) {
        var obj = listaDatos.busExt(lista[i]);
        ext.push(obj);
    }
    return ext;
};

//Obtener checks checked
var obtenerCheck = function () {
    var listExt = document.getElementsByClassName("elegido");//Obtenemos los check checked
    var listaCheck = [];
    for (var i = 0, max = listExt.length; i < max; i++)
        if (listExt[i].checked == true)
            listaCheck.push(listExt[i].value);

    //Operador ternario simplificado
    return listaCheck.length == 0 ? null : restoDatosExtra(listaCheck);
};

//Comprobamos si el Cliente o Socio existe para darlo de alta o no
var compCliSocio = function (dni) {
    return cliSocio = listaDatos.busqUserFact(dni);
};

//Hacemos la busqueda del cliente o socio cuando vamos a facturar
txtDniCliente.onkeypress = function (e) {
    var u = buscarUsuario(e, "socio");
    if (!u && typeof u != "undefined") {
        if (aTeclas.length == 3) {
            aTeclas.pop();
            buscarUsuario(e, "cliente");
        }
    }
};

//Función para obtener y mostrar los extras
var mostrarExtras = function (ext, obj) {
    //var fact;
    var divFactura = document.createElement('div');
    var h = document.createElement('h4');
    var fact = document.createTextNode("Cliente: " + obj.nombre);

    divFactura.appendChild(h);
    h.appendChild(fact);

    if (ext != null) {
        ext.forEach(function (e) {
            var p = document.createElement('div');
            var extr = document.createTextNode("Extra: " + e.nombre);
            p.appendChild(extr);
            divFactura.appendChild(p);

            var p = document.createElement('div');
            var extr = document.createTextNode("Precio: " + e.precio);
            p.appendChild(extr);
            divFactura.appendChild(p);
        });
    } else {
        var p = document.createElement('div');
        var extr = document.createTextNode("El cliente no lleva extras");
        p.appendChild(extr);
        divFactura.appendChild(p);
    }
    mostrar.appendChild(divFactura);
};

//Mostramos el total
var total = function (lav) {
    if (lav instanceof Lavado) {
        var p = document.createElement('p');
        var b = document.createElement('b');
        p.appendChild(b);
        var extr = document.createTextNode("Total: " + lav.calcularPrecio());
        b.appendChild(extr);
        mostrar.appendChild(p);
    }
};

//Aviso cliente no existe
var noExisteCliSoc = function () {
    mostrar.innerHTML = "Debe crear el Cliente antes de facturar";
    formLavado.reset();
};

btnPrecio.addEventListener('click', function () {
    limpiarCheckEdi(); //por si se queda sin limpiar y se factura un lavado cogerá los check si hay alguno

    var altaLavado,
            objeto,
            valor = "nuevo",
            valSelLav = selLavado.options[selLavado.selectedIndex].value,
            valSelTraText = selTrabaja.options[selTrabaja.selectedIndex].text,
            extras = obtenerCheck();

    if (valSelLav == -1) {
        mostrar.innerHTML = "Debe seleccionar un lavado";
    } else {
        if (valSelLav == 0) {
            if (valiCamposPrecio()) {
                objeto = compCliSocio(formLavado[2].value);
                if (objeto) {
                    altaLavado = new Pequenho(pad(parseInt(idLava) + 1), formLavado[1].value, formLavado[2].value, valSelTraText, formLavado[4].value, extras, null);
                    listaDatos.agregarLavado(altaLavado);
                    db.lavados.put({id: pad(parseInt(idLava) + 1), matricula: formLavado[1].value, dniCliente: formLavado[2].value, dniTrabajador: valSelTraText, fecha: formLavado[4].value, extras: extras, precioBase: 16.5});
                    mostrarIngMod(altaLavado, valor);
                    formLavado.reset();
                    idLava++;
                } else
                    noExisteCliSoc();
                aTeclas = [];
            }
        } else if (valSelLav == 1) {
            if (valiCamposPrecio()) {
                objeto = compCliSocio(formLavado[2].value);
                if (objeto) {
                    altaLavado = new Grande(pad(parseInt(idLava) + 1), formLavado[1].value, formLavado[2].value, valSelTraText, formLavado[4].value, extras, null);
                    db.lavados.put({id: pad(parseInt(idLava) + 1), matricula: formLavado[1].value, dniCliente: formLavado[2].value, dniTrabajador: valSelTraText, fecha: formLavado[4].value, extras: extras, precioBase: 18.5});
                    listaDatos.agregarLavado(altaLavado);
                    mostrarIngMod(altaLavado, valor);
                    formLavado.reset();
                    idLava++;
                } else
                    noExisteCliSoc();
                aTeclas = [];
            }
        } else if (valSelLav == 2) {
            if (valiCamposPrecio()) {
                objeto = compCliSocio(formLavado[2].value);
                if (objeto) {
                    altaLavado = new Furgoneta(pad(parseInt(idLava) + 1), formLavado[1].value, formLavado[2].value, valSelTraText, formLavado[4].value, extras, null);
                    db.lavados.put({id: pad(parseInt(idLava) + 1), matricula: formLavado[1].value, dniCliente: formLavado[2].value, dniTrabajador: valSelTraText, fecha: formLavado[4].value, extras: extras, precioBase: 22.5});
                    listaDatos.agregarLavado(altaLavado);
                    mostrarIngMod(altaLavado, valor);
                    formLavado.reset();
                    idLava++;
                } else
                    noExisteCliSoc();
                aTeclas = [];
            }
        }
    }
    aTeclas = [];

    if (objeto) {
        mostrarExtras(extras, objeto);
        total(altaLavado);
    }
});

//Calculamos la nómina del trabajador // *******  ESTE CÁLCULO HA DE HACERSE EN EL CONTROLADOR   **********//compCliSocio,restoDatosExtra
btnNomCal.addEventListener('click', function () {
    var valSelTraCal = selTraba.options[selTraba.selectedIndex].value,
            valSelTraCalText = selTraba.options[selTraba.selectedIndex].text;

    if (valSelTraCal == -1) {
        mostrar.innerHTML = "Debe seleccionar un trabajador";
    } else {
        if (validarNomina()) {
            mostrar.innerHTML = listaDatos.calculoNomina(valSelTraCalText, formNomina[1].value, formNomina[2].value);
            formNomina.reset();
        }
    }
});

//Guardamos los datos en la indexedDB
btnGuaIndDB.addEventListener('click', function () {
    listaDatos.guardarIndexedDBDexie();
});

//Cargamos los datos desde la indexedDB
btnCarIndDB.addEventListener('click', function () {

    db.trabajadores.each(function (e) {
        listaDatos.agregarUsuario(new Trabajador(e.dni, e.nombre, e.apellidos, e.sueldo));
    });
    db.socios.each(function (e) {
        listaDatos.agregarUsuario(new Socio(e.dni, e.nombre, e.apellidos, e.nacimiento));
    });
    db.clientes.each(function (e) {
        listaDatos.agregarUsuario(new Cliente(e.dni, e.nombre, e.apellidos));
    });
    db.extras.each(function (e) {
        listaDatos.agregarExtraPost(new Extra(e.id, e.nombre, e.precio, e.fecha, e.activo));
    });
    db.lavados.each(function (e) {
        listaDatos.agregarLavado(new Lavado(e.id, e.matricula, e.dniCliente, e.dniTrabajador, e.fecha, e.extras, e.precioBase));
    });
});

