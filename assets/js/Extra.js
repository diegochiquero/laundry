function Extra(_id, _nom, _pre, _fec, _act) {
    this.id = _id;
    this.nombre = _nom;
    this.precio = _pre;
    this.fecha = _fec;
    this.activo = _act;
}

Extra.prototype.toString = function () {
    var acti;
    this.activo == true ? acti = "Si" : acti= "No";
    return "<br/><div><b>Id: </b>" + this.id + "<br/><b> Nombre: </b>" + this.nombre + "<br/><b> Precio: </b>" + this.precio + "<br/><b> Fecha: </b>" + this.fecha + "<br/><b> Activo: </b>" + acti + "</div>";
};
