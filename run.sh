#!/bin/bash

if [ ! -f ".env" ]; then
    echo "missing .env"
    exit 255
fi

if [ ! -d "db" ]; then
    mkdir "db"
    sudo chown -R 2000:2000 db
fi

if [ ! -d "images" ]; then
    mkdir "images"
fi

cd deploy && docker-compose up --build -d
