#!/bin/bash

if [ ! -f ".env" ]; then
    echo "missing .env"
    exit 255
fi

if [ ! -d "db" ]; then
    mkdir "db"
fi

if [ ! -d "images" ]; then
    mkdir "images"
fi

sudo chown -R romain:romain db/
sudo chown -R romain:romain images/

cd deploy && sudo docker-compose up --build -d
