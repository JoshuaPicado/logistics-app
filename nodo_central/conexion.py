import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="gestor_paquetes", 
        user="postgres",
        password="1234"      
    )
