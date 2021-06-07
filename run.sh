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

sudo chown 1000:1000 db -R
cd deploy && docker-compose up --build -d
