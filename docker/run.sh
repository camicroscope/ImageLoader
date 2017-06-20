#!/bin/bash
execstack -c /root/OpenCV/opencv-3.0.0/build/lib/libopencv_java300.so &
#service redis-server start
redis-server &

#Get API key from bindaas
#alias api_k="eval $(python createUser.py loasdderi1@qui1zsadfdiasd)";
sleep 30; # wait for bindaas
apikey=$(python createUser.py loader@quip)


sed -i -e "s/APIKEY/$apikey/g" /root/dataloader/config.js
# Run Annotations Loader
forever start /root/dataloader/bin/www 
while true; do sleep 1000; done

