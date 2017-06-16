#!/bin/bash
execstack -c /root/OpenCV/opencv-3.0.0/build/lib/libopencv_java300.so &
#service redis-server start
redis-server &

#Get API key from bindaas
#alias api_k="eval $(python createUser.py loasdderi1@qui1zsadfdiasd)";
apikey=$(python createUser.py loader@quip)


sed -i -e "s/APIKEY/$apikey/g" annotationloader/config.js
# Run Annotations Loader
forever start /root/annotationloader/bin/www 
# Run KUE Dashboard
forever start  /root/annotationloader/node_modules/kue/bin/kue-dashboard 
while true; do sleep 1000; done

