# XLR8 Chainlink External Adapter

#### Based off of code from `https://github.com/thodges-gh/CL-EA-NodeJS-Template`

***About:*** [XLR8](https://twitter.com/XLR8universe) is a project from [Harkness HAO](https://harkness.io/) where users collect chassis, engine, and wrap NFTs from internet scavenger hunts and minigames and can "fuse" them into a full car NFT. Once completed, XLR8 cars will be valuble assets that can be "plug n' played" into racing games and metaverses, and will be able to be "rented" to others for passive income. This amount of smart contract interoperatibility and NFT dynamics is unprecendented in the world of digital collectibles, partially due to the need for custom, secure data feeds on and off chain. Chainlink is a bridge for data to travel between on and off chain, and this "external adapter" is one component to XLR8's complete Chainlink solution to data feeds. This external adapter receives an HTTP request from the custom XLR8 Chainlink Node (running on AWS EC2) and queries a mongoDB database before returning a link to metadata stored on [IPFS](https:/ipfs.io).

## Steps

1. Install dependencies with `yarn`
1. Run with `yarn start`
1. Call with `curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": { "model": 1, "wrap": 2, "engine": 3 } }'`

## Deployment

Info on how to deploy with Docker is listed on the GitHub shown above
