from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
from datetime import datetime
import base64 

app = Flask(__name__)
CORS(app)

# Conexión a SQL Server
def get_connection():
    return pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=192.168.0.18;'
        'DATABASE=gestor_florencia;'
        'UID=sa;'
        'PWD=Joshua24092003'
    )

# 1. Registrar paquete local
@app.route('/api/paquetes', methods=['POST'])
def registrar_paquete():
    data = request.json
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO paquetes_locales (id_envio_central, estado_local)
            VALUES (?, ?)
        """, (data['id_envio_central'], data['estado_local']))
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Paquete registrado"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 2. Asignar paquete a ruta y vehículo
@app.route('/api/asignaciones', methods=['POST'])
def asignar_paquete():
    data = request.json
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO asignaciones (id_paquete, id_vehiculo, id_ruta)
            VALUES (?, ?, ?)
        """, (data['id_paquete'], data['id_vehiculo'], data['id_ruta']))
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Asignación registrada"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 3. Registrar entrega
@app.route('/api/entregas', methods=['POST'])
def registrar_entrega():
    try:
        data = request.json

        # Convertir firma base64 a binario si existe y no está vacía
        firma = None
        firma_b64 = data.get('firma')
        if firma_b64:
            try:
                firma = base64.b64decode(firma_b64)
            except Exception as decode_error:
                return jsonify({"error": "Firma inválida"}), 400

        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO entregas (id_paquete, estado, observaciones, firma)
            VALUES (?, ?, ?, ?)
        """, (data['id_paquete'], data['estado'], data['observaciones'], firma))

        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Entrega registrada"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# 4. Consultar paquetes locales
@app.route('/api/paquetes', methods=['GET'])
def consultar_paquetes():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id_paquete, id_envio_central, estado_local, fecha_ingreso FROM paquetes_locales")
        rows = cur.fetchall()
        conn.close()
        paquetes = [{
            "id_paquete": r[0],
            "id_envio_central": r[1],
            "estado_local": r[2],
            "fecha_ingreso": r[3].strftime("%Y-%m-%d %H:%M:%S")
        } for r in rows]
        return jsonify(paquetes)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ejecutar servidor
if __name__ == '__main__':
    app.run(port=5002)
