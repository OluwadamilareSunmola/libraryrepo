import yfinance as yf

import os
import requests

TIINGO_API_KEY = os.getenv("TIINGO_API_KEY")

# Actual implementation for get_news
def get_news(ticker: str) -> list:
    """Fetch latest news articles for a given stock ticker."""
    try:
        stock = yf.Ticker(ticker)
        news = stock.news
        return [{"title": item["title"], "link": item["link"]} for item in news]
    except Exception:
        return []

# Actual implementation for get_stock_quote
def get_stock_quote(ticker: str) -> dict:
    quote = _get_quote_yfinance(ticker)
    if not quote:
        quote = _get_quote_tiingo(ticker)
    return quote if quote else {"error": "Unable to fetch stock quote"}

# Actual implementation for _get_quote_yfinance
def _get_quote_yfinance(ticker: str) -> dict:
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return {
            "symbol": ticker,
            "price": info.get("currentPrice", 0),
            "change": info.get("regularMarketChange", 0),
            "change_pct": info.get("regularMarketChangePercent", 0),
            "volume": info.get("regularMarketVolume", 0),
            "market_cap": info.get("marketCap", 0),
        }
    except Exception:
        return None

# Actual implementation for _get_quote_tiingo
def _get_quote_tiingo(ticker: str) -> dict:
    if not TIINGO_API_KEY:
        return None
    url = f"https://api.tiingo.com/iex/{ticker}?token={TIINGO_API_KEY}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return {
                "symbol": ticker,
                "price": data[0].get("last", 0),
                "change": data[0].get("change", 0),
                "change_pct": data[0].get("changePercent", 0),
                "volume": data[0].get("volume", 0),
                "market_cap": data[0].get("marketCap", 0),
            }
    except Exception:
        return None

# Actual implementation for get_stock_history
def get_stock_history(ticker: str, period: str) -> list:
    """Fetch historical stock data for a given ticker and period."""
    try:
        stock = yf.Ticker(ticker)
        history = stock.history(period=period)
        return history.reset_index().to_dict(orient='records')
    except Exception:
        return []
