# pylint: disable=E1101, R0903, R0913
# E1101 -- disabled SQLAlchemy warning, pylint does not understand it
# R0903 -- too few public methods, not a porblem
# R0913 -- too many arguments, not a problem
""" Module for database models """

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class Account(UserMixin, db.Model):
    """Model for user account"""

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(256), index=True, unique=True)
    password = db.Column(db.String(256), index=True)
    email = db.Column(db.String(256), index=True, unique=True)
    channel_owner = db.Column(db.Boolean, default=False)

    def __init__(self, username, password, email, channel_owner):
        self.username = username
        self.password = password
        self.email = email
        self.channel_owner = channel_owner

class Offers(db.Model):
     """Model for offers"""
     id = db.Column(db.Integer, primary_key=True)
     creator_id = db.Column(db.Integer, db.ForeignKey("account.id"))
     channel_id = db.Column(db.Integer, db.ForeignKey("channel.id"))
     owner_id = db.Column(db.Integer, db.ForeignKey("account.id"))
     reward = db.Column(db.Integer)
     message = db.Column(db.String(128))
     def __init__(self, creator_id, channel_id, owner_id , reward, message):
        self.creator_id = creator_id
        self.channel_id = channel_id
        self.owner_id  = owner_id 
        self.reward = reward
        self.message = message
    
class Responses(db.Model):
     """Model for responses"""
     id = db.Column(db.Integer, primary_key=True)
     creator_id = db.Column(db.Integer, db.ForeignKey("account.id"))
     ad_id = db.Column(db.Integer, db.ForeignKey("ad.id"))
     owner_id = db.Column(db.Integer, db.ForeignKey("account.id"))
     accepted = db.Column(db.Boolean, default=False)
     message = db.Column(db.String(128))

     def __init__(self, creator_id, ad_id, owner_id , accepted, message):
        self.creator_id = creator_id
        self.ad_id = ad_id
        self.owner_id  = owner_id 
        self.accepted = accepted
        self.message = message

class Ad(db.Model):
    """Model for ads"""

    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey("account.id"))
    title = db.Column(db.String(128))
    topics = db.Column(db.String(128))  # CSV
    text = db.Column(db.String(128))
    reward = db.Column(db.Integer)
    show_in_list = db.Column(db.Boolean, default=False)

    def __init__(self, creator_id, title, topics, text, reward, show_in_list):
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
    topics = db.Column(db.String(128), index=True)  # CSV
    preferred_reward = db.Column(db.Integer, index=True) 

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
