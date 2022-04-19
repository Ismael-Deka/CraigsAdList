# pylint: disable=W0611, W0107, W0613
# first two warning are disabled for starter code, we should enable them later.
# 3rd is about unused variable in 'def load_user(user_id):', maybe we can fix it

"""Module for running flask and setting up endpoints"""

import os

import flask

from flask_login import current_user, login_user, logout_user, LoginManager

from flask import request

from db_utils import createAd, getAllAccounts, getAllAds

from werkzeug.security import generate_password_hash, check_password_hash

from dotenv import load_dotenv, find_dotenv

from models import db, Account, Ad, Channel

load_dotenv(find_dotenv())

app = flask.Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.getenv("SECRET_KEY")

db.init_app(app)
with app.app_context():

    db.create_all()

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    """Stolen from some tutorial on flask-login. While it is not explicitly used
    here, it is required by flask-login"""
    return Account.query.get(int(user_id))


# set up a separate route to serve the index.html file generated
# by create-react-app/npm run build.
# By doing this, we make it so you can paste in all your old app routes
# from Milestone 2 without interfering with the functionality here.
bp = flask.Blueprint(
    "bp",
    __name__,
    template_folder="./static/react",
)


# route for serving React page
@bp.route("/")
@bp.route("/channels")
@bp.route("/login")
@bp.route("/signup")
@bp.route("/acount")
@bp.route("/new_add")
@bp.route("/new_channel")
@bp.route("/new_response")
@bp.route("/new_offer")
def index():
    """Root endpoint"""
    # NB: DO NOT add an "index.html" file in your normal templates folder
    # Flask will stop serving this React page correctly
    return flask.render_template("index.html")


@bp.route("/handle_login", methods=["POST"])
def handle_login():
    """Handle login"""
    if flask.request.method == "POST":
        user = Account.query.filter_by(email=flask.request.json["email"]).first()
        if user != None and check_password_hash(
            user.password, flask.request.json["password"]
        ):
            is_login_successful = login_user(user)
            return flask.jsonify(
                {"is_login_successful": is_login_successful, "error_message": ""}
            )
        # if password is incorrect
        elif user != None and not check_password_hash(
            user.password, flask.request.json["password"]
        ):
            return flask.jsonify(
                {"is_login_successful": False, "error_message": "Incorrect password"}
            )
        # if the email is NOT present in the database, send a message saying “there is no user with this email”
        # and give a link to sign up page
        elif user == None:
            return flask.jsonify(
                {
                    "is_login_successful": False,
                    "error_message": "No user with this email",
                }
            )


@bp.route("/handle_signup", methods=["POST"])
def handle_signup():
    """Handle signup"""
    if flask.request.method == "POST":
        u = Account.query.filter_by(username=flask.request.json["username"]).first()
        if u is None:
            user = Account(
                username=flask.request.json["username"],
                email=flask.request.json["email"],
                password=generate_password_hash(flask.request.json["password"]),
                channel_owner=flask.request.json["channel_owner"],
            )
            db.session.add(user)
            db.session.commit()
            new_user = Account.query.filter_by(
                email=flask.request.json["email"]
            ).first()
            is_signup_successful = new_user is not None
            return flask.jsonify(
                {"is_signup_successful": is_signup_successful, "error_message": ""}
            )
        elif (
            flask.request.json["username"] == ""
            or flask.request.json["email"] == ""
            or flask.request.json["password"] == ""
        ):
            return flask.jsonify(
                {
                    "is_signup_successful": False,
                    "error_message": "Fill in all the required data",
                }
            )
        elif u is not None:
            return flask.jsonify(
                {
                    "is_signup_successful": False,
                    "error_message": "A user with such username/email already exists",
                }
            )


@bp.route("/handle_logout", methods=["POST"])
def handle_logout():
    logout_user()
    return is_logged_in()


@app.route("/getaccounts", methods=["GET"])
def getAccounts():
    return flask.jsonify({"accounts": getAllAccounts()})


@bp.route("/is_logged_in", methods=["GET"])
def is_logged_in():
    if current_user.is_authenticated == True:
        return flask.jsonify({"isuserloggedin": True})
    else:
        return flask.jsonify({"isuserloggedin": False})


@bp.route("/account_info", methods=["GET"])
def account_info():
    """Return current user's JSON data"""
    pass


@bp.route("/return_ads", methods=["GET"])
def return_ads():
    return flask.jsonify({"ads": getAllAds()})


@bp.route("/return_channels", methods=["GET"])
def return_channels():
    """Returns JSON with channels"""
    args = flask.request.args
    if args.get("for") == "channelsPage":
        # return channels for channels page
        channels = Channel.query.filter_by(show_channel=True).all()
        channels_data = []
        for channel in channels:
            channel.topics = channel.topics.split(",")
            channels_data.append(
                {
                    "id": channel.id,
                    "ownerId": channel.owner_id,
                    "showChannel": channel.show_channel,
                    "channelName": channel.channel_name,
                    "subscribers": channel.subscribers,
                    "topics": channel.topics,
                    "preferredReward": channel.preferred_reward,
                }
            )
        # trying to jsonify a list of channel objects gives an error
        return flask.jsonify(
            {
                "success": True,
                "channels_data": channels_data,
            }
        )
    return flask.jsonify({"success": False})


@bp.route("/add_channel", methods=["POST"])
def add_channel():
    """Add channel info to database (in the first sprint it can be done only on signup)"""
    pass


@bp.route("/add_ad", methods=["POST"])
def add_ad():
    createAd(
        flask.request.json["title"],
        flask.request.json["topics"],
        flask.request.json["text"],
        flask.request.json["reward"],
    )
    return flask.jsonify({"success": True})


@bp.route("/proccess_emails", methods=["POST"])
def proccess_emails():
    if request.method == "POST":
        data = flask.request.form
        email = data["email"]
        user = Account.query.filter_by(email=email).first()
        if user is not None:
            return flask.jsonify({"success": True})
        else:
            return flask.jsonify({"success": False})


app.register_blueprint(bp)

if __name__ == "__main__":
    app.run()
