import os
import csv
import pytz
from datetime import datetime
from random import choice
from sqlmodel import Session, select

from .models import *


def insert_students(engine) -> None:
    students_data = []
    with open(
        os.path.join(os.path.dirname(__file__), "zaci.csv"),
        "r",
        encoding="windows-1250",
    ) as file:
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
            class_.students.append(student)
            session.commit()


def insert_teachers(engine) -> None:
    teachers_data = []
    with open(
        os.path.join(os.path.dirname(__file__), "ucitele.csv"),
        "r",
        encoding="windows-1250",
    ) as file:
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


def random_populate_teams(engine) -> None:
    with Session(engine) as session:
        for _ in range(100):
            team = Team(
                name="".join(choice("abcdefghijklmnopqrstuvwxyz") for _ in range(10)),
            )
            session.add(team)
        session.commit()


def random_populate_invites(engine) -> None:
    with Session(engine) as session:
        user_ids = session.exec(select(User.id)).all()
        team_ids = session.exec(select(Team.id)).all()
        for _ in range(1000):
            invite = Invite(
                user_to_id=choice(user_ids),
                team_from_id=choice(team_ids),
                date=datetime.now(pytz.timezone("Europe/Prague")),
            )
            session.add(invite)
        session.commit()
