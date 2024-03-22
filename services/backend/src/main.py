import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session, select
from sqlalchemy.engine import URL

from models import *
from populate_db import insert_students, insert_teachers

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv("../.env")
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_DATABASE = os.getenv("DB_DATABASE")

url_object = URL.create(
    "mysql+mysqldb",
    username=DB_USERNAME,
    password=DB_PASSWORD,
    host=DB_HOST,
    database=DB_DATABASE,
)
engine = create_engine(url_object)
session = Session(engine)


@app.get("/api/users")
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]


@app.get("/api/user/{user_info}")
async def read_user(user_info: int | str):
    if isinstance(user_info, int):
        query = select(User).where(User.id == user_info)
    elif isinstance(user_info, str):
        query = select(User).where(User.username == user_info)
    else:
        return {"error": "Uživatel nebyl nalezen."}

    user = session.exec(query).first()
    if user:
        return user
    else:
        return {"error": "Uživatel nebyl nalezen."}


if __name__ == "__main__":
    # SQLModel.metadata.create_all(engine)
    # insert_students(engine)
    # insert_teachers(engine)
    ...
