# pylint: disable=E1101, R0903, R0913
# E1101 -- disabled SQLAlchemy warning, pylint does not understand it
# R0903 -- too few public methods, not a porblem
# R0913 -- too many arguments, not a problem
""" Module for database models """

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

import time

db = SQLAlchemy()

class Account(UserMixin, db.Model):
    """Model for user account"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(256), index=True, unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    email = db.Column(db.String(256), index=True, unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    platform_owner = db.Column(db.Boolean, default=False)
    profile_pic = db.Column(db.Integer, default=-1)
    date_created = db.Column(db.Integer, default=int(db.func.extract('epoch', db.func.now())))
    last_login = db.Column(db.Integer, nullable=True)
    full_name = db.Column(db.String(256), nullable=True)

    def __init__(self, username, password, email, full_name=None, platform_owner=False, profile_pic=-1, bio=None, phone=None):
        self.username = username
        self.password = password
        self.email = email
        self.full_name = full_name
        self.platform_owner = platform_owner
        self.profile_pic = profile_pic
        self.date_created = int(db.func.extract('epoch', db.func.now()))  # Current Unix timestamp
        self.last_login = None
        self.bio = bio
        self.phone = phone

    def __repr__(self):
        return f"<Account {self.username}>" 

class Campaign(db.Model):
    """Model for Ad Campaigns"""
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey("account.id"))
    title = db.Column(db.String(128))
    topics = db.Column(db.String(128))  # CSV
    description = db.Column(db.Text, nullable=True)
    budget = db.Column(db.Float, nullable=True) # in dollars
    currency = db.Column(db.String(3), nullable=False)  # New currency column, using 3-character ISO codes
    show_in_list = db.Column(db.Boolean, default=False)
    start_date = db.Column(db.Integer, nullable=True)
    end_date = db.Column(db.Integer, nullable=True)
    
    is_active = db.Column(db.Boolean, default=True)
    
    def __init__(self, creator_id, title, topics, currency, show_in_list, description=None, start_date=None, end_date=None, budget=None):
        self.creator_id = creator_id
        self.title = title
        self.topics = topics
        self.description = description
        self.currency = currency
        self.show_in_list = show_in_list
        self.start_date = start_date
        self.end_date = end_date
        self.budget = budget
    def __repr__(self):
        return f"<Campaign {self.title}>" 


class Platform(db.Model):
    """Class for platforms"""
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("account.id"))
    show_platform = db.Column(db.Boolean, default=False)
    platform_name = db.Column(db.String(128), index=True, unique=True)
    description = db.Column(db.Text, nullable=True)
    impressions = db.Column(db.Integer, default=0)
    impression_type = db.Column(db.String(64), nullable=False)
    topics = db.Column(db.String(128), index=True)  # CSV
    preferred_price = db.Column(db.Integer, index=True) # in cents
    currency = db.Column(db.String(3), nullable=False)  # using 3-character ISO codes
    medium = db.Column(db.String(128), nullable=True)  
    
    date_created = db.Column(db.Integer, default=db.func.extract('epoch', db.func.now()))
    is_active = db.Column(db.Boolean, default=True)
    last_updated = db.Column(db.Integer, default=db.func.extract('epoch', db.func.now()), onupdate=db.func.extract('epoch', db.func.now()))

    def __init__(self, owner_id, show_platform, platform_name, impressions, impression_type, topics, preferred_price, currency, medium, description=None):
        self.owner_id = owner_id
        self.show_platform = show_platform
        self.platform_name = platform_name
        self.impressions = impressions
        self.impression_type = impression_type
        self.topics = topics
        self.preferred_price = preferred_price
        self.currency = currency
        self.description = description
        self.medium = medium
    def __repr__(self):
        return f"<Platform {self.platform_name}>"   
