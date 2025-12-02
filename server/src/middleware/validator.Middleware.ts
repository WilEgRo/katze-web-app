import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

//----------------------------------------------
// FUNCION PRINCIPAL DE VALIDACION
// esta funcion se ejecuta despues de las reglas
// revisa si 'validationResult' encuentro errores
//----------------------------------------------
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); // continuar al siguiente middleware o controlador
    }

    // si hay errores, responder con 400 y los detalles de los errores
    const extractedErrors: object[] = [];
    
    //este bucle for para poder compronar el tipo de error
    for (const err of errors.array()) {
        if (err.type === 'field') {
            // usamos err.path en lugar de err.param
            extractedErrors.push({ [err.path]: err.msg });
        }
    }

    return res.status(400).json({
        message: 'Error de validacion',
        errors: extractedErrors,
    });
}

//----------------------------------------------
// REGLAS PARA AUTENTICACION DE ADMIN (Auth)
//----------------------------------------------
export const registerRules = () => [
    body('username')
        .notEmpty().withMessage('El nombre de usuario es obligatorio')
        .isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres')
        .trim()
        .escape(),
    // body('email') le dice a express-validator que busque en el req.body
    body('email')
        .isEmail()
        .withMessage('Debe ser un formato de email valido')
        .normalizeEmail(), // Sanitizacion: covierte a minusculas, etc.
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contrasena debe tener al menos 8 caracteres')
        .trim(), // Sanitizacion: elimina espacios al inicio y final
];

export const loginRules = () => [
    body('email')
        .isEmail()
        .withMessage('Debe ser un formato de email valido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña no puede estar vacia')
        .trim(),
];

//----------------------------------------------
// REGLAS PARA GATOS ( Gato )
//----------------------------------------------
export const gatoRules = () => [
    // Usamos '.trim()' para sanitizar los campos de texto
    // Usamos '.escape()' para sanitizar y prevenir ataques XSS (convierte <, > en &amp;lt;, &amp;gt;, etc.)
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .trim()
        .escape(),
    
    body('descripcion')
        .notEmpty()
        .withMessage('La descripcion es obligatoria')
        .trim()
        .escape(),
    
    body('edad')
        .notEmpty()
        .withMessage('La edad es obligatoria')
        .trim()
        .escape(),
    
    body('caracter')
        .notEmpty()
        .withMessage('El caracter es obligatorio')
        .trim()
        .escape(),
    
    body('estadoSalud')
        .notEmpty()
        .withMessage('El estado de salud es obligatorio')
        .trim()
        .escape(),
    
    body('estado')
        .isIn(['enAdopcion', 'adoptado', 'hogarTemporal', 'perdido']) // validar que el estado este entre estos valores
        .withMessage('El estado debe ser uno de: enAdopcion, adoptado, hogarTemporal, perdido'),
];

//----------------------------------------------
// REGLAS PARA REPORTES DE GATOS PERDIDOS
//----------------------------------------------
export const reporteRules = () => [
    body('descripcion')
        .notEmpty()
        .withMessage('La descripcion es obligatoria')
        .trim()
        .escape(), // sanitisacion XSS (XSS significa Cross-Site Scripting y es un tipo de ataque que inyecta codigo malicioso en aplicaciones web)
    
    body('zona')
        .notEmpty()
        .withMessage('La zona es obligatoria')
        .trim()
        .escape(),

    body('contacto')
        .notEmpty()
        .withMessage('La informacion de contacto es obligatoria')
        .trim()
        .escape(),
    
    body('fecha')
        .optional() // la fecha es opcional, si no se provee se usara la fecha actual
        .isISO8601() // validar formato de fecha ISO 8601 (YYYY-MM-DD)
        .toDate(), // Sanitizacion: convertir a objeto Date de JavaScript

    body('nombreGato')
        .optional() // el nombre del gato es opcional
        .trim()
        .escape(), // aun asi si lo envia se sanitiza
];