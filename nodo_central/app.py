from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="gestor_paquetes",
        user="postgres",
        password="Joshua24092003"
    )

# 1. Registro de clientes
@app.route('/api/clientes', methods=['POST'])
def registrar_cliente():
    data = request.json
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO clientes (nombre, cedula, telefono, correo)
            VALUES (%s, %s, %s, %s)
        """, (data['nombre'], data['cedula'], data['telefono'], data['correo']))
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Cliente registrado exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 2. Consultar cliente por cédula
@app.route('/api/cliente/<cedula>', methods=['GET'])
def get_cliente(cedula):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id_cliente, nombre, correo, saldo 
            FROM clientes 
            WHERE cedula = %s
        """, (cedula,))
        row = cur.fetchone()
        conn.close()
        if row:
            return jsonify({
                "id_cliente": row[0],
                "nombre": row[1],
                "correo": row[2],
                "saldo": str(row[3])
            })
        else:
            return jsonify({"error": "Cliente no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 3. Registrar pago
@app.route('/api/pagos', methods=['POST'])
def registrar_pago():
    data = request.json
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT saldo FROM clientes WHERE id_cliente = %s", (data['id_cliente'],))
        row = cur.fetchone()
        if not row:
            return jsonify({"error": "Cliente no existe"}), 404

        cur.execute("""
            INSERT INTO pagos (id_cliente, monto)
            VALUES (%s, %s)
        """, (data['id_cliente'], data['monto']))
        cur.execute("""
            UPDATE clientes
            SET saldo = saldo + %s
            WHERE id_cliente = %s
        """, (data['monto'], data['id_cliente']))
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Pago registrado"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 4. Registrar envío con QR único y guardar historial inicial
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import uuid
from datetime import datetime
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="gestor_paquetes",
        user="postgres",
        password="Joshua24092003"
    )

@app.route('/api/envios', methods=['POST'])
def registrar_envio():
    data = request.json
    conn = None
    cur = None
    try:
        qr = str(uuid.uuid4())
        conn = get_connection()
        cur = conn.cursor()
        # Insertar nuevo envío y obtener su ID
        cur.execute("INSERT INTO envios (id_cliente, qr_code) VALUES (%s, %s) RETURNING id_envio",
                    (data['id_cliente'], qr))
        id_envio = cur.fetchone()[0]
        logging.debug(f"Nuevo envío insertado con id_envio: {id_envio}")

        # Insertar estado inicial "Pendiente" en historial_envios
        cur.execute("INSERT INTO historial_envios (id_envio, estado) VALUES (%s, %s)",
                    (id_envio, "Pendiente"))
        logging.debug("Estado inicial 'Pendiente' insertado en historial_envios")

        conn.commit()
        return jsonify({"qr_code": qr}), 201
    except Exception as e:
        logging.error(f"Error al registrar envío: {e}")
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


# 5. Consultar historial de envíos por cliente
@app.route('/api/historial/<id_cliente>', methods=['GET'])
def historial_envios(id_cliente):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT e.qr_code, h.estado, h.fecha_hora 
            FROM envios e
            JOIN historial_envios h ON e.id_envio = h.id_envio
            WHERE e.id_cliente = %s
            ORDER BY h.fecha_hora DESC
        """, (id_cliente,))
        rows = cur.fetchall()
        conn.close()
        historial = [{
            "qr_code": r[0],
            "estado": r[1],
            "fecha": r[2].strftime("%Y-%m-%d %H:%M:%S")
        } for r in rows]
        return jsonify(historial)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 6. Validar nodo local (IP + token)
@app.route('/api/validar-nodo', methods=['POST'])
def validar_nodo():
    data = request.json
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id_nodo FROM nodos 
            WHERE ip_autorizada = %s AND token_acceso = %s AND activo = TRUE
        """, (data['ip'], data['token']))
        row = cur.fetchone()
        conn.close()
        if row:
            return jsonify({"valido": True, "id_nodo": row[0]})
        else:
            return jsonify({"valido": False}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 7. Registrar nuevo nodo
@app.route('/api/nodos', methods=['POST'])
def registrar_nodo():
    data = request.json
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO nodos (nombre, ip_autorizada, token_acceso)
            VALUES (%s, %s, %s)
        """, (data['nombre'], data['ip'], data['token']))
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Nodo registrado"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 8. Sincronizar estado de envío (insertar historial + actualizar estado actual)
@app.route('/api/sync-estado', methods=['POST'])
def sincronizar_estado():
    data = request.json
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id_envio FROM envios WHERE qr_code = %s
        """, (data['qr_code'],))
        envio = cur.fetchone()
        if not envio:
            return jsonify({"error": "QR no encontrado"}), 404

        cur.execute("""
            INSERT INTO historial_envios (id_envio, estado)
            VALUES (%s, %s)
        """, (envio[0], data['estado']))

        cur.execute("""
            UPDATE envios SET estado_actual = %s
            WHERE id_envio = %s
        """, (data['estado'], envio[0]))

        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Estado sincronizado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 9. Validar paquete por código QR
@app.route('/api/validar-qr/<qr_code>', methods=['GET'])
def validar_qr(qr_code):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT e.id_envio, c.nombre 
            FROM envios e
            JOIN clientes c ON e.id_cliente = c.id_cliente
            WHERE e.qr_code = %s
        """, (qr_code,))
        row = cur.fetchone()
        conn.close()
        if row:
            return jsonify({
                "valido": True,
                "id_envio": row[0],
                "nombre": row[1]
            })
        else:
            return jsonify({"valido": False, "error": "Código QR no válido"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 10. Consultar envío por código QR (detalles)
@app.route('/api/envios', methods=['POST'])
def registrar_envio():
    data = request.json
    conn = None
    cur = None
    try:
        qr = str(uuid.uuid4())
        conn = get_connection()
        cur = conn.cursor()
        
        # Insertar el envío y obtener id_envio generado
        cur.execute(
            "INSERT INTO envios (id_cliente, qr_code) VALUES (%s, %s) RETURNING id_envio",
            (data['id_cliente'], qr)
        )
        id_envio = cur.fetchone()[0]
        
        # Insertar estado inicial "Pendiente" en historial_envios para ese envío
        cur.execute(
            "INSERT INTO historial_envios (id_envio, estado) VALUES (%s, %s)",
            (id_envio, "Pendiente")
        )
        
        # Confirmar la transacción completa
        conn.commit()

        return jsonify({"qr_code": qr}), 201
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

# 11. Historial general de envíos
@app.route('/api/historial', methods=['GET'])
def historial_general():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT e.qr_code, c.nombre, h.estado, h.fecha_hora 
            FROM envios e
            JOIN clientes c ON e.id_cliente = c.id_cliente
            JOIN historial_envios h ON e.id_envio = h.id_envio
            ORDER BY h.fecha_hora DESC
        """)
        rows = cur.fetchall()
        conn.close()
        historial = [{
            "qr_code": r[0],
            "cliente": r[1],
            "estado": r[2],
            "fecha": r[3].strftime("%Y-%m-%d %H:%M:%S")
        } for r in rows]
        return jsonify(historial)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
