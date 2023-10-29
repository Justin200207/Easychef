#!/bin/bash
cd backend
python3.10 -m virtualenv p2pyvenv
source p2pyvenv/bin/activate
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install Pillow
pip install django_filter
pip install django-cors-headers
python3.10 manage.py makemigrations
python3.10 manage.py migrate
cd ../easychef
npm install
cd ../