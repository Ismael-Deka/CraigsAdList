# pylint: disable=no-member
# pylint can't handle db.session
# pylint: disable=W0703
# W0703 -- too general exception -- don't really care
""" Fuctions for extracting data from database """
from flask_login import current_user
from models import Account, Campaign, Platform, db
from sqlalchemy.exc import IntegrityError
import os
import io
import traceback
from PIL import Image

def get_profile_pic( pfp_index, img_type):
        if pfp_index != -1:
            return f"https://{os.getenv('COS_ENDPOINT_URL')}/pfp_source/{img_type}/{pfp_index}.png"
        else:
            return f"https://{os.getenv('COS_ENDPOINT_URL')}/default.png"

def get_search_pic(pfp_index, img_type):
        if pfp_index != -1:
            return f"https://{os.getenv('COS_ENDPOINT_URL')}/pfp200/{img_type}/{pfp_index}.png"
        else:
            return f"https://{os.getenv('COS_ENDPOINT_URL')}/default200.png"

def upload_profile_pic(cos, pfp_index, img, img_type):
    if img is None or img == '':
        return False
    # Upload img to IBM COS
    img_search = resize_profile_pic(img)
    img.seek(0)
    img_search.seek(0)
    try:
        cos.upload_fileobj(img, os.getenv("COS_BUCKET_NAME"), f"pfp_source/{img_type}/{pfp_index}.png")
        
        cos.upload_fileobj(img_search, os.getenv("COS_BUCKET_NAME"), f"pfp200/{img_type}/{pfp_index}.png")

        return True
    except Exception as e:
        tb = traceback.format_exc()
        print(f"An error occurred: {e}")
        print(tb)
    
    return False

def delete_profile_pic(cos, img_type, pfp_index):
    cos.Object(os.getenv("COS_BUCKET_NAME"),f"pfp_source/{img_type}/{pfp_index}.png").delete()
    cos.Object(os.getenv("COS_BUCKET_NAME"),f"pfp200/{img_type}/{pfp_index}.png").delete()

        
        
def resize_profile_pic(new_img):
        with Image.open(new_img.stream) as img:
            img_resized = img.resize((200,200), Image.LANCZOS)
            
            img_io = io.BytesIO(img_resized.tobytes())

            img_resized.save(img_io, format='PNG')  
            img_io.seek(0)
            return img_io
          

def get_all_accounts():
    """Returns all accounts stored in database"""
    accounts = Account.query.all()
    account_list = []
    for i in accounts:
        account_list.append(
            {
                "id": i.id,
                "username": i.username,
                "password": i.password,
                "email": i.email,
                "platform_owner": i.platform_owner,
            }
        )

    return account_list


def create_campaign(title, description, topics, budget, currency, show_in_list, is_active, start_date, end_date):
    """Creates Campaigns based on given args"""
    try:
        # Create and add a new campaign
        new_campaign = Campaign(
            creator_id=current_user.id,
            title=title,
            description=description,
            topics=topics,
            budget=budget,
            currency=currency,
            show_in_list=show_in_list,
            is_active=is_active,
            start_date=start_date,
            end_date=end_date
        )
        
        db.session.add(new_campaign)
        db.session.commit()
        return does_campaign_exist(new_campaign.id), new_campaign.id
    except Exception as e:
        tb = traceback.format_exc()
        print(f"An error occurred: {e}")
        print(tb)
        db.session.rollback()
        return False, None


def create_platform(
     platform_name, medium, description,  topics, preferred_price, pfp, is_active=True, currency='USD', show_platform=True, impressions=0, impression_type='per Ad View'
):
    """Creates Platform based on given args"""
    try:
        new_platform = Platform(
            owner_id=current_user.id,
            medium=medium,
            description=description,
            show_platform=show_platform == 'true',
            platform_name=platform_name,
            impressions=impressions,
            impression_type=impression_type,
            topics=topics,
            preferred_price=preferred_price,
            is_active=is_active == 'true',
            currency=currency
        )

        db.session.add(new_platform)
        db.session.commit()
        return does_platform_exist(new_platform.id), new_platform.id

    except Exception as e:
        tb = traceback.format_exc()
        print(f"An error occurred: {e}")
        print(tb)
        db.session.rollback()
        return False, None
    
def does_user_exist(user_id):
    """Check if the Campaign with the given title exists in the database"""
    user = Account.query.filter_by(id=user_id).first()
    return user is not None

def does_campaign_exist(campaign_id):
    """Check if the Campaign with the given title exists in the database"""
    advertisement = Campaign.query.filter_by(id=campaign_id).first()
    return advertisement is not None

def does_platform_exist(platform_id):
    """Check if the Platform with the given name exists in the database"""
    platform = Platform.query.filter_by(id=platform_id).first()
    return platform is not None


def map_usernames(raw_accounts):
    """Create dictionary mapping accounts` ids and usernames"""
    accounts = {}
    for account in raw_accounts:
        accounts.update({account.id: account.username})
    return accounts


def get_results( args):
    """Return data filtered according to the query"""
    results = None

    if args.get("for") == "platforms":
        results = get_platforms_results(args=args)
        
    
    elif args.get("for") == "campaigns":
       results = get_campaigns_results(args=args)
       

    elif args.get("for") == "users":
        results = get_user_results(args=args)
    return results

def get_platforms_results(args):
        page_number = int(args.get("page"))
        results_per_page = int(args.get("perPage"))
        sort_method = args.get("sortBy")
        sort_order = args.get("sortOrder")
        platforms= Platform.query.filter_by(show_platform=True).all()
        accounts = map_usernames(Account.query.all())
        platforms_data = []

        for platform in platforms:
            try:
                platform.topics = platform.topics.split(",")
                platforms_data.append(
                    {
                        "id": platform.id,
                        "ownerId":platform.owner_id,
                        "ownerName": accounts[platform.owner_id],
                        "platformName": platform.platform_name,
                        "impressions": platform.impressions,
                        "topics": platform.topics,
                        "preferredPrice": platform.preferred_price,
                        "pfp": get_search_pic(platform.id,"platforms"),
                    }
                )
            except Exception as e:
                tb = traceback.format_exc()
                print(f"An error occurred: {e}")
                print(tb)
                continue

        platforms_data = filter_results(args=args, data_list=platforms_data, arg_list=
                                        ["id",
                                         "ownerId",
                                         "ownerName",
                                         "platformName",
                                         "impressions",
                                         "topics",
                                         "preferredPrice"
                                         ])
        
        for platform in platforms_data:
            platform["topics"] = (", ").join(platform["topics"])
        
        if(sort_method is not None):
            platforms_data = sorted(platforms_data, key=lambda x: x[sort_method], reverse=( sort_order == 'desc'))

        result_count = len(platforms_data)

        platforms = paginate_results(platforms_data, results_per_page, page_number)

        results = {'results_data': platforms, 'result_count': result_count}

        return results

def get_campaigns_results(args):
    page_number = int(args.get("page"))
    results_per_page = int(args.get("perPage"))
    sort_method = args.get("sortBy")
    sort_order = args.get("sortOrder")
    campaigns= Campaign.query.filter_by(show_in_list=True).all()
    accounts = map_usernames(Account.query.all())
    campaigns_data = []

    for campaign in campaigns:
        try:
            campaign.topics = campaign.topics.split(",")
            campaigns_data.append(
                {
                    "id": campaign.id,
                    "ownerId":campaign.creator_id,
                    "ownerName": accounts[campaign.creator_id],
                    "campaignName": campaign.title,
                    "campaignDesc": campaign.description,
                    "topics": campaign.topics,
                    "budget": campaign.budget,
                    "pfp": get_search_pic(campaign.id,"campaigns"),
                }
            )
           
        except Exception as e:
            tb = traceback.format_exc()
            print(f"An error occurred: {e}")
            print(tb)
            continue
        
    campaign_data = filter_results(args=args, data_list=campaigns_data, arg_list=
                                        ["id",
                                         "ownerId",
                                         "ownerName",
                                         "campaignName",
                                         "campaignDesc",
                                         "topics",
                                         "budget"
                                         ])
        
    for campaign in campaign_data:
            campaign["topics"] = (", ").join(campaign["topics"])
        
    if(sort_method is not None):
            campaign_data = sorted(campaign_data, key=lambda x: x[sort_method], reverse=( sort_order == 'desc'))

    result_count = len(campaign_data)

    campaigns = paginate_results(campaign_data, results_per_page, page_number)

    results = {'results_data': campaigns, 'result_count': result_count}
        
    return results

def get_user_results(args):
    page_number = int(args.get("page"))
    results_per_page = int(args.get("perPage"))
    sort_method = args.get("sortBy")
    sort_order = args.get("sortOrder")
    accounts = Account.query.all()
    accounts_data = []

    for account in accounts:
        try:
            accounts_data.append(
                {
                    "id": account.id,
                    "email": account.email,
                    "pfp": get_profile_pic(account.profile_pic, "users"),
                    "fullName": account.full_name
               }
            )
        except Exception as e:
            tb = traceback.format_exc()
            print(f"An error occurred: {e}")
            print(tb)
            continue
    accounts_data = filter_results(args=args, data_list=accounts_data, arg_list=
                                        ["id",
                                         "email",
                                         "fullName",
                                         "pfp",
                                         
                                         ])
    if(sort_method is not None):
        accounts_data = sorted(accounts_data, key=lambda x: x["fullName"], reverse=( sort_order == 'desc'))
    
    result_count = len(accounts_data)

    accounts_data = paginate_results(accounts_data, results_per_page, page_number)
    results = {'results_data': accounts_data, 'result_count': result_count}
        
    return results

def paginate_results(data, results_per_page, page_number):
    result_count = len(data)

    if result_count > results_per_page:
        if page_number==1 :
            paginated_data = data[:results_per_page]
        else:
            start_index = page_number*results_per_page
            end_index = start_index+results_per_page
            if end_index > result_count: end_index=result_count
            paginated_data = data[start_index:end_index]
        return paginated_data
    else:
        return data
    
def filter_results(args, data_list, arg_list):
    for arg_name in arg_list:

        arg_value = args.get(arg_name)
        if arg_value is not None:
            data_list = list(
                filter(lambda data: is_filter_matched(arg_name,arg_value,data), data_list)
            )
    return data_list

def is_filter_matched(arg_name,arg_value, data ):
    
    if arg_name == "impressions":
        
        return data[arg_name] >= int(arg_value)
    elif arg_name == "budget" or arg_name == "preferred_price":
        return data[arg_name] <= int(arg_value)
    elif arg_name == "id":
        return data[arg_name] == int(arg_value)
    elif arg_name == "topics":
        matched_topics = list(filter(lambda topic: arg_value.lower() in topic.lower(), data[arg_name]))
        return len(matched_topics) > 0
    else:
        return arg_value.lower() in data[arg_name].lower()
    

def delete_all_campaigns():
    """Deletes all ads"""
    rows_deleted = Campaign.query.delete()
    db.session.commit()
    return rows_deleted


def delete_all_platforms():
    """Deletes all platforms"""
    rows_deleted = Platform.query.delete()
    db.session.commit()
    return rows_deleted


def delete_all_account():
    """Deletes all accounts"""
    rows_deleted = Account.query.delete()
    db.session.commit()
    return rows_deleted


def delete_campaign(cos, campaign_id):
    """Deletes campaign with given id"""
    if campaign_id is None:
        return -1
    try:
        delete_profile_pic(cos, "campaigns", campaign_id)
    except Exception as e:
        tb = traceback.format_exc()
        print(f"An error occurred while deleting campaign profile pic: {e}")
        print(tb)
        return -1
    
    try:
        rows_deleted = Campaign.query.filter_by(id=campaign_id).delete()
        if rows_deleted == 0:
            return 0   
        db.session.commit() 
        return rows_deleted
    except Exception as e:
        tb = traceback.format_exc()
        print(f"An error occurred while deleting the campaign: {e}")
        print(tb)
        db.session.rollback() 
        return -1



def delete_platform(cos, platform_id):
    """Deletes platform with given id"""
    if platform_id is None:
        return -1
    try:
        delete_profile_pic(cos, "platforms", platform_id)
    except Exception as e:
        tb = traceback.format_exc()
        print(f"An error occurred while deleting platform profile pic: {e}")
        print(tb)
        return -1
    
    try:
        rows_deleted = Platform.query.filter_by(id=platform_id).delete()
        if rows_deleted == 0:
            return 0   
        db.session.commit() 
        return rows_deleted
    except Exception as e:
        tb = traceback.format_exc()
        print(f"An error occurred while deleting the platform: {e}")
        print(tb)
        db.session.rollback() 
        return -1


def delete_account(cos, account_id):
    """Deletes account with given id"""
    if account_id is None:
        return -1
    
    try:
        delete_profile_pic(cos, "users", account_id)
    except Exception as e:
        tb = traceback.format_exc()
        print(f"An error occurred while deleting the account: {e}")
        print(tb)
        return -1
      
    try:
        rows_deleted = Account.query.filter_by(id=account_id).delete()
        if rows_deleted == 0:
            return 0   
        db.session.commit() 
        return rows_deleted
    except Exception as e:
        tb = traceback.format_exc()
        print(f"An error occurred while deleting the account: {e}")
        print(tb)
        db.session.rollback() 
        return -1
