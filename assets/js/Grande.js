/* global Lavado */

//dnc = dni cliente; dnt = dni trabajador
function Grande(_id,_mat, _dnc, _dnt, _fec, _ext) {
    this.precioBase = 18.5;//Constante
    Lavado.call(this, _id,_mat, _dnc, _dnt, _fec, _ext, this.precioBase);
}

Grande.prototype = Object.create(Lavado.prototype);//Creamos la herencia

Grande.prototype.toString = function () {
    return Lavado.prototype.toString.call(this);
};

Grande.prototype.calcularPrecio = function () {
    return Lavado.prototype.calcularPrecio.call(this) + parseFloat(this.precioBase);
};