#!/bin/bash
echo "Testing"
for i in {0..10}
	do
		curl --data '{"player" :1}' http://localhost:3000/scores --header "Content-Type:application/json"
		sleep .5
		curl --data '{"player" :2}' http://localhost:3000/scores --header "Content-Type:application/json"
		sleep .5
	done
curl --data '{"player" :2}' http://localhost:3000/scores --header "Content-Type:application/json"
sleep .5	
echo "Done testing"