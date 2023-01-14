FROM python:latest
WORKDIR /usr/app/src
ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .

CMD [ "python", "./init.py"]
# CRON COMMANDS