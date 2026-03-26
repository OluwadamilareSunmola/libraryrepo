# API Workshop

This project is designed to provide students with a minimal working example of a Flask application that interacts with various APIs to fetch stock-related information.

## Project Structure

```
api-workshop
├── src
│   ├── app.py                # Entry point of the application
│   ├── routes
│   │   ├── __init__.py       # Marks the routes directory as a package
│   │   └── api_routes.py      # Defines API routes for fetching information
│   └── services
│       ├── __init__.py       # Marks the services directory as a package
│       └── stock_service.py   # Contains functions for interacting with stock APIs
├── requirements.txt          # Lists project dependencies
└── README.md                 # Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/OluwadamilareSunmola/libraryrepo.git
   cd libraryrepo/api-workshop
   ```

2. **Install dependencies:**
   Make sure you have Python and pip installed. Then run:
   ```
   pip install -r requirements.txt
   ```

3. **Run the application:**
   Start the Flask application by running:
   ```
   python src/app.py
   ```

4. **Access the API:**
   The API will be available at `http://127.0.0.1:5000/`. You can use tools like Postman or curl to interact with the endpoints defined in `src/routes/api_routes.py`.

## Usage Examples

- Fetch stock information:
  ```
  GET /api/stocks/<ticker>
  ```

- Fetch historical data:
  ```
  GET /api/stocks/<ticker>/history?period=<period>
  ```

- Fetch latest news:
  ```
  GET /api/stocks/<ticker>/news
  ```

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or additional features.