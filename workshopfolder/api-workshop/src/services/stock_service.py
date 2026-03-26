"""
stock_service.py
────────────────
Stock service for fetching stock-related information from various APIs.

This module contains functions to interact with stock data APIs,
process responses, and handle any necessary data transformations.
"""

import os
import requests
import yfinance as yf

# Example: Guide for implementing your own stock data fetcher
"""
Try to fetch stock data using an API of your choice. For example, you might use the requests library to call an endpoint and process the JSON response. Here’s a template to get you started:

def get_custom_stock_data(ticker: str) -> dict:
    # Example: Use requests to call an API
    # url = f"https://api.example.com/stock/{ticker}"
    # response = requests.get(url)
    # data = response.json()
    # return {
    #     "symbol": ticker,
    #     "price": data.get("price"),
    #     # ...other fields
    # }
    pass  # Replace with your implementation

Remember: Don’t forget to handle errors and check the API documentation for required headers or authentication!


# Example of expected data output:
# {
#     "symbol": "AAPL",
#     "price": 175.23,
#     "change": 1.12,
#     "change_pct": 0.65,
#     "volume": 12003456,
#     "market_cap": 2800000000000
# }
"""

TIINGO_API_KEY = os.getenv("TIINGO_API_KEY")
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")

def get_stock_quote(ticker: str) -> dict:
    # Instruction: Try to implement a function that fetches the latest stock quote for a given ticker using any stock API you like. Use the requests library or another package to call the API, process the response, and return a dictionary with the relevant fields.
    # Example of expected data output:
    # {
    #     "symbol": "AAPL",
    #     "price": 175.23,
    #     "change": 1.12,
    #     "change_pct": 0.65,
    #     "volume": 12003456,
    #     "market_cap": 2800000000000
    # }
    """Fetch the latest stock quote for a given ticker."""
    # TODO: Implement this function to fetch the latest stock quote for the given ticker.
    # See the instruction and example above for guidance.
    pass

def _get_quote_yfinance(ticker: str) -> dict:
    # Instruction: Implement a function to fetch a stock quote from Yahoo Finance for the given ticker. Use the yfinance library or requests to call the Yahoo Finance API, process the response, and return a dictionary with the relevant fields.
    # Example of expected data output:
    # {
    #     "symbol": "AAPL",
    #     "price": 175.23,
    #     "change": 1.12,
    #     "change_pct": 0.65,
    #     "volume": 12003456,
    #     "market_cap": 2800000000000
    # }
    """Fetch stock quote from Yahoo Finance."""
    # TODO: Implement this function to fetch a stock quote from Yahoo Finance for the given ticker.
    # See the instruction and example above for guidance.
    pass

def _get_quote_tiingo(ticker: str) -> dict:
    """Fetch stock quote from Tiingo."""
    # TODO: Implement this function to fetch a stock quote from the Tiingo API for the given ticker.
    # See the instruction and example above for guidance.
    pass

def get_stock_history(ticker: str, period: str) -> list:
    # Instruction: Implement a function to fetch historical stock data for a given ticker and period. You can use an API or library of your choice. The function should return a list of dictionaries, each representing a record (e.g., a day) of historical data.
    # Example of expected data output:
    # [
    #     {
    #         "Date": "2024-03-25",
    #         "Open": 174.0,
    #         "High": 176.0,
    #         "Low": 173.5,
    #         "Close": 175.23,
    #         "Volume": 12003456
    #     },
    #     ...
    # ]
    """Fetch historical stock data for a given ticker and period."""
    # TODO: Implement this function to fetch historical stock data for the given ticker and period.
    # See the instruction and example above for guidance.
    pass

def get_news(ticker: str) -> list:
    # Instruction: Implement a function to fetch the latest news articles for a given stock ticker. Use an API or library of your choice. The function should return a list of dictionaries, each containing a news title and a link.
    # Example of expected data output:
    # [
    #     {"title": "Apple launches new product", "link": "https://news.example.com/article1"},
    #     {"title": "AAPL stock hits new high", "link": "https://news.example.com/article2"}
    # ]
    """Fetch latest news articles for a given stock ticker."""
    # TODO: Implement this function to fetch news articles for the given ticker.
    # See the instruction and example above for guidance.
    pass
