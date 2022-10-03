To connect the our moralis server to the local hardhat node, click https://admin.moralis.io/dapps/networks/settings/0x539/213922
You should be inside a tab called "Devchain Proxy Server". Follow the instructions 

To check for events, you can either do it programmatically like in the "addEvents.js", or go the the "sync" tab here https://admin.moralis.io/dapps/syncs/events/213922

command to connect moralis server to our local host : frpc.exe -c frpc.ini

Anytime we kill the local blockchain and restart it, we have to "Reset Local Devchain" in our moralis dashboard

its important you have your moralisApiKey and moralisSecret in your env file when using cloud functions

TO run the cloud functions: 
    1. go into the package.json file and look at "moralis:cloud" and make sure it looks exactly like that
    2. it will read your apikey and secret from your env file
    3. run "npm run moralis:cloud" in your terminal to run the cloud functions in the cloudFunctions folder