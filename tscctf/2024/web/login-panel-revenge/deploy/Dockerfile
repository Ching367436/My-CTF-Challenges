FROM python:3.9.18

RUN pip install Django==4.2.7
RUN pip install django-simple-captcha==0.5.18
RUN apt update
RUN apt-get -y install libz-dev libjpeg-dev libfreetype6-dev python3-dev
RUN sed 's/random.randint(1, 10)/random.randint(1, 100)/g' /usr/local/lib/python3.9/site-packages/captcha/helpers.py

COPY loginPanel /loginPanel/

WORKDIR /loginPanel

RUN python3 manage.py makemigrations
RUN python3 manage.py migrate
CMD ["python3", "manage.py", "runserver", "0.0.0.0:36743"]