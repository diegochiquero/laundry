function Usuario(_dni, _nom, _ape) {
    this.dni = _dni;
    this.nombre = _nom;
    this.apellidos = _ape;
}

Usuario.prototype.toString = function (){
    return "<br/><div><b>Dni:</b> " + this.dni + "<br/><b> Nombre:</b> " + this.nombre + "<br/><b> Apellidos:</b> " + this.apellidos;
};