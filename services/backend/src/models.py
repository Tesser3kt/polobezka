from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship


class Team(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    members: List["User"] = Relationship(back_populates="team")
    invites: List["Invite"] = Relationship(back_populates="team_from")


class Class(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    students: List["User"] = Relationship(back_populates="class_")


class Activity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: Optional[str]
    unit_count: int = Field(nullable=False)
    date: datetime = Field(default=datetime.now, nullable=False)

    user_id: int = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="activities")


class Invite(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime = Field(default=datetime.now, nullable=False)

    team_from_id: int = Field(foreign_key="team.id")
    team_from: Team = Relationship(back_populates="invites")
    user_to_id: int = Field(foreign_key="user.id")
    user_to: "User" = Relationship(back_populates="invites")


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nickname: str = Field(default=None, nullable=True)
    email: str

    team_id: Optional[int] = Field(default=None, foreign_key="team.id")
    team: Optional[Team] = Relationship(back_populates="members")
    class_id: Optional[int] = Field(default=None, foreign_key="class.id")
    class_: Optional[Class] = Relationship(back_populates="students")

    activities: List[Activity] = Relationship(back_populates="user")
    invites: List[Invite] = Relationship(back_populates="user_to")
