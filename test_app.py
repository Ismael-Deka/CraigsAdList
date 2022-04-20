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

    def test_ads_page(self):
        # check that request for ads page returns valid data
        response = json.loads(
            self.client.get("/return_ads?for=adsPage").get_data(as_text=True)
        )
        assert response["success"] == True
        assert type(response["adsData"]) == list
        if len(response["adsData"]) > 0:
            assert type(response["adsData"][0]["id"]) == int
            assert type(response["adsData"][0]["creatorName"]) == str
            assert type(response["adsData"][0]["title"]) == str
            assert type(response["adsData"][0]["topics"]) == str
            assert type(response["adsData"][0]["text"]) == str
            assert type(response["adsData"][0]["reward"]) == int
            assert type(response["adsData"][0]["showInList"]) == bool
            assert type(response["adsData"][0]["id"]) == int


if __name__ == "__main__":
    unittest.main()
