#Create MongoDB Image for RFNG
FROM mongo:6.0.1

EXPOSE 27017
#docker build -t rf_mongo . // Run inside the folder in which Dockerfile is present
# docker images // check containers
#docker run -d -p 27017:27017 --name rf_mongo mongo:latest
# docker ps -a // check container running 
#docker exec -it [containerId] /bin/bash

# time DOCKER_BUILDKIT=1 docker buildx build --platform linux/amd64,linux/arm64 -t 574309367192.dkr.ecr.us-west-2.amazonaws.com/rfng-mongo . --push
# time DOCKER_BUILDKIT=1 docker buildx build --platform linux/amd64,linux/arm64 -t prasanti85/rfng-mongo . --push

