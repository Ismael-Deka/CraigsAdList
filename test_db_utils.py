# pylint: disable-all
import unittest
from unittest.mock import patch, MagicMock
from werkzeug.datastructures import MultiDict

from db_utils import get_channels, get_ads


class MockAccountClass:
    def __init__(self, id, username, password, email, channel_owner):
        self.id: int = id
        self.username: str = username
        self.password = password
        self.email: str = email
        self.channel_owner: int = channel_owner


class MockChannelClass:
    def __init__(
        self,
        id,
        owner_id,
        show_channel,
        channel_name,
        subscribers,
        topics,
        preferred_reward,
    ):
        self.id: int = id
        self.owner_id: int = owner_id
        self.show_channel: bool = show_channel
        self.channel_name: str = channel_name
        self.subscribers: int = subscribers
        self.topics: str = topics
        self.preferred_reward: int = preferred_reward


class MockAdClass:
    def __init__(self, id, creator_id, title, topics, text, reward, show_in_list):
        self.id: int = id
        self.creator_id: int = creator_id
        self.title: str = title
        self.topics: str = topics
        self.text: str = text
        self.reward: int = reward
        self.show_in_list: bool = show_in_list


class Database_test(unittest.TestCase):
    @patch("db_utils.Account")
    @patch("db_utils.Channel")
    def test_get_channels(self, mock_Channel, mock_Account):
        # initialize accounts for Account.querry.all()
        accounts = []
        for i in range(5):
            accounts.append(
                MockAccountClass(
                    i, "user" + str(i), i, "user" + str(i) + "@test.com", True
                )
            )

        # initialize channels for Channel.query.filter_by(show_channel=True).all()
        channels = []
        for i in range(5):
            channels.append(
                MockChannelClass(
                    i,
                    i,
                    True,
                    "channel" + str(i),
                    i,
                    "topic" + str(i) + ",topic" + str(i + 1),
                    i,
                )
            )

        expected_channels = []
        for i in range(5):
            expected_channels.append(
                {
                    "id": i,
                    "ownerName": "user" + str(i),
                    "channelName": "channel" + str(i),
                    "subscribers": i,
                    "topics": "topic" + str(i) + ", topic" + str(i + 1),
                    "preferredReward": i,
                }
            )

        mock_Account.query.all.return_value = accounts

        mock_Channel.query.filter_by().all.return_value = channels

        valid_args = MultiDict({"for": "channelsPage"})

        # get_channels is supposed to return expected_channels output
        self.assertEqual(get_channels(valid_args), expected_channels)

        invalid_args = MultiDict({"for": "none"})

        # in case of invalid args get_channels is supposed to return none
        self.assertEqual(get_channels(invalid_args), None)

    @patch("db_utils.Account")
    @patch("db_utils.Ad")
    def test_get_ads(self, mock_Ad, mock_Account):
        # initialize accounts for Account.querry.all()
        accounts = []
        for i in range(5):
            accounts.append(
                MockAccountClass(
                    i, "user" + str(i), i, "user" + str(i) + "@test.com", True
                )
            )

        # initialize ads for Ad.query.filter_by(show_in_list=True).all()
        ads = []
        for i in range(5):
            ads.append(
                MockAdClass(
                    i,
                    i,
                    "title" + str(i),
                    "topic" + str(i) + ",topic" + str(i + 1),
                    "text" + str(i),
                    i,
                    True,
                )
            )

        expected_ads = []
        for i in range(5):
            expected_ads.append(
                {
                    "id": i,
                    "creatorName": "user" + str(i),
                    "title": "title" + str(i),
                    "topics": "topic" + str(i) + ", topic" + str(i + 1),
                    "text": "text" + str(i),
                    "reward": i,
                }
            )

        mock_Account.query.all.return_value = accounts

        mock_Ad.query.filter_by().all.return_value = ads

        # get_ads is supposed to return expected_ads output
        valid_args = MultiDict({"for": "adsPage"})
        self.assertEqual(get_ads(valid_args), expected_ads)


if __name__ == "__main__":
    unittest.main()
