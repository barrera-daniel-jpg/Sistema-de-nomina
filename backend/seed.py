import time
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import Usuario, Empleado
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_data():
    print("Iniciando seed de base de datos...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Crear usuarios por defecto
    usuarios = [
        Usuario(username="gerente1", password_hash=pwd_context.hash("1234"), rol="gerente", nombre="Carlos Gerente"),
        Usuario(username="admin1", password_hash=pwd_context.hash("1234"), rol="admin", nombre="Ana Administradora"),
        Usuario(username="operario1", password_hash=pwd_context.hash("1234"), rol="operario", nombre="Juan Operario"),
    ]
    
    db.add_all(usuarios)
    db.commit()
    
    # Crear empleado para el operario
    op = db.query(Usuario).filter(Usuario.username == "operario1").first()
    empleado = Empleado(usuario_id=op.id, salario_base=2000000, hijos=2)
    db.add(empleado)
    db.commit()
    
    db.close()
    print("Seed completado exitosamente.")

if __name__ == "__main__":
    time.sleep(2) # Esperar a que la DB esté lista
    seed_data()
