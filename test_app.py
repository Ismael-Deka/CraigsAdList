# pylint: disable-all

import unittest
from app import app

import json


class AppTestCase(unittest.TestCase):
    def setUp(self):
        self.ctx = app.app_context()
        self.ctx.push()
        self.client = app.test_client()

    def tearDown(self):
        self.ctx.pop()

    def test_user_login(self):
        response = self.client.post(
            '/handle_login',
            json={"email": "test@example.com", "password": "testpassword"}
        )
        data = response.get_json()

        # Add assertions based on expected 
        self.assertTrue(data["is_login_successful"])
        self.assertEqual(response.status_code, 200)

    def test_ads_page(self):
        # check that request for ads page returns valid data
        response = json.loads(
            self.client.get("/return_ads?for=adsPage").get_data(as_text=True)
        )
        self.assertEqual(response["success"], True)
        self.assertEqual(type(response["adsData"]), list)
        if len(response["adsData"]) > 0:
            self.assertEqual(type(response["adsData"][0]["id"]), int)
            self.assertEqual(type(response["adsData"][0]["creatorName"]), str)
            self.assertEqual(type(response["adsData"][0]["title"]), str)
            self.assertEqual(type(response["adsData"][0]["topics"]), str)
            self.assertEqual(type(response["adsData"][0]["text"]), str)
            self.assertEqual(type(response["adsData"][0]["reward"]), int)

    def test_channels_page(self):
        # check that request for channels page returns valid data
        response = json.loads(
            self.client.get("/return_channels?for=channelsPage").get_data(as_text=True)
        )
        self.assertEqual(response["success"], True)
        self.assertEqual(type(response["channelsData"]), list)
        if len(response["channelsData"]) > 0:
            self.assertEqual(type(response["channelsData"][0]["id"]), int)
            self.assertEqual(type(response["channelsData"][0]["ownerName"]), str)
            self.assertEqual(type(response["channelsData"][0]["channelName"]), str)
            self.assertEqual(type(response["channelsData"][0]["subscribers"]), int)
            self.assertEqual(type(response["channelsData"][0]["topics"]), str)
            self.assertEqual(type(response["channelsData"][0]["preferredReward"]), int)


if __name__ == "__main__":
    unittest.main()
