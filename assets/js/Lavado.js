function Lavado(_id,_mat, _dnc, _dnt, _fec, _ext, _bas) {
    this.id = _id;
    this.matricula = _mat;
    this.dniCliente = _dnc;
    this.dniTrabajador = _dnt;
    this.fecha = _fec;
    this.extras = _ext;
    this.precioBase = _bas;
}

Lavado.prototype.toString = function () {
    
    var str;
    str = "<br/><div><b>Id:</b>" + this.id + "<br/><b>Matrícula:</b>" + this.matricula + "<br/><b>Dni cliente:</b>" + this.dniCliente + "<br/><b>Dni trabajador:</b>" + this.dniTrabajador + "<br/><b>Fecha:</b>" + this.fecha+ "<br/>";
    if (this.extras === null)
        str += "<b>Extra:</b>Sin extras&nbsp;";
    else if (this.extras.length > 1) {
        
        str += "<b>Extras:</b>";
        for (var i = 0, max = this.extras.length; i < max; i++)
            str += this.extras[i].nombre + "&nbsp;";
    }
    else if (this.extras.length == 1) {
        str += "<b>Extra:</b>" + this.extras[0].nombre + "&nbsp;";
    }

    str += "<br/><b>Precio base:</b>" + this.precioBase + "</div>";
    return str;
};

Lavado.prototype.calcularPrecio = function () {
    var total=0;
    if (this.extras === null)
        total = 0;
    else {
        for (var i = 0, max = this.extras.length; i < max; i++)
            total += parseFloat(this.extras[i].precio); 
    }

    return total;
};