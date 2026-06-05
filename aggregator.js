// this file is quite literally useless, this was merely test code that my mom helped me with and heavily cleaned by gemini but
// now has zero use since the aggregator was only for if i actually made stockss work
const fs = require('fs').promises;
const path = require('path');
const MOCK_EXTERNAL_EQUITY_API = {
    "AAPL": { price_now: 175.20, day_high: 176.00, day_low: 173.50, delta: 1.20, delta_pct: 0.69 },
    "NVDA": { price_now: 875.00, day_high: 890.00, day_low: 860.00, delta: 25.00, delta_pct: 2.94 }
};
const MOCK_EXTERNAL_ALT_API = {
    "BTC": { rate: 64250.00, peak: 65000.00, valley: 63100.00, shift: -450.00, shift_ratio: -0.69 },
    "ETH": { rate: 3450.00, peak: 3500.00, valley: 3380.00, shift: 85.00, shift_ratio: 2.52 }
};
const DATA_FILE_PATH = path.join(__dirname, 'stock-data.json');
async function processTickerIngestion(requestedTicker) {
    const ticker = requestedTicker.toUpperCase();
    let rawAsset = null;
    let sourceType = 'stock';
    if (MOCK_EXTERNAL_EQUITY_API[ticker]) {
        rawAsset = MOCK_EXTERNAL_EQUITY_API[ticker];
        sourceType = 'stock';
    } else if (MOCK_EXTERNAL_ALT_API[ticker]) {
        rawAsset = MOCK_EXTERNAL_ALT_API[ticker];
        sourceType = 'alt/crypto';
    } else {

        rawAsset = generateFallbackAssetData(ticker);
        sourceType = 'dynamic_generation';
    }
    let normalizedData = {
        current: {
            c: sourceType === 'alt/crypto' ? rawAsset.rate : rawAsset.price_now,
            h: sourceType === 'alt/crypto' ? rawAsset.peak : rawAsset.day_high,
            l: sourceType === 'alt/crypto' ? rawAsset.valley : rawAsset.day_low,
            d: sourceType === 'alt/crypto' ? rawAsset.shift : rawAsset.delta,
            dp: sourceType === 'alt/crypto' ? rawAsset.shift_ratio : rawAsset.delta_pct,
            o: sourceType === 'alt/crypto' ? (rawAsset.rate - rawAsset.shift) : (rawAsset.price_now - rawAsset.delta)
        },
        history: [] 
    };
    normalizedData.history = compileMockHistory(normalizedData.current);
    try {
        let currentDatabase = {};
        try {
            const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf8');
            currentDatabase = JSON.parse(fileContent);
        } catch (readError) {
   
            currentDatabase = {};
        }
        currentDatabase[ticker] = normalizedData;
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(currentDatabase, null, 4), 'utf8');
        console.log(`[BACKEND] process success: combined ${ticker} via [${sourceType}]`);
        return normalizedData;
    } catch (err) {
        console.error("[BACKEND] database write issue", err);
        throw err;
    }
}
function generateFallbackAssetData(ticker) {
    let hash = 0;
    for (let i = 0; i < ticker.length; i++) {
        hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
    }
    const basePrice = Math.abs(hash % 450) + 15.50;
    const delta = (Math.random() - 0.45) * (basePrice * 0.03);
    
    return {
        price_now: basePrice,
        day_high: basePrice + (basePrice * 0.02),
        day_low: basePrice - (basePrice * 0.02),
        delta: delta,
        delta_pct: (delta / basePrice) * 100
    };
}
function compileMockHistory(currentQuote) {
    const history = [];
    let basePrice = currentQuote.o;
    const now = Math.floor(Date.now() / 1000);
    for (let i = 15; i >= 0; i--) {
        const timestamp = now - (i * 3600);
        const variance = (Math.random() - 0.5) * (currentQuote.h - currentQuote.l || 2);
        basePrice += variance;
        history.push({
            t: timestamp,
            c: i === 0 ? currentQuote.c : Number(basePrice.toFixed(2))
        });
    }
    return history;
}
(async () => {
    await processTickerIngestion("BTC");
    await processTickerIngestion("AAPL");
    await processTickerIngestion("XYZ");
})();
