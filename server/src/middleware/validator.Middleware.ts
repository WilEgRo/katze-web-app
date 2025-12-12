import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

//----------------------------------------------
// FUNCION PRINCIPAL DE VALIDACION
//----------------------------------------------
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); 
    }

    const extractedErrors: object[] = [];
    for (const err of errors.array()) {
        if (err.type === 'field') {
            extractedErrors.push({ [err.path]: err.msg });
        }
    }

    return res.status(400).json({
        message: 'Error de validación',
        errors: extractedErrors,
    });
}

//----------------------------------------------
// REGLAS AUTH
//----------------------------------------------
export const registerRules = () => [
    body('username').notEmpty().withMessage('Usuario obligatorio').isLength({ min: 3 }).trim().escape(),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Contraseña mín 6 caracteres').trim(),
];

export const loginRules = () => [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().trim(),
];

//----------------------------------------------
// REGLAS GATOS (Actualizado con nuevos estados)
//----------------------------------------------
export const gatoRules = () => [
    body('nombre').notEmpty().trim().escape(),
    body('descripcion').notEmpty().trim().escape(),
    body('edad').notEmpty().trim().escape(),
    body('caracter').notEmpty().trim().escape(),
    body('estadoSalud').notEmpty().trim().escape(),
    body('estado')
        .optional() // Es opcional porque el controller lo asigna por defecto si no viene
        .isIn(['enAdopcion', 'adoptado', 'hogarTemporal', 'perdido', 'pendiente', 'rechazado']) 
        .withMessage('Estado no válido'),
];

//----------------------------------------------
// REGLAS REPORTES
//----------------------------------------------
export const reporteRules = () => [
    body('descripcion').notEmpty().trim().escape(),
    body('zona').notEmpty().trim().escape(),
    body('contacto').notEmpty().trim().escape(),
    body('fecha').optional().isISO8601().toDate(),
    body('nombreGato').optional().trim().escape(),
];