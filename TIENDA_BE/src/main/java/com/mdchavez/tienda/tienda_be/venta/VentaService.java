package com.mdchavez.tienda.tienda_be.venta;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Types;

@Service
public class VentaService {

    private final JdbcTemplate jdbc;

    public VentaService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional
    public VentaResponse registrar(VentaRequest req) {
        long idEmpleado = idEmpleadoDelUsuario();

        long idFactura = jdbc.execute(
                (java.sql.Connection con) -> {
                    CallableStatement cs = con.prepareCall("{call PR_CREAR_FACTURA(?, ?, ?, ?)}");
                    cs.setLong(1, req.idSucursal());
                    cs.setLong(2, req.idCliente());
                    cs.setLong(3, idEmpleado);
                    cs.registerOutParameter(4, Types.NUMERIC);
                    return cs;
                },
                (CallableStatement cs) -> {
                    cs.execute();
                    return cs.getLong(4);
                });

        for (VentaRequest.Linea l : req.lineas()) {
            jdbc.update("{call PR_AGREGAR_DETALLE_FACTURA(?, ?, ?, ?)}",
                    idFactura, l.idProducto(), l.cantidad(),
                    l.descuento() != null ? l.descuento() : BigDecimal.ZERO);
        }

        for (VentaRequest.Pago p : req.pagos()) {
            jdbc.update("{call PR_REGISTRAR_PAGO(?, ?, ?, ?, ?, ?)}",
                    idFactura, p.idFormaPago(), p.monto(), p.idBanco(), p.noReferencia(), p.noAutorizacion());
        }

        jdbc.update("{call PR_FINALIZAR_FACTURA(?)}", idFactura);

        return jdbc.queryForObject(
                "SELECT ID_FACTURA, SERIE, NUMERO, TOTAL FROM FACTURA WHERE ID_FACTURA = ?",
                (rs, n) -> new VentaResponse(rs.getLong("ID_FACTURA"), rs.getString("SERIE"),
                        rs.getLong("NUMERO"), rs.getBigDecimal("TOTAL")),
                idFactura);
    }

    private long idEmpleadoDelUsuario() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return jdbc.queryForObject("SELECT ID_EMPLEADO FROM USUARIO WHERE USERNAME = ?", Long.class, username);
    }

    public record VentaResponse(long idFactura, String serie, long numero, BigDecimal total) {
    }
}
