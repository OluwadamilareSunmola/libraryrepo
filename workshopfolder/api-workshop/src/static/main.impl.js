// main.impl.js
// Actual implementations for fetching data from the backend API

async function fetchChartData(ticker) {
    try {
        const response = await fetch(`http://localhost:5000/api/history/${ticker}?period=1mo`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        // Convert backend data to chart format if needed
        return (data.data || []).map(row => ({
            time: Math.floor(new Date(row.date).getTime() / 1000),
            open: row.open,
            high: row.high,
            low: row.low,
            close: row.close,
            volume: row.volume
        }));
    } catch (error) {
        console.error('Error fetching chart data:', error);
        return [];
    }
}

async function fetchQuoteData(ticker) {
    try {
        const response = await fetch(`http://localhost:5000/api/quote/${ticker}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching quote data:', error);
        return { symbol: ticker, price: 0, change: 0, volume: 0, source: 'Error' };
    }
}

async function fetchNewsData(ticker) {
    try {
        const response = await fetch(`http://localhost:5000/api/news/${ticker}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error('Error fetching news data:', error);
        return [];
    }
}
