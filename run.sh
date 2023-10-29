#!/bin/bash
trap '' SIGINT
cd backend
source p2pyvenv/bin/activate
python3.10 manage.py runserver &
P1=$!
cd ../easychef
npm start
kill $P1
cd ../
trap - SIGINT