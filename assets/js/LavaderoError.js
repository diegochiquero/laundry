/*Formato JSON*/
//var idioma = "en";
var errores = {
    "ERROR_0001": {"es": "El usuario no existe",
                   "en": "User doesn't exist"},
    "ERROR_0002": {"es": "Fecha incorrecta ingrese 01/01/1912",
                   "en": "Incorrect date write 01/01/1912"},
    "ERROR_0003": {"es": "El usuario ya existe en el sistema",
                   "en": "User already exist"},
    "ERROR_0004": {"es": "Dni nacional incorrecto ingrese 12345678A",
                   "en": "Incorrect national identity card write 12345678A"},
    "ERROR_0005": {"es": "El extra ya existe",
                   "en": "Extra already exist"},
    "ERROR_0006": {"es": "El extra no existe",
                   "en": "Extra doesn't exist"},
    "ERROR_0007": {"es": "No existen resultados coincidentes",
                   "en": "There is not coincidents result"},
    "ERROR_0008": {"es": "Matrícula incorrecta ingrese 0000ABC",
                   "en": "Incorrect car plate write 0000ABC"},
    "ERROR_0009": {"es": "Sueldo solo valores numéricos entre tres y cuatro dígitos",
                   "en": "Salary only numeric values between three or four digit"},
    "ERROR_0010": {"es": "Precio solo valores numéricos dos dígitos",
                   "en": "Price only numeric values two digit"},
    "ERROR_0011": {"es": "El lavado no existe",
                   "en": "Washing doesn't exist"}
};

function LavaderoError(message) {
    this.name = "LavaderoError";
    this.message = (message || "LavaderoError: Error undefined");
}

LavaderoError.prototype = new Error();
LavaderoError.prototype.constructor = LavaderoError;

