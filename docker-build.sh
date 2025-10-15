#!/bin/bash


docker buildx build -f Dockerfile \
    --platform linux/amd64 \
    -t padrian2s/mycardinal \
    --push .

