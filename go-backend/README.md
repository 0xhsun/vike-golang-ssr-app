# Go Backend API

Golang + Gin backend service for todo management.

## Setup

1. Install dependencies:
```bash
cd go-backend
go mod tidy
```

2. Run the server:
```bash
go run main.go
```

Server will start on `http://localhost:8080`

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /health` - Health check

## Example Usage

```bash
# Get all todos
curl http://localhost:8080/api/todos

# Create a todo
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Go"}'

# Delete a todo
curl -X DELETE http://localhost:8080/api/todos/1
```