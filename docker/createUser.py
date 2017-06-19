import os
import subprocess
import pipes
import sys

user = "loader@quip"
if(len(sys.argv) > 1):
        user = sys.argv[1]



os.system("java -jar trusted-app-client-0.0.1-jar-with-dependencies.jar -action a -username "+user+"  -id camicSignup -secret 9002eaf56-90a5-4257-8665-6341a5f77107 -comments loader -expires 01/01/2050  -url http://camicroscope-bindaas:9099/trustedApplication > userinfo")
output = open('userinfo', 'r').read()

if(output.find("already exist")):
        '''Does user exist? Get a short lived api key'''
        cmd="java -jar trusted-app-client-0.0.1-jar-with-dependencies.jar -action i -username "+user+"  -id camicSignup -secret 9002eaf56-90a5-4257-8665-6341a5f77107 -comments loader -lifetime 999999999  -url http://camicroscope-bindaas:9099/trustedApplication > userinfo2"
        os.system(cmd)
        output = open('userinfo2', 'r').read()
        s = output.split("value")
        key = s[1].split("expires")[0]
        key =(key[3:len(key)-3])
        print(key)
        exit(1)
else:
        s = output.split("value")
        key = s[1].split("expires")[0]
        key =(key[3:len(key)-3])
        print(key)
