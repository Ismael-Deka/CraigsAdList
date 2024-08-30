"""Module for running flask and setting up endpoints"""

import os
import flask
import ibm_boto3

from flask_login import current_user, login_required, login_user, logout_user, LoginManager
from werkzeug.security import generate_password_hash, check_password_hash
from ibm_botocore.client import Config
from dotenv import load_dotenv, find_dotenv


from db_utils import (
    create_channel,
    create_offer,
    get_all_accounts,
    get_all_ads,
    get_ads,
    get_results,
    get_profile_pic,
    upload_profile_pic
)

from models import db, Account, Ad, Channel

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
@bp.route("/ads")
@bp.route("/search/<string:search_type>")
@bp.route("/login")
@bp.route("/signup")
@bp.route("/new_add")
@bp.route("/new_channel")
@bp.route("/new_response")
@bp.route("/new_offer")
@bp.route("/profile/<int:user_id>")
@bp.route("/settings")
@bp.route('/platform/<int:platform_id>')
@bp.route("/messages/<string:folder>")
def index(user_id=-1,platform_id=-1,folder="",search_type=""):
    """Root endpoint"""
    # NB: DO NOT add an "index.html" file in your normal templates folder
    # Flask will stop serving this React page correctly
    return flask.render_template("index.html")


@bp.route("/handle_login", methods=["POST"])
def handle_login():
    """Handle login"""
    if flask.request.method == "POST":
        print(flask.request.json["email"])
        user = Account.query.filter_by(email=flask.request.json["email"]).first()
        print(Account.query.all())
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


@bp.route("/handle_signup", methods=["POST"])
def handle_signup():
    """Handle signup"""
    if flask.request.method == "POST":
        user = Account.query.filter_by(username=flask.request.json["username"]).first()
        if user is None:
            new_user = Account(
                username=flask.request.json["username"],
                email=flask.request.json["email"],
                password=generate_password_hash(flask.request.json["password"]),
                channel_owner=flask.request.json["channel_owner"],
            )
            db.session.add(new_user)
            db.session.commit()
            check_new_user = Account.query.filter_by(
                email=flask.request.json["email"]
            ).first()
            is_signup_successful = check_new_user is not None
            return flask.jsonify(
                {"is_signup_successful": is_signup_successful, "error_message": ""}
            )
        if (
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
        if user is not None:
            return flask.jsonify(
                {
                    "is_signup_successful": False,
                    "error_message": "A user with such username/email already exists",
                }
            )

    return flask.jsonify(
        {
            "is_signup_successful": False,
            "error_message": "Wrong method",
        }
    )

@require_auth
@bp.route("/handle_logout", methods=["POST"])
def handle_logout():
    """Handles logout"""
    logout_user()
    return is_logged_in()


@bp.route("/channelowner", methods=["GET"])
def is_channel_owner():
    """returns true if current user is a channel owner"""
    return flask.jsonify({"is_user_channel_owner": current_user.channel_owner})

@require_auth
@app.route("/getaccounts", methods=["GET"])
def get_accounts():
    """Returns all accounts"""
    return flask.jsonify({"accounts": get_all_accounts()})


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
            "pfp": get_profile_pic(cos, current_user.profile_pic)}),200
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
    ad_log = Ad.query.filter_by(creator_id=user_id).all()
    channel_log = Channel.query.filter_by(owner_id=user_id).all()
    ad_list = []
    for i in ad_log:
        ad_dict = {}
        ad_dict["id"] = i.id
        ad_dict["title"] = i.title
        ad_dict["topics"] = i.topics
        ad_dict["text"] = i.text
        ad_dict["reward"] = i.reward
        ad_list.append(ad_dict)
    channel_list = []
    for i in channel_log:
        
        channel_dict = {}
        channel_dict["id"]=i.id
        channel_dict["platformName"] = i.channel_name
        channel_dict["subCount"] = i.subscribers
        channel_dict["topics"] = i.topics
        channel_dict["pricePerAdView"] = i.preferred_reward
        channel_list.append(channel_dict)
    try:
        return flask.jsonify(
            {"account": {
                "username": account.username, 
                "email":account.email, 
                "pfp":get_profile_pic(cos, account.profile_pic) }, 
             "ads": ad_list, 
             "platforms": channel_list}
        ), 200
    except Exception as e:
            print(f"An error occurred: {e.with_traceback()}")
            flask.abort(500)


@bp.route("/return_ads", methods=["GET"])
def return_ads():
    """Returns JSON with ads"""
    args = flask.request.args
    if args.get("for") == "adsPage":
        # return ads for ads page, filtered according to args
        # trying to jsonify a list of channel objects gives an error
        return flask.jsonify(
            {
                "success": True,
                "adsData": get_ads(args),
            }
        )
    return flask.jsonify({"ads": get_all_ads()})


@bp.route("/return_selected_channel", methods=["GET"])
def get_channels_by_id():
    """get channels by id"""
    args = flask.request.args
    channel = Channel.query.filter_by(id=args.get("id")).first()
    if(channel != None):
        return flask.jsonify(
                {
                    "id": channel.id,
                    "ownerName": Account.query.filter_by(id=channel.owner_id).first().username,
                    "platformName": channel.channel_name,
                    "subCount": '{:,}'.format(channel.subscribers),
                    "topics": channel.topics,
                    "pricePerAdView": channel.preferred_reward,
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
@bp.route("/edit_profile", methods=["POST"])
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
            is_pfp_upload_success = upload_profile_pic(cos, current_user.profile_pic, pfp)
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
@bp.route("/create_channel", methods=["POST"])
def create_new_channel():
    is_successful = create_channel(
        channel_name=flask.request.json["channel_name"],
        topics=flask.request.json["topic_list"],
        subscribers=flask.request.json["sub_count"],
        preferred_reward=flask.request.json["preferred_price"],
        show_channel=flask.request.json["show_channel"])
    return flask.jsonify({"success": is_successful})

@bp.route("/return_selected_ads", methods=["GET"])
def get_ads_by_id():
    """get channels by id"""
    args = flask.request.args
    advertisement = Ad.query.filter_by(owner_id=args.get("id")).first()
    return flask.jsonify(
        {
            "creator_id": advertisement.creator_id,
            "title": advertisement.title,
            "topics": advertisement.topics,
            "text": advertisement.text,
            "reward": advertisement.reward,
            "show_in_list": advertisement.show_in_list,
        }
    )


@bp.route("/return_results", methods=["GET"])
def return_results():
    """Returns JSON with channels"""
    args = flask.request.args
    results = get_results(cos, args)
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

@require_auth
@bp.route("/add_channel", methods=["POST"])
def add_channel():
    """Add channel info to database (in the first sprint it can be done only on signup)"""
    # did we implement adding new channels?
    pass

@require_auth
@bp.route("/add_Ad", methods=["POST"])
def add_ad():
    """Ads ad to the database"""
    if flask.request.method == "POST":
        advertisement = Ad.query.filter_by(title=flask.request.json["title"]).first()
        if advertisement is None:
            advertisement = Ad(
                creator_id=current_user.id,
                title=flask.request.json["title"],
                topics=flask.request.json["topics"],
                text=flask.request.json["text"],
                reward=flask.request.json["reward"],
                show_in_list=flask.request.json["show_in_list"],
            )
            db.session.add(advertisement)
            db.session.commit()
            new_ad = Ad.query.filter_by(topics=flask.request.json["topics"]).first()
            add_ads_succesful = new_ad is not None
            return flask.jsonify(
                {"add_Ads_succesful": add_ads_succesful, "error_message": ""}
            )
        if (
            flask.request.json["title"] == ""
            or flask.request.json["topics"] == ""
            or flask.request.json["text"] == ""
            or flask.request.json["reward"] == ""
            or flask.request.json["show_in_list"] == ""
        ):
            return flask.jsonify(
                {
                    "add_Ads_succesful": False,
                    "error_message": "Fill in all the required data",
                }
            )
        if advertisement is not None:
            return flask.jsonify(
                {
                    "add_Ads_succesful": False,
                    "error_message": "An Ad with such title already exists",
                }
            )
    return flask.jsonify(
        {
            "add_Ads_succesful": False,
            "error_message": "Unknown error",
        }
    )


@bp.route("/get_Ad", methods=["GET", "POST"])
def get_ad():
    """Returns ad with the required id"""
    # there is an error here, be careful
    ad_log = Ad.query.filter_by(id=Ad.id).all()
    ad_log_data = []
    for advertisement in ad_log:
        ad_log_data.append(
            {
                "id": advertisement.id,
                "title": advertisement.title,
                "topics": advertisement.topics,
                "text": advertisement.text,
                "reward": advertisement.reward,
                "show_in_list": advertisement.show_in_list,
            }
        )
    return flask.jsonify({"ad": ad_log_data})

@require_auth
@bp.route("/make_response", methods=["POST"])
def make_response():
    """Handles responses"""
    is_successful =create_response(
        creator_id = current_user.id, 
        ad_id= flask.request.json["ad_id"], 
        owner_id =  flask.request.json["owner_id"], 
        accepted = flask.request.json["accepted"], 
        message= flask.request.json["message"]
    )

    flask.jsonify({"success": is_successful})

@require_auth
@bp.route("/ad_offers", methods=["POST"])
def ad_offers():
    is_successful =create_offer(
        creator_id = current_user.id, 
        channel_id= Channel.query.filter_by(channel_name=flask.request.json["channel_name"]).first().id, 
        owner_id =  flask.request.json["owner_id"], 
        reward = flask.request.json["price"], 
        message= flask.request.json["message"]
    )

    flask.jsonify({"success": is_successful})


app.register_blueprint(bp)

if __name__ == "__main__":
    app.debug=True
    app.run()## Add ssl after deployment -- ssl_context=('localhost.crt', 'localhost.key'))