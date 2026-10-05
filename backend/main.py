from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from passlib.context import CryptContext
from pydantic import BaseModel

app = FastAPI(title="API Nómina SENA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Usuario o contraseña incorrectos")
    return {"access_token": user.username, "token_type": "bearer", "rol": user.rol}

@app.get("/users/me")
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.username == token).first()
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")
    return {"username": user.username, "rol": user.rol, "nombre": user.nombre}

@app.get("/dashboard")
def get_dashboard_data(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.username == token).first()
    
    if user.rol == "gerente":
        return {"stats": "Liquidaciones pendientes: 5 | Aprobadas este mes: 120"}
    elif user.rol == "admin":
        return {"stats": "Empleados activos: 45 | Horas por revisar: 12"}
    elif user.rol == "operario":
        return {"stats": "Tus horas ordinarias: 160h | Bonificación por hijos: Activa"}
    return {"stats": "Sin datos"}
