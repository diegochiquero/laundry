/* global Lavado */

//dnc = dni cliente; dnt = dni trabajador
function Pequenho(_id,_mat, _dnc, _dnt, _fec, _ext) {
    this.precioBase = 16.5;//constante
    Lavado.call(this, _id,_mat, _dnc, _dnt, _fec, _ext, this.precioBase);
}

Pequenho.prototype = Object.create(Lavado.prototype);//Creamos la herencia

Pequenho.prototype.toString = function () {
    return Lavado.prototype.toString.call(this);
};

Pequenho.prototype.calcularPrecio = function (){
    return Lavado.prototype.calcularPrecio.call(this) + parseFloat(this.precioBase);
};