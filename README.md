## Heroku link TEMPORARY

https://sprint2-test.herokuapp.com/

## Step to run for first time

### `pip install -r requirements.txt` - install python packages

### `npm ci` - install node modules

### `npm run build` - build frontend side

### Set up .env file in the root of the project:

`export DATABASE_URL='postgresql://<your database link>'`

`SECRET_KEY=<your secret key>`


**Then run `python app.py` or `gunicorn app:app` in the terminal to launch**
