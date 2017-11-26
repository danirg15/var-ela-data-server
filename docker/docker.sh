#!/bin/bash

image_name="ubuntu_vla"
container_name="ubuntu_vla"

if [[ $1 == "build" ]]; then
	docker build -t $image_name .
	docker run -v "$(pwd)":/home --name $container_name -it $image_name bash
	
elif [[ $1 == "ssh" ]]; then
	docker start $container_name
	docker exec -it $container_name bash

elif [[ $1 == "rm" ]]; then
	docker stop $container_name
	docker container rm $container_name
	docker image rm $image_name

elif [[ $1 == "stop" ]]; then
	docker stop $container_name
	
elif [[ $1 == "ls" ]]; then
	docker ps -a
	echo '------------------------------'
	docker image ls

else
	echo "docker.sh: Invalid command"
fi
