/* global Lavado */

//dnc = dni cliente; dnt = dni trabajador
function Furgoneta(_id,_mat, _dnc, _dnt, _fec, _ext) {
    this.precioBase = 22.5;
    Lavado.call(this, _id,_mat, _dnc, _dnt, _fec, _ext, this.precioBase);
}

Furgoneta.prototype = Object.create(Lavado.prototype);//Creamos la herencia

Furgoneta.prototype.toString = function () {
    return Lavado.prototype.toString.call(this);
};

Furgoneta.prototype.calcularPrecio = function (){
    return Lavado.prototype.calcularPrecio.call(this) + parseFloat(this.precioBase);
};