FROM python:3.10

RUN pip install Django==5.0.3
RUN pip install django-simple-captcha==0.6.0
RUN apt update
RUN apt-get -y install libz-dev libjpeg-dev libfreetype6-dev python3-dev

COPY loginPanel /loginPanel/

WORKDIR /loginPanel

RUN python3 manage.py makemigrations
RUN python3 manage.py migrate
CMD ["python3", "manage.py", "runserver", "0.0.0.0:36743"]