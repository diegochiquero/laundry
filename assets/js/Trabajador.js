/* global Usuario */

function Trabajador(_dni, _nom, _ape, _bas) {
    Usuario.call(this, _dni, _nom, _ape);
    this.sueldoBase = _bas;
}

Trabajador.prototype = Object.create(Usuario.prototype);//Creamos la herencia

Trabajador.prototype.toString = function () {
    return Usuario.prototype.toString.call(this) + "<br/><b> Sueldo Base:</b> " + this.sueldoBase + "</div>";
};
