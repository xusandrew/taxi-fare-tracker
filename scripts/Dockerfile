FROM --platform=linux/amd64 ubuntu:latest

RUN apt-get update && apt-get install -y python3 python3-pip cron

COPY . /usr/src/app/.
RUN pip3 install -r /usr/src/app/requirements.txt

ADD crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab
RUN touch /var/log/cron.log

RUN chmod 0744 /usr/src/app/init.py
RUN chmod 0744 /usr/src/app/lyft/lyft.py
RUN chmod 0744 /usr/src/app/uber/uber.py
RUN chmod 0744 /usr/src/app/taxis/scrape.py

RUN crontab /etc/cron.d/crontab

CMD cron && tail -f /var/log/cron.log