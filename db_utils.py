# pylint: disable=no-member
# pylint can't handle db.session
""" Fuctions for extracting data from database """
from models import Account, Ad, Channel, db
from flask_login import current_user


def getAllAccounts():
    accounts = Account.query.all()
    accountList = []
    for i in accounts:
        accountList.append(
            {
                "id": i.id,
                "username": i.username,
                "password": i.password,
                "email": i.email,
                "channel_owner": i.channel_owner,
            }
        )

    return accountList


def createAd(title, topics="", text="", reward=0, show_in_list=True):
    new_ad = Ad(current_user.id, title, topics, text, reward, show_in_list)

    db.session.add(new_ad)
    db.session.commit()
    return doesAdExist(title)


def doesAdExist(ad_title):
    ad = Ad.query.filter_by(title=ad_title).first()
    return ad != None


def createChannel(
    channel_name, topics, preferred_reward, subscribers=0, show_channel=True
):
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
    return doesChannelExist(channel_name)


def doesChannelExist(channelname):
    channel = Channel.query.filter_by(channel_name=channelname).first()
    return channel != None


def map_usernames(raw_accounts):
    """Create dictionary mapping accounts` ids and usernames"""
    accounts = {}
    for account in raw_accounts:
        accounts.update({account.id: account.username})
    return accounts


def get_channels(args):
    """Return ads data filtered according to the query"""
    if args.get("for") == "channelsPage":
        # return channels for channels page
        channels_data = []
        channels = Channel.query.filter_by(show_channel=True).all()
        accounts = map_usernames(Account.query.all())
        channels_data = []
        for channel in channels:
            channel.topics = channel.topics.split(",")
            channels_data.append(
                {
                    "id": channel.id,
                    "ownerName": accounts[channel.owner_id],
                    "channelName": channel.channel_name,
                    "subscribers": channel.subscribers,
                    "topics": channel.topics,
                    "preferredReward": channel.preferred_reward,
                }
            )
        if args.get("id") is not None:
            searched_id = int(args.get("id"))
            channels_data = list(
                filter(lambda channel: channel["id"] == searched_id, channels_data)
            )
        if args.get("owner") is not None:
            searched_owner = args.get("owner")
            channels_data = list(
                filter(
                    lambda channel: searched_owner in channel["ownerName"],
                    channels_data,
                )
            )
        if args.get("name") is not None:
            searched_name = args.get("name")
            channels_data = list(
                filter(
                    lambda channel: searched_name in channel["channelName"],
                    channels_data,
                )
            )
        if args.get("subs") is not None:
            min_subs = int(args.get("subs"))
            channels_data = list(
                filter(
                    lambda channel: channel["subscribers"] >= min_subs,
                    channels_data,
                )
            )
        if args.get("topics") is not None:
            topics = args.get("topics")
            channels_data = list(
                filter(
                    lambda channel: topics in channel["topics"],
                    channels_data,
                )
            )
        if args.get("reward") is not None:
            max_reward = int(args.get("reward"))
            channels_data = list(
                filter(
                    lambda channel: channel["preferredReward"] <= max_reward,
                    channels_data,
                )
            )

        for channel in channels_data:
            channel["topics"] = (", ").join(channel["topics"])

        return channels_data

    return None


def getAllChannels():  ## returns JSON of all channels on site.
    channels = Channel.query.all()
    channelList = []
    for i in channels:
        channelList.append(
            {
                "owner_id": i.owner_id,
                "show_channel": i.show_channel,
                "channel_name": i.channel_name,
                "subscribers": i.subscribers,
                "topics": i.topics,
                "preferred_reward": i.preferred_reward,
            }
        )

    return channelList


def getChannelsbyTopic(topic):
    channels = Channel.query.all()
    channelList = []
    for i in channels:
        topic_list = i.topics.split(
            ","
        )  ## assumes topics are seperated by a single comment(no spaces) e.g. "Tech,Fashion,Misc,..."
        if topic in topic_list:
            channelList.append(
                {
                    "owner_id": i.owner_id,
                    "show_channel": i.show_channel,
                    "channel_name": i.channel_name,
                    "subscribers": i.subscribers,
                    "topics": i.topics,
                    "preferred_reward": i.preferred_reward,
                }
            )

    return channelList


def getChannelsBySubCount(
    min_sub_count,
):  ##returns all channels with subscriber count above or equal to a minimum subscriber count
    channels = Channel.query.all()
    channelList = []
    for i in channels:
        channel_sub_count = (
            i.subscribers
        )  ## assumes topics are seperated by a single comment(no spaces) e.g. "Tech,Fashion,Misc,..."
        if channel_sub_count >= min_sub_count:
            channelList.append(
                {
                    "owner_id": i.owner_id,
                    "show_channel": i.show_channel,
                    "channel_name": i.channel_name,
                    "subscribers": i.subscribers,
                    "topics": i.topics,
                    "preferred_reward": i.preferred_reward,
                }
            )

    return channelList


def getChannelsByOwnerUsername(ownername):
    user = Account.query.filter_by(username=ownername).first()
    channels = Channel.query.filter_by(owner_id=user.id).all()
    channelList = []
    for i in channels:
        channelList.append(
            {
                "owner_id": i.owner_id,
                "show_channel": i.show_channel,
                "channel_name": i.channel_name,
                "subscribers": i.subscribers,
                "topics": i.topics,
                "preferred_reward": i.preferred_reward,
            }
        )

    return channelList


def getChannelsByOwnerEmail(owner_email):
    user = Account.query.filter_by(username=owner_email).first()
    channels = Channel.query.filter_by(owner_id=user.id).all()
    channelList = []
    for i in channels:
        channelList.append(
            {
                "owner_id": i.owner_id,
                "show_channel": i.show_channel,
                "channel_name": i.channel_name,
                "subscribers": i.subscribers,
                "topics": i.topics,
                "preferred_reward": i.preferred_reward,
            }
        )

    return channelList


def get_ads(args):
    """Return ads data filtered according to the query"""
    ads_data = []
    if args.get("for") == "adsPage":
        ads = Ad.query.filter_by(show_in_list=True).all()
        accounts = map_usernames(Account.query.all())
        for advertisement in ads:
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


def getAllAds():
    ads = Ad.query.all()
    adsList = []
    for i in ads:
        adsList.append(
            {
                "creator_id": i.creator_id,
                "title": i.title,
                "topics": i.topics,
                "text": i.text,
                "reward": i.reward,
                "show_in_list": i.show_in_list,
            }
        )

    return adsList


def getAdsByTopic(topic):
    ads = Ad.query.all()
    adsList = []
    for i in ads:
        topic_list = i.topics.split(
            ","
        )  ## assumes topics are seperated by a single comment(no spaces) e.g. "Tech,Fashion,Misc,..."
        if topic in topic_list:
            adsList.append(
                {
                    "creator_id": i.creator_id,
                    "title": i.title,
                    "topics": i.topics,
                    "text": i.text,
                    "reward": i.reward,
                    "show_in_list": i.show_in_list,
                }
            )


def getAdsByOwnerUsername(ownername):
    user = Account.query.filter_by(username=ownername).first()
    ads = Ad.query.filter_by(creator_id=user.id).all()
    adsList = []
    for i in ads:
        adsList.append(
            {
                "creator_id": i.creator_id,
                "title": i.title,
                "topics": i.topics,
                "text": i.text,
                "reward": i.reward,
                "show_in_list": i.show_in_list,
            }
        )

    return adsList


def getAdsByOwnerEmail(owner_email):
    user = Account.query.filter_by(username=owner_email).first()
    ads = Ad.query.filter_by(creator_id=user.id).all()
    adsList = []
    for i in ads:
        adsList.append(
            {
                "creator_id": i.creator_id,
                "title": i.title,
                "topics": i.topics,
                "text": i.text,
                "reward": i.reward,
                "show_in_list": i.show_in_list,
            }
        )

    return adsList


def deleteAllAds():
    rows_deleted = Ad.query.delete()
    db.session.commit()
    return rows_deleted


def deleteAllChannels():
    rows_deleted = Channel.query.delete()
    db.session.commit()
    return rows_deleted


def deleteAllAccount():
    rows_deleted = Account.query.delete()
    db.session.commit()
    return rows_deleted


def deleteAd(ad_id):
    if ad_id is None:
        return -1
    rows_deleted = Ad.query.filter_by(id=ad_id).delete()
    db.session.commit()
    return rows_deleted


def deleteChannel(channel_id):
    if channel_id is None:
        return -1
    rows_deleted = Channel.query.filter_by(id=channel_id).delete()
    db.session.commit()
    return rows_deleted


def deleteAccount(account_id):
    if account_id is None:
        return -1
    rows_deleted = Account.query.filter_by(id=account_id).delete()
    db.session.commit()
    return rows_deleted
