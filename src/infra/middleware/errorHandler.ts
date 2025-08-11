import { ZodError } from "zod";
import logger from "../lib/logger.js";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../application/errors/AppError.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(err.message, { stack: err.stack });

    if (err instanceof ZodError) {
        logger.error(err.message);
        return res.status(422).json({
            message: "Erro ao validar objeto de requisição",
            errors: err.flatten().fieldErrors,
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    return res.status(500).json({ message: "Erro interno do servidor." });
}