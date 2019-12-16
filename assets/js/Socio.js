/* global Cliente */

function Socio(_dni, _nom, _ape, _nac) {
    Cliente.call(this, _dni, _nom, _ape);
    this.nacimiento = _nac;
}

Socio.prototype = Object.create(Cliente.prototype);//Creamos la herencia

Socio.prototype.toString = function () {
    return Cliente.prototype.toString.call(this) + "<b> Nacimiento:</b> " + this.nacimiento +"</div><br/>";
};


