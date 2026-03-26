from flask import Blueprint, jsonify, request
from src.services.stock_service import get_quote, get_history, get_news, get_overview

api_routes = Blueprint('api_routes', __name__)

@api_routes.route('/api/quote/<string:ticker>', methods=['GET'])
def fetch_quote(ticker):
    data = get_quote(ticker)
    return jsonify(data)

@api_routes.route('/api/history/<string:ticker>', methods=['GET'])
def fetch_history(ticker):
    period = request.args.get('period', '1mo')
    data = get_history(ticker, period)
    return jsonify(data)

@api_routes.route('/api/news/<string:ticker>', methods=['GET'])
def fetch_news(ticker):
    data = get_news(ticker)
    return jsonify(data)

@api_routes.route('/api/overview/<string:ticker>', methods=['GET'])
def fetch_overview(ticker):
    data = get_overview(ticker)
    return jsonify(data)