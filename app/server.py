from flask import Flask
from app.main import run_scrape
server = Flask(__name__)


@server.route("/")
def hello():
    # run_scrape()
    return "Hi!"


if __name__ == "__main__":
    server.run(host='0.0.0.0')
