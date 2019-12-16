/* global Usuario */

function Cliente(_dni, _nom, _ape) {
    Usuario.call(this, _dni, _nom, _ape);
}

Cliente.prototype = Object.create(Usuario.prototype);//Creamos la herencia

Cliente.prototype.toString = function () {
    return Usuario.prototype.toString.call(this)+"</div>";
};


