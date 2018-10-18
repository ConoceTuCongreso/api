#!/bin/bash

if test "$#" -ne 1; then
    echo "Illegal number of parameters"
    exit
fi

IMG_NAME=us.gcr.io/conocetucongreso/api
VERSION=$1
COMMIT=$(git rev-parse --short HEAD)

echo "Building image v$VERSION..."
docker build -t $IMG_NAME:$VERSION .

echo "Pushing image to Google Cloud..."
gcloud docker -- push $IMG_NAME:$VERSION
gcloud container images add-tag $IMG_NAME:$VERSION $IMG_NAME:$COMMIT -q
gcloud container images untag $IMG_NAME:latest -q
gcloud container images add-tag $IMG_NAME:$VERSION $IMG_NAME:latest -q
