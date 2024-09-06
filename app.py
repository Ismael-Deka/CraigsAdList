"""Module for running flask and setting up endpoints"""

import os
import flask
import ibm_boto3
import traceback

from flask_login import current_user, login_required, login_user, logout_user, LoginManager
from werkzeug.security import generate_password_hash, check_password_hash
from ibm_botocore.client import Config
from dotenv import load_dotenv, find_dotenv


from db_utils import (
    create_platform,
    get_results,
    get_profile_pic,
    upload_profile_pic,
    delete_account
)

from models import db, Account, Campaign, Platform

load_dotenv(find_dotenv())

app = flask.Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.getenv("SECRET_KEY")

cos = ibm_boto3.client('s3',
                         ibm_api_key_id=os.getenv("IBM_API_KEY_ID"),
                         ibm_service_instance_id=os.getenv('IBM_SERVICE_ID'),
                         ibm_auth_endpoint=os.getenv('IBM_AUTH_ENDPOINT'),
                         config=Config(signature_version='oauth'),
                         endpoint_url=os.getenv('ENDPOINT'))

db.init_app(app)
with app.app_context():

    db.create_all()

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    """Stolen from some tutorial on flask-login. While it is not explicitly used
    here, it is required by flask-login"""
    print(f"Current User ID: {user_id}")
    return Account.query.get(int(user_id))

# Decorator to check authentication
def require_auth(func):
    @login_required
    def auth_wrapper(*args, **kwargs):
        if flask.g.user:  # Assuming Flask-Login is used and g.user contains the current user
            return func(*args, **kwargs)
        else:
            return flask.jsonify({"message": "Authentication required"}), 401

    return auth_wrapper
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
@bp.route("/login")
@bp.route("/signup")
@bp.route("/new_platform")
@bp.route("/settings")
@bp.route("/profile/<int:user_id>")
@bp.route('/platform/<int:platform_id>')
@bp.route("/messages/<string:folder>")
@bp.route("/search/<string:search_type>")
def index(user_id=-1,platform_id=-1,folder="",search_type=""):
    """Root endpoint"""
    # NB: DO NOT add an "index.html" file in your normal templates folder
    # Flask will stop serving this React page correctly
    return flask.render_template("index.html")


@bp.route("/handle_login", methods=["POST"])
def handle_login():
    """Handle login"""
    if flask.request.method == "POST":
        user = Account.query.filter_by(email=flask.request.json["email"]).first()
        if user is not None and check_password_hash(
            user.password, flask.request.json["password"]
        ):
            is_login_successful = login_user(user)
            return flask.jsonify(
                {"is_login_successful": is_login_successful, "error_message": ""}
            )
        # if password is incorrect
        if user is not None and not check_password_hash(
            user.password, flask.request.json["password"]
        ):
            return flask.jsonify(
                {"is_login_successful": False, "error_message": "Incorrect password"}
            )
        # if the email is NOT present in the database, send a message saying
        # “there is no user with this email” and give a link to sign up page
        if user is None:
            return flask.jsonify(
                {
                    "is_login_successful": False,
                    "error_message": "No user with this email",
                }
            )

    return flask.jsonify(
        {"is_login_successful": False, "error_message": "Wrong method"}
    )

@bp.route("/is_username_taken", methods=["GET"])
def is_username_taken():
    args = flask.request.args
    user = Account.query.filter(
            (Account.username == args.get("username")) 
        ).first()
    return flask.jsonify({"is_username_taken":user is not None})


@bp.route("/handle_signup", methods=["POST"])
def handle_signup():
    """Handle signup"""
    if flask.request.method == "POST":
        # Check if all required fields are filled
        required_fields = ["username", "email", "password"]
        for field in required_fields:
            if not flask.request.form.get(field):
                return flask.jsonify(
                    {
                        "is_signup_successful": False,
                        "error_message": f"{field} is required."
                    }
                )

        # Check if the user with the same username or email already exists
        user = Account.query.filter(
            (Account.username == flask.request.form["username"]) |
            (Account.email == flask.request.form["email"])
        ).first()

        if user is None:
            # Create a new user with additional fields like phone, bio, full_name
            is_platform_owner = flask.request.form.get("platform_owner", False)
            is_platform_owner = True if is_platform_owner == 'true' else False
            new_user = Account(
                username=flask.request.form["username"],
                email=flask.request.form["email"],
                password=generate_password_hash(flask.request.form["password"]),
                full_name=flask.request.form.get("full_name"),
                platform_owner=is_platform_owner
            )

            # Add and commit new user to the database
            db.session.add(new_user)
            db.session.commit()

            # Verify that the new user was successfully created
            check_new_user = Account.query.filter_by(
                email=flask.request.form["email"]
            ).first()

            is_signup_successful = check_new_user is not None

            if is_signup_successful:
                is_new_pfp_chosen = flask.request.form["new_pfp_chosen"]
                if is_new_pfp_chosen == 'true':
                    is_pfp_uploaded= upload_profile_pic(cos, check_new_user.id, flask.request.files["profile_pic"],"users")
                    if is_pfp_uploaded:
                        check_new_user.profile_pic = check_new_user.id
                        db.session.commit()
                        return flask.jsonify(
                            {"is_signup_successful": True, "error_message": ""}
                        )
                    else:
                        delete_account(check_new_user.id)
                        return flask.jsonify(
                            {"is_signup_successful": False, "error_message": "There was a problem uploading your new profile picture. Please try again."}
                        )
                else:
                    check_new_user.profile_pic = -1
                    db.session.commit()
                    return flask.jsonify(
                            {"is_signup_successful": True, "error_message": ""}
                        )
        else:
            return flask.jsonify(
                {
                    "is_signup_successful": False,
                    "error_message": "A user with that username or email already exists."
                }
            )

    return flask.jsonify(
        {
            "is_signup_successful": False,
            "error_message": "Invalid request method."
        }
    )

@require_auth
@bp.route("/handle_logout", methods=["POST"])
def handle_logout():
    """Handles logout"""
    logout_user()
    return is_logged_in()


@bp.route("/platformowner", methods=["GET"])
def is_platform_owner():
    """returns true if current user is a platform owner"""
    return flask.jsonify({"is_user_platform_owner": current_user.platform_owner})

@bp.route("/is_logged_in", methods=["GET"])
def is_logged_in():
    """checks whether a user is logged in"""
    return flask.jsonify({"isuserloggedin": current_user.is_authenticated})

@require_auth
@bp.route("/get_current_user", methods=["GET"])
def get_current_user():
    """returns current logged in user"""
    if current_user is not None:
        return flask.jsonify({
            "current_user": current_user.username,
            "id": current_user.id,
            "pfp": get_profile_pic(current_user.profile_pic, 'users')}),200
    else:
        flask.abort(404)

@require_auth
@bp.route("/account_info", methods=["GET"])
def account_info():
    """Return current user's JSON data"""
    if(current_user.is_authenticated):
        user_id = flask.request.args.get("id",default=current_user.id)
    else:
         user_id = flask.request.args.get("id")
    if(user_id is None):
        flask.abort(404)
    account = Account.query.filter_by(id=user_id).first()
    campaign_log = Campaign.query.filter_by(creator_id=user_id).all()
    platform_log = Platform.query.filter_by(owner_id=user_id).all()
    campaign_list = []
    for i in campaign_log:
        campaign_dict = {}
        campaign_dict["id"] = i.id
        campaign_dict["title"] = i.title
        campaign_dict["topics"] = i.topics
        campaign_dict["description"] = i.description
        campaign_dict["budget"] = i.budget
        campaign_list.append(campaign_dict)
    platform_list = []
    for i in platform_log:
        
        platform_dict = {}
        platform_dict["id"]=i.id
        platform_dict["platformName"] = i.platform_name
        platform_dict["impressions"] = i.impressions
        platform_dict["topics"] = i.topics
        platform_dict["pricePerAdView"] = i.preferred_price
        platform_list.append(platform_dict)
    try:
        return flask.jsonify(
            {"account": {
                "username": account.username, 
                "email":account.email, 
                "pfp":get_profile_pic(account.profile_pic, "users") }, 
             "campaigns": campaign_list, 
             "platforms": platform_list}
        ), 200
    except Exception as e:
            tb = traceback.format_exc()
            print(f"An error occurred: {e}")
            print(tb)
            flask.abort(500)


@bp.route("/return_selected_platform", methods=["GET"])
def get_platforms_by_id():
    """get platforms by id"""
    args = flask.request.args
    platform = Platform.query.filter_by(id=args.get("id")).first()
    if(platform != None):
        return flask.jsonify(
                {
                    "id": platform.id,
                    "ownerName": Account.query.filter_by(id=platform.owner_id).first().username,
                    "platformName": platform.platform_name,
                    "impressions": '{:,}'.format(platform.impressions),
                    "topics": platform.topics,
                    "pricePerAdView": platform.preferred_price,
                    "pfp": get_profile_pic(platform.id, "platforms")
                }
            ),200
    else:
        flask.abort(404)

@require_auth
@bp.route("/change_pass", methods=["POST"])
def change_pass():
    original_pass = flask.request.form['original_pass']
    new_pass = flask.request.form['new_pass']
    error_message=""

    if check_password_hash(
            current_user.password, original_pass
        ):
        user = Account.query.filter_by(id=current_user.id).first()
        user.password = generate_password_hash(new_pass)
        try:
            success=db.session.commit() is None
            current_user.password = user.password
        except Exception as e:
            db.session.rollback()
            success = False
            error_message = "There was a problem when changing your password. Please try again."
        
    else:
        success = False
        error_message = 'Original password is incorrect'

    return flask.jsonify(
        {
            "success": success,
            "error": error_message,
        }
    )





@require_auth
@bp.route("/edit_user_profile", methods=["POST"])
def edit_profile():
    username = flask.request.form['username']
    email = flask.request.form['email']
    is_pfp_changed = flask.request.form['is_pfp_changed']
    if is_pfp_changed == "true":
        pfp = flask.request.files["pfp"]
    user_id = current_user.id
    success = False
    account = Account.query.filter_by(id=user_id).first()
    if account:

        account.username = username
        account.email = email
        if is_pfp_changed == "true":
            pfp_id = current_user.profile_pic
            if pfp_id == -1:
                pfp_id = current_user.id
            is_pfp_upload_success = upload_profile_pic(cos, current_user.profile_pic, pfp,'users')
        else:
            is_pfp_upload_success = False
        try:
            
            success = db.session.commit() is None
            current_user.username = username
        except Exception as e:
            db.session.rollback()
            success = False
        
        return flask.jsonify({"success":True, "pfp_upload":is_pfp_upload_success})
    else:
        return flask.jsonify(
            {
                 "success": success,
                 "pfp_upload": False,
            }
        )
    

@require_auth
@bp.route("/create_platform", methods=["POST"])
def create_new_platform():
    is_successful = create_platform(
        platform_name=flask.request.json["platform_name"],
        topics=flask.request.json["topic_list"],
        impressions=flask.request.json["impressions"],
        preferred_price=flask.request.json["preferred_price"],
        show_platform=flask.request.json["show_platform"])
    return flask.jsonify({"success": is_successful})

@bp.route("/return_results", methods=["GET"])
def return_results():
    """Returns JSON with search results"""
    args = flask.request.args
    results = get_results(args)
    if(results is not None):
        if(args.get("for") == "platforms"):
            return flask.jsonify(
                {
                    "success": True,
                    "total_results": results['result_count'],
                    "platformsData": results['results_data'],
                }
            )
        elif(args.get("for") == "campaigns"):
            return flask.jsonify(
                {
                    "success": True,
                    "total_results": results['result_count'],
                    "campaignsData": results['results_data'],
                }
            )
        elif args.get("for") == "users":

            return flask.jsonify(
                {
                    "success": True,
                    "total_results": results['result_count'],
                    "accountsData": results['results_data'],
                }
            )
    return flask.jsonify({"success": False})



app.register_blueprint(bp)

if __name__ == "__main__":
    app.debug=True
    app.run("0.0.0.0")## Add ssl after deployment -- ssl_context=('localhost.crt', 'localhost.key'))