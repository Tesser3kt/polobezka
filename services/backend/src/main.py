import os
import json
import pytz
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session, select
from sqlalchemy.engine import URL

from .models import *
from .populate_db import (
    insert_students,
    insert_teachers,
    random_populate_invites,
    random_populate_teams,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_DATABASE = os.getenv("DB_DATABASE")
DB_PORT = os.getenv("DB_PORT")

url_object = URL.create(
    "mysql+pymysql",
    username=DB_USERNAME,
    password=DB_PASSWORD,
    host=DB_HOST,
    database=DB_DATABASE,
    port=DB_PORT,
)
engine = create_engine(url_object)
tz = pytz.timezone("Europe/Prague")


@app.get("/")
def root():
    return "Hello, world!"


@app.get("/api/users/")
async def read_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
    return users


@app.get("/api/classes/")
async def read_classes():
    with Session(engine) as session:
        classes = session.exec(select(Class)).all()
    return classes


@app.get("/api/teams/")
async def read_teams():
    with Session(engine) as session:
        teams = session.exec(select(Team)).all()
    return teams


@app.get("/api/activities/")
async def read_activities():
    with Session(engine) as session:
        activities = session.exec(select(Activity)).all()
    return activities


@app.get("/api/invites/")
async def read_invites():
    with Session(engine) as session:
        invites = session.exec(select(Invite)).all()
    return invites


@app.get("/api/milestones/")
async def read_milestones():
    with Session(engine) as session:
        milestones = session.exec(select(Milestone)).all()
    return milestones


@app.get("/api/user/{id}/")
async def read_user(id: int):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.id == id)).first()
    if user:
        return user
    else:
        return {"error": "Uživatel nebyl nalezen."}


@app.get("/api/user/")
async def read_user(email: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
    if user:
        return user
    else:
        return {"error": "Uživatel nebyl nalezen."}


@app.get("/api/class/")
async def read_class(class_info: int | str):
    if isinstance(class_info, int):
        query = select(Class).where(Class.id == class_info)
    elif isinstance(class_info, str):
        query = select(Class).where(Class.name == class_info)
    else:
        return {"error": "Třída nebyla nalezena."}

    with Session(engine) as session:
        class_ = session.exec(query).first()
    if class_:
        return class_


@app.get("/api/team/")
async def read_team(team_info: int | str):
    if isinstance(team_info, int):
        query = select(Team).where(Team.id == team_info)
    elif isinstance(team_info, str):
        query = select(Team).where(Team.name == team_info)
    else:
        return {"error": "Tým nebyl nalezen."}

    with Session(engine) as session:
        team = session.exec(query).first()
    if team:
        return team


@app.put("/api/user/{user_id}/", response_model=User)
async def update_user(user_id: int, user_data: User):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.id == user_id)).first()
        if user:
            user.email = user_data.email
            user.nickname = user_data.nickname
            user.team_id = user_data.team_id
            user.class_id = user_data.class_id
            session.add(user)
            session.commit()
            return user
        else:
            return {"error": "Uživatel nebyl nalezen."}


@app.post("/api/team/")
async def create_team(request: Request):
    data = await request.json()

    with Session(engine) as session:
        try:
            team = Team(**data)
            session.add(team)
            session.commit()
            return {
                "id": team.id,
                "name": team.name,
            }
        except KeyError:
            return {"error": "Chybějící data."}


@app.delete("/api/team/{team_id}/")
async def delete_team(team_id: int):
    with Session(engine) as session:
        team = session.exec(select(Team).where(Team.id == team_id)).first()
        if team:
            session.delete(team)
            session.commit()
            return {"message": "Tým byl smazán."}
        else:
            return {"error": "Tým nebyl nalezen."}


@app.post("/api/activity/")
async def create_activity(request: Request):
    data = await request.json()

    with Session(engine) as session:
        try:
            user = session.exec(select(User).where(User.id == data["user_id"])).first()
            if user:
                activity = Activity(**data, date=datetime.now(tz=tz))
                session.add(activity)
                session.commit()
                return {
                    "id": activity.id,
                    "type": activity.type,
                    "unit_count": activity.unit_count,
                    "date": activity.date,
                    "user_id": activity.user_id,
                }
            else:
                return {"error": "Uživatel nebyl nalezen."}
        except KeyError:
            return {"error": "Chybějící data."}


@app.delete("/api/activity/{activity_id}/")
async def delete_activity(activity_id: int):
    with Session(engine) as session:
        activity = session.exec(
            select(Activity).where(Activity.id == activity_id)
        ).first()
        if activity:
            session.delete(activity)
            session.commit()
            return {"message": "Aktivita byla smazána."}
        else:
            return {"error": "Aktivita nebyla nalezena."}


@app.put("/api/invite/{invite_id}/", response_model=Invite)
async def renew_invite(invite_id: int):
    with Session(engine) as session:
        invite = session.exec(select(Invite).where(Invite.id == invite_id)).first()
        if invite:
            invite.date = datetime.now(tz=tz)
            session.add(invite)
            session.commit()
            return invite
        else:
            return {"error": "Pozvánka nebyla nalezena."}


@app.post("/api/invite/", response_model=Invite)
async def create_invite(request: Request):
    data = await request.json()

    with Session(engine) as session:
        try:
            team_from = session.exec(
                select(Team).where(Team.id == data["team_from_id"])
            ).first()
            user_to = session.exec(
                select(User).where(User.id == data["user_to_id"])
            ).first()
            if team_from and user_to:
                invite = Invite(**data, date=datetime.now(tz=tz))
                session.add(invite)
                session.commit()
                return {
                    "id": invite.id,
                    "date": invite.date,
                    "team_from_id": invite.team_from_id,
                    "user_to_id": invite.user_to_id,
                }
            else:
                return {"error": "Tým nebo uživatel nebyl nalezen."}
        except KeyError:
            return {"error": "Chybějící data."}


@app.delete("/api/invite/{invite_id}/")
async def delete_invite(invite_id: int):
    with Session(engine) as session:
        invite = session.exec(select(Invite).where(Invite.id == invite_id)).first()
        if invite:
            session.delete(invite)
            session.commit()
            return {"message": "Pozvánka byla smazána."}
        else:
            return {"error": "Pozvánka nebyla nalezena."}


@app.post("/api/milestone/")
async def create_milestone(request: Request):
    data = await request.json()

    with Session(engine) as session:
        try:
            milestone = Milestone(**data)
            session.add(milestone)
            session.commit()
            return {
                "number": milestone.number,
                "user_id": milestone.user_id,
            }
        except KeyError:
            return {"error": "Chybějící data."}


@app.delete("/api/milestone/{user_id}/{milestone_number}/")
async def delete_milestone(user_id: int, milestone_number: int):
    with Session(engine) as session:
        milestone = session.exec(
            select(Milestone).where(
                Milestone.user_id == user_id and Milestone.number == milestone_number
            )
        ).first()
        print(milestone.number, milestone.user_id)
        if milestone:
            session.delete(milestone)
            session.commit()
            return {"message": "Milník byl smazán."}
        else:
            return {"error": "Milník nebyl nalezen."}


if __name__ == "__main__":
    # SQLModel.metadata.create_all(engine)
    # insert_students(engine)
    # insert_teachers(engine)
    # random_populate_teams(engine)
    # random_populate_invites(engine)
    ...
