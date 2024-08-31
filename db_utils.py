# pylint: disable=no-member
# pylint can't handle db.session
# pylint: disable=W0703
# W0703 -- too general exception -- don't really care
""" Fuctions for extracting data from database """
from flask_login import current_user
from models import Account, Ad, Channel, Offers, Responses, db
import base64
import os
import traceback

def get_profile_pic(cos, pfp_index):
            response = cos.get_object(Bucket=os.getenv("COS_BUCKET_NAME"), Key=f"pfp/{pfp_index}.png")
            encoded_pfp = base64.b64encode(response['Body'].read()).decode("utf-8")
            return f"data:image/png;base64,{encoded_pfp}"

def upload_profile_pic(cos, pfp_index, file):
    if file is None or file == '':
        return False

    # Upload file to IBM COS
    try:
        cos.upload_fileobj(file, os.getenv("COS_BUCKET_NAME"), f"pfp/{pfp_index}.png")
        return True
    except Exception as e:
        tb = traceback.TracebackException.from_exception(e)
        print(e.with_traceback(tb))
        return False

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
                "channel_owner": i.channel_owner,
            }
        )

    return account_list


def create_ad(title, topics="", text="", reward=0, show_in_list=True):
    """Creates new ad"""
    # there is an error here, current_user.id arg prolly should not be among the args
    new_ad = Ad(current_user.id, title, topics, text, reward, show_in_list)

    db.session.add(new_ad)
    db.session.commit()
    return does_ad_exist(title)

def create_offer(creator_id, channel_id, owner_id , reward, message=""):
    """Creates new ad"""
    # there is an error here, current_user.id arg prolly should not be among the args
    new_offer = Offers(creator_id, channel_id, owner_id , reward, message)

    db.session.add(new_offer)
    db.session.commit()
    return does_offer_exist(new_offer.id)

def create_response(creator_id, ad_id, owner_id , accepted, message=""):
    """Creates new ad"""
    # there is an error here, current_user.id arg prolly should not be among the args
    new_response = Responses(creator_id, ad_id, owner_id , accepted, message)

    db.session.add(new_response)
    db.session.commit()
    return does_response_exist(new_response.id)


def does_offer_exist(offer_id):
    """Check if the ad with the given title exists in the database"""
    offer = Offers.query.filter_by(id=offer_id).first()
    return offer is not None

def does_response_exist(response_id):
    """Check if the ad with the given title exists in the database"""
    response = Responses.query.filter_by(id=response_id).first()
    return response is not None


def does_ad_exist(ad_title):
    """Check if the ad with the given title exists in the database"""
    advertisement = Ad.query.filter_by(title=ad_title).first()
    return advertisement is not None


def create_channel(
    channel_name, topics, preferred_reward, subscribers=0, show_channel=True
):
    """Creates channel based on given args"""
    new_channel = Channel(
        current_user.id,
        show_channel,
        channel_name,
        subscribers,
        topics,
        preferred_reward,
    )

    db.session.add(new_channel)
    db.session.commit()
    return does_channel_exist(channel_name)


def does_channel_exist(channelname):
    """Check if the channel with the given name exists in the database"""
    channel = Channel.query.filter_by(channel_name=channelname).first()
    return channel is not None


def map_usernames(raw_accounts):
    """Create dictionary mapping accounts` ids and usernames"""
    accounts = {}
    for account in raw_accounts:
        accounts.update({account.id: account.username})
    return accounts


def get_results(cos, args):
    """Return data filtered according to the query"""
    results = None

    if args.get("for") == "platforms":
        results = get_platforms_results(args=args)
        
    
    elif args.get("for") == "campaigns":
       results = get_campaigns_results(args=args)
       

    elif args.get("for") == "users":
        results = get_user_results(cos=cos, args=args)
    return results

def get_platforms_results(args):
        page_number = int(args.get("page"))
        results_per_page = int(args.get("perPage"))
        sort_method = args.get("sortBy")
        sort_order = args.get("sortOrder")
        platforms= Channel.query.filter_by(show_channel=True).all()
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
                        "platformName": platform.channel_name,
                        "subscribers": platform.subscribers,
                        "topics": platform.topics,
                        "preferredReward": platform.preferred_reward,
                    }
                )
            except Exception:
                continue

        platforms_data = filter_results(args=args, data_list=platforms_data, arg_list=
                                        ["id",
                                         "ownerId",
                                         "ownerName",
                                         "platformName",
                                         "subscribers",
                                         "topics",
                                         "preferredReward"
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
    campaigns= Ad.query.filter_by(show_in_list=True).all()
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
                    "campaignDesc": campaign.text,
                    "topics": campaign.topics,
                    "preferredReward": campaign.reward,
                }
            )
        except Exception:
             continue
        
        campaign_data = filter_results(args=args, data_list=campaigns_data, arg_list=
                                        ["id",
                                         "ownerId",
                                         "ownerName",
                                         "campaignName",
                                         "campaignDesc",
                                         "topics",
                                         "preferredReward"
                                         ])
        
        for campaign in campaign_data:
            campaign["topics"] = (", ").join(campaign["topics"])
        
        if(sort_method is not None):
            campaign_data = sorted(campaign_data, key=lambda x: x[sort_method], reverse=( sort_order == 'desc'))

        result_count = len(campaign_data)

        campaigns = paginate_results(campaign_data, results_per_page, page_number)

        results = {'results_data': campaigns, 'result_count': result_count}
        
        return results

def get_user_results(cos, args):
    page_number = int(args.get("page"))
    results_per_page = int(args.get("perPage"))
    sort_method = args.get("sortBy")
    sort_order = args.get("sortOrder")
    accounts = Account.query.all()
    print(len(accounts))
    accounts_data = []

    for account in accounts:
        try:
            accounts_data.append(
                {
                    "id": account.id,
                    "username":account.username,
                    "email": account.email,
                    "pfp": get_profile_pic(cos, account.profile_pic),
               }
            )
        except Exception:
            continue

    accounts_data = filter_results(args=args, data_list=accounts_data, arg_list=
                                        ["id",
                                         "username",
                                         "email",
                                         "pfp",
                                         
                                         ])
    if(sort_method is not None):
        accounts_data = sorted(accounts_data, key=lambda x: x["username"], reverse=( sort_order == 'desc'))
    
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
    
    if arg_name == "subscribers":
        
        return data[arg_name] >= int(arg_value)
    elif arg_name == "reward" or arg_name == "preferred_reward":
        return data[arg_name] <= int(arg_value)
    elif arg_name == "id":
        return data[arg_name] == int(arg_value)
    elif arg_name == "topics":
        matched_topics = list(filter(lambda topic: arg_value.lower() in topic.lower(), data[arg_name]))
        return len(matched_topics) > 0
    else:
        return arg_value.lower() in data[arg_name].lower()
    


def get_all_channels():
    """Returns JSON of all channels on site"""
    channels = Channel.query.all()
    channel_list = []
    for i in channels:
        channel_list.append(
            {
                "owner_id": i.owner_id,
                "show_channel": i.show_channel,
                "channel_name": i.channel_name,
                "subscribers": i.subscribers,
                "topics": i.topics,
                "preferred_reward": i.preferred_reward,
            }
        )

    return channel_list


def get_channels_by_topic(topic):
    """Returns channels with given topic"""
    channels = Channel.query.all()
    channel_list = []
    for i in channels:
        topic_list = i.topics.split(
            ","
        )  ## assumes topics are seperated by a single comment(no spaces) e.g. "Tech,Fashion,Misc"
        if topic in topic_list:
            channel_list.append(
                {
                    "owner_id": i.owner_id,
                    "show_channel": i.show_channel,
                    "channel_name": i.channel_name,
                    "subscribers": i.subscribers,
                    "topics": i.topics,
                    "preferred_reward": i.preferred_reward,
                }
            )

    return channel_list


def get_channels_by_sub_count(
    min_sub_count,
):
    """returns all channels with subscriber count above or equal to a minimum subscriber count"""
    channels = Channel.query.all()
    channel_list = []
    for i in channels:
        channel_sub_count = (
            i.subscribers
        )  ## assumes topics are seperated by a single comment(no spaces) e.g. "Tech,Fashion,Misc"
        if channel_sub_count >= min_sub_count:
            channel_list.append(
                {
                    "owner_id": i.owner_id,
                    "show_channel": i.show_channel,
                    "channel_name": i.channel_name,
                    "subscribers": i.subscribers,
                    "topics": i.topics,
                    "preferred_reward": i.preferred_reward,
                }
            )

    return channel_list


def get_channels_by_owner_username(ownername):
    """returns all channels owned by user with the given username"""
    user = Account.query.filter_by(username=ownername).first()
    channels = Channel.query.filter_by(owner_id=user.id).all()
    channel_list = []
    for i in channels:
        channel_list.append(
            {
                "owner_id": i.owner_id,
                "show_channel": i.show_channel,
                "channel_name": i.channel_name,
                "subscribers": i.subscribers,
                "topics": i.topics,
                "preferred_reward": i.preferred_reward,
            }
        )

    return channel_list


def get_channels_by_owner_email(owner_email):
    """returns all channels owned by user with the given email"""
    user = Account.query.filter_by(username=owner_email).first()
    channels = Channel.query.filter_by(owner_id=user.id).all()
    channel_list = []
    for i in channels:
        channel_list.append(
            {
                "owner_id": i.owner_id,
                "show_channel": i.show_channel,
                "channel_name": i.channel_name,
                "subscribers": i.subscribers,
                "topics": i.topics,
                "preferred_reward": i.preferred_reward,
            }
        )

    return channel_list


def get_ads(args):
    """Return ads data filtered according to the query"""
    ads_data = []
    if args.get("for") == "adsPage":
        ads = Ad.query.filter_by(show_in_list=True).all()
        accounts = map_usernames(Account.query.all())
        for advertisement in ads:
            try:
                advertisement.topics = advertisement.topics.split(",")
                ads_data.append(
                    {
                        "id": advertisement.id,
                        "creatorName": accounts[advertisement.creator_id],
                        "title": advertisement.title,
                        "topics": advertisement.topics,
                        "text": advertisement.text,
                        "reward": advertisement.reward,
                    }
                )
            except Exception:
                continue
        if args.get("id") is not None:
            searched_id = int(args.get("id"))
            ads_data = list(
                filter(
                    lambda advertisement: advertisement["id"] == searched_id, ads_data
                )
            )
        if args.get("creator") is not None:
            searched_creator = args.get("creator")
            ads_data = list(
                filter(
                    lambda advertisement: searched_creator
                    in advertisement["creatorName"],
                    ads_data,
                )
            )
        if args.get("title") is not None:
            searched_title = args.get("title")
            ads_data = list(
                filter(
                    lambda advertisement: searched_title in advertisement["title"],
                    ads_data,
                )
            )
        if args.get("topics") is not None:
            searched_topics = args.get("topics")
            ads_data = list(
                filter(
                    lambda advertisement: searched_topics in advertisement["topics"],
                    ads_data,
                )
            )
        if args.get("text") is not None:
            searched_text = args.get("text")
            ads_data = list(
                filter(
                    lambda advertisement: searched_text in advertisement["text"],
                    ads_data,
                )
            )
        if args.get("reward") is not None:
            max_reward = int(args.get("reward"))
            ads_data = list(
                filter(
                    lambda advertisement: advertisement["reward"] <= max_reward,
                    ads_data,
                )
            )

        for advertisement in ads_data:
            advertisement["topics"] = (", ").join(advertisement["topics"])

        return ads_data

    return ads_data


def get_all_ads():
    """Return all ads data"""
    ads = Ad.query.all()
    ads_list = []
    for i in ads:
        ads_list.append(
            {
                "creator_id": i.creator_id,
                "title": i.title,
                "topics": i.topics,
                "text": i.text,
                "reward": i.reward,
                "show_in_list": i.show_in_list,
            }
        )

    return ads_list


def get_ads_by_topic(topic):
    """Return ads with given topics"""
    ads = Ad.query.all()
    ads_list = []
    for i in ads:
        topic_list = i.topics.split(
            ","
        )  ## assumes topics are seperated by a single comment(no spaces) e.g. "Tech,Fashion,Misc"
        if topic in topic_list:
            ads_list.append(
                {
                    "creator_id": i.creator_id,
                    "title": i.title,
                    "topics": i.topics,
                    "text": i.text,
                    "reward": i.reward,
                    "show_in_list": i.show_in_list,
                }
            )

    return ads_list


def get_ads_by_owner_username(ownername):
    """Returns ads of the user with given username"""
    user = Account.query.filter_by(username=ownername).first()
    ads = Ad.query.filter_by(creator_id=user.id).all()
    ads_list = []
    for i in ads:
        ads_list.append(
            {
                "creator_id": i.creator_id,
                "title": i.title,
                "topics": i.topics,
                "text": i.text,
                "reward": i.reward,
                "show_in_list": i.show_in_list,
            }
        )

    return ads_list


def get_ads_by_owner_email(owner_email):
    """Return ads of the user with given email"""
    user = Account.query.filter_by(username=owner_email).first()
    ads = Ad.query.filter_by(creator_id=user.id).all()
    ads_list = []
    for i in ads:
        ads_list.append(
            {
                "creator_id": i.creator_id,
                "title": i.title,
                "topics": i.topics,
                "text": i.text,
                "reward": i.reward,
                "show_in_list": i.show_in_list,
            }
        )

    return ads_list


def delete_all_ads():
    """Deletes all ads"""
    rows_deleted = Ad.query.delete()
    db.session.commit()
    return rows_deleted


def delete_all_channels():
    """Deletes all channels"""
    rows_deleted = Channel.query.delete()
    db.session.commit()
    return rows_deleted


def delete_all_account():
    """Deletes all accounts"""
    rows_deleted = Account.query.delete()
    db.session.commit()
    return rows_deleted


def delete_ad(ad_id):
    """Deletes the add with given id"""
    if ad_id is None:
        return -1
    rows_deleted = Ad.query.filter_by(id=ad_id).delete()
    db.session.commit()
    return rows_deleted


def delete_channel(channel_id):
    """Deletes the channel with given id"""
    if channel_id is None:
        return -1
    rows_deleted = Channel.query.filter_by(id=channel_id).delete()
    db.session.commit()
    return rows_deleted


def delete_account(account_id):
    """Deletes the account with given id"""
    if account_id is None:
        return -1
    rows_deleted = Account.query.filter_by(id=account_id).delete()
    db.session.commit()
    return rows_deleted
