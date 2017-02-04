## Install

1. Clone repository
2. Install latest node.js (tested with v6.9.5) - https://nodejs.org/en/download/
3. Install deps by running `npm install` in project folder
4. Create `keys.json` file in project folder with the keys for Marvel API:
```
{
  "privateKey": "YOUR_PRIVATE_KEY",
  "apiKey": "YOU_PUBLIC_KEY"
}
```

## Run

1. `./report.sh` to cache data and show report
2. `node cache.js` to only cache data to local file
3. `node report.js` to show the report on cached data
