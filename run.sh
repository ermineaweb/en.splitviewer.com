#!/bin/bash

if [ ! -f ".env" ]; then
    echo "missing .env"
    exit 255
fi

if [ ! -d "db" ]; then
    mkdir "db"
    sudo chown romain:romain db -R
fi

if [ ! -d "images" ]; then
    mkdir "images"
fi

cd deploy && sudo docker-compose up --build -d
