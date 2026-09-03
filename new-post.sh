#!/bin/bash

DATE=$(date +%Y-%m-%d)
NAME=$1

# Create new post with date prefix
hugo new content content/blog/$DATE-$NAME.pt.md

# Create folder of photos
mkdir -p static/images/post/$DATE-$NAME
