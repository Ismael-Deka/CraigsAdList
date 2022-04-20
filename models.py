# pylint: disable=E1101, R0903
# disabled SQLAlchemy warning, pylint does not understand it
# R0903 -- too few public methods, we might consider fixing it?
""" Module for database models """

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class Account(UserMixin, db.Model):
    """Model for user account"""

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), index=True, unique=True)
    password = db.Column(db.String(128), index=True)
    email = db.Column(db.String(128), index=True, unique=True)
    channel_owner = db.Column(db.Boolean, default=False)

    def __init__(self, username, password, email, channel_owner):
        self.username = username
        self.password = password
        self.email = email
        self.channel_owner = channel_owner


class Ad(db.Model):
    """Model for ads"""

    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey("account.id"))
    title = db.Column(db.String(128))
    topics = db.Column(db.String(128))  # CSV
    text = db.Column(db.String(128))
    reward = db.Column(db.Integer)
    show_in_list = db.Column(db.Boolean, default=False)

    def __init__(self, id, creator_id, title, topics, text, reward, show_in_list):
        self.id = id
        self.creator_id = creator_id
        self.title = title
        self.topics = topics
        self.text = text
        self.reward = reward
        self.show_in_list = show_in_list


class Channel(db.Model):
    """Class for channels"""

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("account.id"))
    show_channel = db.Column(db.Boolean, default=False)
    channel_name = db.Column(db.String(128), index=True, unique=True)
    subscribers = db.Column(db.Integer, default=0)
    topics = db.Column(db.String(128), index=True, unique=True)  # CSV
    preferred_reward = db.Column(db.String(128), index=True, unique=True)

    def __init__(
        self,
        owner_id,
        show_channel,
        channel_name,
        subscribers,
        topics,
        preferred_reward,
    ):
        self.owner_id = owner_id
        self.show_channel = show_channel
        self.channel_name = channel_name
        self.subscribers = subscribers
        self.topics = topics
        self.preferred_reward = preferred_reward
