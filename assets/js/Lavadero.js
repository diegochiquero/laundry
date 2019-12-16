/* global excepcion, errores, Trabajador, Socio, Cliente, db */

//Creamos los arrays donde vamos a tener los objetos
function Lavadero() {
    this.aTrabajadores = [];
    this.aClientes = [];
    this.aSocios = [];
    this.aLavados = [];
    this.aExtras = [];
}

//Agregamos un nuevo usuario comprobando primero si ya existe
Lavadero.prototype.agregarUsuario = function (p) {
    try {
        if (p instanceof Trabajador) {
            this.comprobarIgualesUsuarios(this.aTrabajadores, p);
            this.aTrabajadores.push(p);
        } else if (p instanceof Socio) {//Socio al ser hijos de Cliente hemos de agregarlo antes, sino se colará en Cliente
            this.comprobarIgualesUsuarios(this.aSocios, p);
            this.aSocios.push(p);
        } else if (p instanceof Cliente) {
            this.comprobarIgualesUsuarios(this.aClientes, p);
            this.aClientes.push(p);
        }
        return p; //Si quieres mostrarlo una vez añadido
    } catch (excepcion) {
        return excepcion.message;
    }
};

//Comprobamos si el usuario ya existe
Lavadero.prototype.comprobarIgualesUsuarios = function (aUsuarios, obj) {
    var i = 0,
            encontrado = false,
            lon = aUsuarios.length;
    while (!encontrado && i < lon) {
        if (aUsuarios[i].dni == obj.dni)
            throw new LavaderoError(errores.ERROR_0003[localStorage.idioma]);
        else
            i++;
    }
};

//Agregamos un nuevo Lavado. No comprobamos ya que cada lavado es único
Lavadero.prototype.agregarLavado = function (p) {
    this.aLavados.push(p);
    return p; //Si quieres mostrarlo una vez añadido
};

//Agregamos un nuevo Extra comprobando primero si ya existe
Lavadero.prototype.agregarExtra = function (p) {
    try {
        this.comprobarIgualesExtras(p);
        this.aExtras.push(p);
        return p; //Si quieres mostrarlo una vez añadido
    } catch (excepcion) {
        return excepcion.message;
    }
};

//Agregamos un nuevo Extra posterior a la primera carga para poder cambiar el activo
Lavadero.prototype.agregarExtraPost = function (p) {
    try {
        this.comprobarIgualesExtras(p);
        this.aExtras.push(p);
        this.busqExtraAct(p.nombre, p.fecha);
        return p; //Si quieres mostrarlo una vez añadido
    } catch (excepcion) {
        return excepcion.message;
    }
};

//Comprobamos si el extra ya existe
Lavadero.prototype.comprobarIgualesExtras = function (obj) {
    var i = 0,
            encontrado = false,
            lon = this.aExtras.length;
    while (!encontrado && i < lon) {
        if (this.aExtras[i].id == obj.id)
            throw new LavaderoError(errores.ERROR_0005[localStorage.idioma]);
        else
            i++;
    }
};

//Listamos todos los lavados
Lavadero.prototype.listarLavados = function () {
    var res = ''; //Ojo sin estas comillas el primer valor del listado sale undefined
    var lon = this.aLavados.length;

    for (var i = 0; i < lon; i++)
        res += this.aLavados[i].toString() + "\n";
    return res;
};

//Listamos todos los usuarios trabajadores
Lavadero.prototype.listarTrabajadores = function () {
    var res = ''; //Ojo sin estas comillas el primer valor del listado sale undefined
    var lon = this.aTrabajadores.length;

    for (var i = 0; i < lon; i++)
        res += this.aTrabajadores[i].toString() + "\n";
    return res;
};

//Listamos todos los usuarios clientes
Lavadero.prototype.listarClientes = function () {
    var res = ''; //Ojo sin estas comillas el primer valor del listado sale undefined
    var lon = this.aClientes.length;

    for (var i = 0; i < lon; i++)
        res += this.aClientes[i].toString() + "\n";
    return res;
};

//Listamos todos los usuarios Socios
Lavadero.prototype.listarSocios = function () {
    var res = ''; //Ojo sin estas comillas el primer valor del listado sale undefined
    var lon = this.aSocios.length;

    for (var i = 0; i < lon; i++)
        res += this.aSocios[i].toString() + "\n";
    return res;
};

//Listamos todos los extras
Lavadero.prototype.listarExtras = function () {
    var res = ''; //Ojo sin estas comillas el primer valor del listado sale undefined
    var lon = this.aExtras.length;

    for (var i = 0; i < lon; i++)
        res += this.aExtras[i].toString() + "\n";
    return res;
};

//Buscamos cuando son ingresados tres caracteres en el input 
Lavadero.prototype.localizaUsuario = function (valor1, valor2) {
    var res = '';
    if (valor2 == "trabajador") {
        for (var i = 0, max = this.aTrabajadores.length; i < max; i++)
            if (this.aTrabajadores[i].dni.substring(0, 3).toLowerCase() == valor1.toLowerCase())
                res += this.aTrabajadores[i].toString() + "\n";
        return res;
    } else if (valor2 == "cliente") {
        for (var i = 0, max = this.aClientes.length; i < max; i++)
            if (this.aClientes[i].dni.substring(0, 3).toLowerCase() == valor1.toLowerCase())
                res += this.aClientes[i].toString() + "\n";
        return res;
    } else if (valor2 == "socio") {
        for (var i = 0, max = this.aSocios.length; i < max; i++)
            if (this.aSocios[i].dni.substring(0, 3).toLowerCase() == valor1.toLowerCase())
                res += this.aSocios[i].toString() + "\n";
        return res;
    } else if (valor2 == "extra") {
        for (var i = 0, max = this.aExtras.length; i < max; i++)
            if (this.aExtras[i].id.substring(0, 3) == valor1)
                res += this.aExtras[i].toString() + "\n";
        return res;
    } else if (valor2 == "lavado") {
        for (var i = 0, max = this.aLavados.length; i < max; i++)
            if (this.aLavados[i].id.substring(0, 3) == valor1)
                res += this.aLavados[i].toString() + "\n";
        return res;
    }
};

//Búsqueda de usuario.Esta función será llamada desde busUserEdiciElimin
Lavadero.prototype.busquedaUsuario = function (dni, tipoUser) {
    var i = 0,
            encontrado = false;

    if (tipoUser == 0) {
        var limite = this.aTrabajadores.length;

        while (!encontrado && i < limite) {
            if (this.aTrabajadores[i].dni == dni)
                encontrado = true;
            else
                i++;
        }
        if (encontrado)
            return i;
        else
            throw new LavaderoError(errores.ERROR_0001[localStorage.idioma]);
    } else if (tipoUser == 1) {
        var limite = this.aClientes.length;

        while (!encontrado && i < limite) {
            if (this.aClientes[i].dni == dni)
                encontrado = true;
            else
                i++;
        }
        if (encontrado)
            return i;
        else
            throw new LavaderoError(errores.ERROR_0001[localStorage.idioma]);
    } else if (tipoUser == 2) {
        var limite = this.aSocios.length;

        while (!encontrado && i < limite) {
            if (this.aSocios[i].dni == dni)
                encontrado = true;
            else
                i++;
        }
        if (encontrado)
            return i;
        else
            throw new LavaderoError(errores.ERROR_0001[localStorage.idioma]);
    } else if (tipoUser == "lavado") {
        var limite = this.aLavados.length;

        while (!encontrado && i < limite) {
            if (this.aLavados[i].id == dni)//En este caso dni es el id del lavado
                encontrado = true;
            else
                i++;
        }
        if (encontrado)
            return i;
        else
            throw new LavaderoError(errores.ERROR_0011[localStorage.idioma]);
    }
};

//Buscamos el usuario y es retornado el objeto par poder ser editado 
Lavadero.prototype.busUserEdiciElimin = function (dni, tipoUser) {
    try {
        var resultado = this.busquedaUsuario(dni, tipoUser);
    } catch (excepcion) {
        return excepcion.message;
    }
    if (tipoUser == 0)
        return this.aTrabajadores[resultado];
    else if (tipoUser == 1)
        return this.aClientes[resultado];
    else if (tipoUser == 2)
        return this.aSocios[resultado];
    else if (tipoUser == "lavado")//En en caso del lavado el dni es el id
        return this.aLavados[resultado];
};

//Eliminamos el usuario
Lavadero.prototype.eliminarUsuario = function (dni, tipoUser) {
    try {
        var resultado = this.busquedaUsuario(dni, tipoUser);
    } catch (excepcion) {
        return excepcion.message;
    }
    if (tipoUser == 0)
        return this.aTrabajadores.splice(resultado, 1);
    else if (tipoUser == 1)
        return this.aClientes.splice(resultado, 1);
    else if (tipoUser == 2)
        return this.aSocios.splice(resultado, 1);
};

//Búsqueda de Extras para cambiar activo si el extra ya existe
Lavadero.prototype.busqExtraAct = function (nom, fec) {
    var i = 0,
            encontrado = false,
            limite = this.aExtras.length;

    while (!encontrado && i < limite) {
        if (this.aExtras[i].nombre == nom && this.aExtras[i].activo == true && this.aExtras[i].fecha != fec) {
            this.aExtras[i].activo = false;
            encontrado = true;
        }
        else
            i++;
    }
};

//Búsqueda de Extras para precio 
Lavadero.prototype.busqExtraPre = function (nom) {
    var i = 0,
            encontrado = false,
            limite = this.aExtras.length;

    while (!encontrado && i < limite) {
        if (this.aExtras[i].nombre == nom && this.aExtras[i].activo == true)
            encontrado = true;
        else
            i++;
    }
    if (encontrado)
        return i;
};

//Búsqueda extra para nueva carga de checkbox que esten activos
Lavadero.prototype.extrasActivos = function () {
    var lista = [];
    this.aExtras.forEach(function (e) {
        if (e.activo == true)
            lista.push(e.nombre);
    });
    return lista;
};

//Buscamos el extra y es retornado el objeto. 
//No usamos control de errores porque no es posible que el extra no exista ya que son los seleccionado en los checkbox
Lavadero.prototype.busExt = function (nom) {
    var resultado = this.busqExtraPre(nom);//Es buscado por nombre
    return this.aExtras[resultado];
};

//Búsqueda de usuario para obtener el nombre para la factura
Lavadero.prototype.busqUserFact = function (dni) {
    var i = 0,
            encontrado = false,
            limite = 0;
    if (!encontrado) {
        limite = this.aClientes.length;

        while (!encontrado && i < limite) {
            if (this.aClientes[i].dni == dni)
                encontrado = true;
            else
                i++;
        }
        if (encontrado)
            return this.aClientes[i];
        else if (!encontrado)
            i = 0;
    }
    if (!encontrado) {
        limite = this.aSocios.length;

        while (!encontrado && i < limite) {
            if (this.aSocios[i].dni == dni)
                encontrado = true;
            else
                i++;
        }
        if (encontrado)
            return this.aSocios[i];
    } else
        return encontrado;
};

//Obtener todos los Lavados
Lavadero.prototype.obtenerLavados = function () {
    return this.aLavados;
};

//Formato fecha España
Lavadero.prototype.fecEsp = function (f) {
    var partes = f.split("/");
    var fecEng = partes[1] + "/" + partes[0] + "/" + partes[2];
    return fecEng;
};

//Vamos obteniendo el precio de los extras
Lavadero.prototype.tenerExt = function (a) {
    var totalExtras = [];
    for (var j = 0, max = a.length; j < max; j++)
        totalExtras.push(a[j].precio);
    return totalExtras;
};

//Tenemos el array con el precio de los extras
Lavadero.prototype.totalExtTra = function (dniTra, fec1, fec2) {
    var fecIni = new Date(this.fecEsp(fec1)),
            fecFin = new Date(this.fecEsp(fec2)),
            listExtPre = [];

    for (var i = 0, max = this.aLavados.length; i < max; i++) {
        var fecLav = new Date(this.fecEsp(this.aLavados[i].fecha));
        if (fecLav > fecIni && fecLav < fecFin && this.aLavados[i].dniTrabajador == dniTra) {
            var aExtra = this.aLavados[i].extras;
            if (aExtra != null)
                listExtPre = listExtPre.concat(this.tenerExt(aExtra));
        }
    }
    return listExtPre;
};

//Cálculo nómina
Lavadero.prototype.calculoNomina = function (dniT, fech1, fech2) {
    var sumTotExt = 0;
    var listaPreExt = this.totalExtTra(dniT, fech1, fech2);
    for (var i = 0, max = listaPreExt.length; i < max; i++)
        sumTotExt += parseInt(listaPreExt[i]);
    var tra = this.busUserEdiciElimin(dniT, 0);
    var totalTrabajador = tra.sueldoBase + parseFloat(sumTotExt * 15 / 100);//ajustamos el 15%
    return "<br/><b>" + tra.nombre + "</b> con dni <b>" + tra.dni + "</b> tiene una nómina de <b>" + totalTrabajador + "</b> €";
};

//Guardamos en indexedDB con Dexie
Lavadero.prototype.guardarIndexedDBDexie = function () {
    console.log(db);

    for (var i = 0, max = this.aTrabajadores.length; i < max; i++)
        db.trabajadores.put({dni: this.aTrabajadores[i].dni, nombre: this.aTrabajadores[i].nombre, apellidos: this.aTrabajadores[i].apellidos, sueldo: this.aTrabajadores[i].sueldoBase});
    for (var i = 0, max = this.aClientes.length; i < max; i++)
        db.clientes.put({dni: this.aClientes[i].dni, nombre: this.aClientes[i].nombre, apellidos: this.aClientes[i].apellidos});
    for (var i = 0, max = this.aSocios.length; i < max; i++)
        db.socios.put({dni: this.aSocios[i].dni, nombre: this.aSocios[i].nombre, apellidos: this.aSocios[i].apellidos, nacimiento: this.aSocios[i].nacimiento});
    for (var i = 0, max = this.aExtras.length; i < max; i++)
        db.extras.put({id: this.aExtras[i].id, nombre: this.aExtras[i].nombre, precio: this.aExtras[i].precio, fecha: this.aExtras[i].fecha, activo: this.aExtras[i].activo});
    for (var i = 0; i < this.aLavados.length; i++) {
        var ext = [];
        if (this.aLavados[i].extras != null)
            for (var j = 0, max = this.aLavados[i].extras.length; j < max; j++)
                ext.push(this.aLavados[i].extras[j]);
        db.lavados.put({id: this.aLavados[i].id, matricula: this.aLavados[i].matricula, dniCliente: this.aLavados[i].dniCliente, dniTrabajador: this.aLavados[i].dniTrabajador, fecha: this.aLavados[i].fecha, extras: ext, precioBase: this.aLavados[i].precioBase});
    }
};
