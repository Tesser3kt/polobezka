import csv
from sqlmodel import Session, select

from models import *


def insert_students(engine) -> None:
    students_data = []
    with open("zaci.csv", "r", encoding="windows-1250") as file:
        reader = csv.reader(file, delimiter=";")
        next(reader)
        for row in reader:
            student = {
                "email": row[2],
                "class": row[6],
            }
            if not student["email"]:
                continue
            students_data.append(student)

    with Session(engine) as session:
        for student in students_data:
            statement = select(Class).where(Class.name == student["class"])
            class_ = session.exec(statement).first()

            # Add class if it does not exist
            if not class_:
                class_ = Class(name=student["class"])
                session.add(class_)
                session.commit()

            # Add student
            student = User(
                email=student["email"],
                class_=class_,
            )
            session.add(student)
        session.commit()


def insert_teachers(engine) -> None:
    teachers_data = []
    with open("ucitele.csv", "r", encoding="windows-1250") as file:
        reader = csv.reader(file, delimiter=";")
        next(reader)
        for row in reader:
            teacher = {
                "email": row[5],
            }
            teachers_data.append(teacher)

    with Session(engine) as session:
        for teacher in teachers_data:
            teacher = User(
                email=teacher["email"],
            )
            if not teacher.email:
                continue
            session.add(teacher)
        session.commit()
