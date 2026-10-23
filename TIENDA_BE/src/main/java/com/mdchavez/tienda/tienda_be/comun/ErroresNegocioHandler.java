package com.mdchavez.tienda.tienda_be.comun;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;
import java.util.Map;

@RestControllerAdvice
public class ErroresNegocioHandler {

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<Map<String, String>> accesoDenegado(AuthorizationDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("mensaje", "No tiene permiso para realizar esta acción"));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, String>> accesoDatos(DataAccessException e) {
        for (Throwable t = e; t != null; t = t.getCause()) {
            if (t instanceof SQLException sql && sql.getErrorCode() >= 20000 && sql.getErrorCode() <= 20999) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", mensajeLimpio(sql)));
            }
        }
        throw e;
    }

    private static String mensajeLimpio(SQLException sql) {
        String msg = sql.getMessage();
        int salto = msg.indexOf('\n');
        if (salto >= 0) {
            msg = msg.substring(0, salto);
        }
        int dosPuntos = msg.indexOf(": ");
        return dosPuntos >= 0 ? msg.substring(dosPuntos + 2).trim() : msg.trim();
    }
}
