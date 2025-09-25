package main

import (
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
)

type TodoItem struct {
	ID   int    `json:"id"`
	Text string `json:"text"`
}

type CreateTodoRequest struct {
	Text string `json:"text"`
}

// In-memory storage (similar to the original JS implementation)
var (
	todos   []TodoItem
	todosMu sync.RWMutex
	nextID  = 1
)

func init() {
	// Initialize with default todos
	todos = []TodoItem{
		{ID: 1, Text: "Buy milk"},
		{ID: 2, Text: "Buy strawberries"},
	}
	nextID = 3
}

// GET /api/todos - Get all todos
func getTodos(c *gin.Context) {
	todosMu.RLock()
	defer todosMu.RUnlock()

	c.JSON(http.StatusOK, gin.H{
		"data": todos,
	})
}

// POST /api/todos - Create a new todo
func createTodo(c *gin.Context) {
	var req CreateTodoRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	if req.Text == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Text field is required",
		})
		return
	}

	todosMu.Lock()
	newTodo := TodoItem{
		ID:   nextID,
		Text: req.Text,
	}
	todos = append(todos, newTodo)
	nextID++
	todosMu.Unlock()

	c.JSON(http.StatusCreated, gin.H{
		"status": "OK",
		"data":   newTodo,
	})
}

// DELETE /api/todos/:id - Delete a todo
func deleteTodo(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid todo ID",
		})
		return
	}

	todosMu.Lock()
	defer todosMu.Unlock()

	for i, todo := range todos {
		if todo.ID == id {
			todos = append(todos[:i], todos[i+1:]...)
			c.JSON(http.StatusOK, gin.H{
				"status": "OK",
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{
		"error": "Todo not found",
	})
}

func testNewAPI(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "N",
	})
}

func main() {
	r := gin.Default()

	// Enable CORS for all origins (adjust for production)
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// API routes
	api := r.Group("/api")
	{
		api.GET("/todos", getTodos)
		api.POST("/todos", createTodo)
		api.POST("/todo/create", createTodo) // Legacy compatibility route
		api.DELETE("/todos/:id", deleteTodo)
		api.GET("/test", testNewAPI)
	}

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
		})
	})

	port := "8080"
	if envPort := gin.Mode(); envPort != "" {
		// You can set GIN_MODE=release and use environment variables for port
	}

	r.Run(":" + port)
}
