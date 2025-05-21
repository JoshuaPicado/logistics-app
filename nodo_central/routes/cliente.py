from flask import Blueprint, jsonify
from conexion import get_connection

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/api/cliente/<cedula>', methods=['GET'])
def get_cliente(cedula):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id_cliente, nombre, correo, saldo FROM clientes WHERE cedula = %s", (cedula,))
    row = cur.fetchone()
    conn.close()

    if row:
        return jsonify({
            "id_cliente": row[0],
            "nombre": row[1],
            "correo": row[2],
            "saldo": row[3]
        })
    else:
        return jsonify({"error": "Cliente no encontrado"}), 404
