const fs = require('fs');
const path = require('path');
const API_KEY = process.env.FINNHUB_TOKEN;
const FILE_PATH = path.join(__dirname, 'stock-data.json');
const TICKERS = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'META', 'NFLX', 'AMD', 'INTC', 'SPY', 'QQQ', 'DIS', 'BA', 'WMT', 'JPM'];
const REQUEST_DELAY = 1100; 
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                 if (res.status === 429) {
                     console.warn("rate issue, waiting 3 seconds");
                     await new Promise(r => setTimeout(r, 3000));
                     continue;
                 }
                 throw new Error(`HTTP Error ${res.status}`);
            }
            return await res.json();
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}
function loadDatabase() {
    let database = {};
    if (fs.existsSync(FILE_PATH)) {
        try {
            database = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
        } catch (e) {
            console.error("json structure is buns");
        }
    }
    return database;
}
async function run() {
    if (!API_KEY) {
        console.error("THE FUCKING API KEY IS MISSING WE ARE SO SCREWED");
        process.exit(1); 
    }
    console.log("github actoions data grab");
    let database = loadDatabase();
    let successCount = 0;
    for (let i = 0; i < TICKERS.length; i++) {
        const ticker = TICKERS[i];
        const nowTimestamp = Math.floor(Date.now() / 1000);
        try {
            const data = await fetchWithRetry(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`)
            if (!database[ticker]) {
                database[ticker] = { current: {}, history: [] };
            }
            database[ticker].current = data;        
            const history = database[ticker].history;
            const lastEntry = history.length > 0 ? history[history.length - 1] : null;
            if (!lastEntry || lastEntry.c !== data.c) {
                history.push({ t: nowTimestamp, c: data.c });
            }    
            if (history.length > 720) {
                database[ticker].history = history.slice(-720);
            }
            
            console.log(`[${i + 1}/${TICKERS.length}]${ticker} processed`);
            successCount++;
        } catch (error) {
            console.error(`[${i + 1}/${TICKERS.length}] cant grab ${ticker} since`, error.message);
        }
        if (i < TICKERS.length - 1) {
            await new Promise(r => setTimeout(r, REQUEST_DELAY));
        }
    }
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(database, null, 2));
        console.log(`\nall stock data successfully gained (${successCount}/${TICKERS.length}), ending process`);
        process.exit(0);
    } catch (writeError) {
        console.error("cant update dataset", writeError.message);
        process.exit(1);
    }
}

run();
