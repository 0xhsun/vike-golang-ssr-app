package main

import (
    "log"
    "net/http"
    "sync"
    "time"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type Todo struct {
    ID        string    `json:"id"`
    Title     string    `json:"title" binding:"required"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"createdAt"`
}

type TodoStore struct {
    mu    sync.RWMutex
    todos map[string]*Todo
}

var store = &TodoStore{
    todos: make(map[string]*Todo),
}

func main() {
    // 初始化一些預設資料
    initializeData()

    // 建立 Gin 路由器
    router := gin.Default()

    // 設置 CORS
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:3000"}
    config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}
    config.AllowCredentials = true
    router.Use(cors.New(config))

    // API 路由群組
    api := router.Group("/api")
    {
        api.GET("/todos", getTodos)
        api.POST("/todos", createTodo)
        api.PUT("/todos/:id", updateTodo)
        api.DELETE("/todos/:id", deleteTodo)
        api.PATCH("/todos/:id/toggle", toggleTodo)
    }

    // 健康檢查
    router.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"status": "healthy"})
    })

    log.Println("Server starting on :8080...")
    if err := router.Run(":8080"); err != nil {
        log.Fatal("Failed to start server:", err)
    }
}

func initializeData() {
    todos := []Todo{
        {
            ID:        "1",
            Title:     "完成專案文件",
            Completed: false,
            CreatedAt: time.Now(),
        },
        {
            ID:        "2",
            Title:     "準備會議簡報",
            Completed: true,
            CreatedAt: time.Now(),
        },
        {
            ID:        "3",
            Title:     "代碼審查",
            Completed: false,
            CreatedAt: time.Now(),
        },
    }

    for _, todo := range todos {
        store.todos[todo.ID] = &todo
    }
}

// 取得所有待辦事項
func getTodos(c *gin.Context) {
    store.mu.RLock()
    defer store.mu.RUnlock()

    todos := make([]*Todo, 0, len(store.todos))
    for _, todo := range store.todos {
        todos = append(todos, todo)
    }

    c.JSON(http.StatusOK, todos)
}

// 建立新的待辦事項
func createTodo(c *gin.Context) {
    var todo Todo

    if err := c.ShouldBindJSON(&todo); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "標題為必填欄位",
            "details": err.Error(),
        })
        return
    }

    todo.ID = generateID()
    todo.CreatedAt = time.Now()
    todo.Completed = false

    store.mu.Lock()
    store.todos[todo.ID] = &todo
    store.mu.Unlock()

    c.JSON(http.StatusCreated, &todo)
}

// 更新待辦事項
func updateTodo(c *gin.Context) {
    id := c.Param("id")

    var updates Todo
    if err := c.ShouldBindJSON(&updates); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "無效的請求資料",
            "details": err.Error(),
        })
        return
    }

    store.mu.Lock()
    defer store.mu.Unlock()

    if todo, exists := store.todos[id]; exists {
        todo.Title = updates.Title
        todo.Completed = updates.Completed
        c.JSON(http.StatusOK, todo)
    } else {
        c.JSON(http.StatusNotFound, gin.H{
            "error": "找不到該待辦事項",
        })
    }
}

// 刪除待辦事項
func deleteTodo(c *gin.Context) {
    id := c.Param("id")

    store.mu.Lock()
    defer store.mu.Unlock()

    if _, exists := store.todos[id]; exists {
        delete(store.todos, id)
        c.Status(http.StatusNoContent)
    } else {
        c.JSON(http.StatusNotFound, gin.H{
            "error": "找不到該待辦事項",
        })
    }
}

// 切換待辦事項完成狀態
func toggleTodo(c *gin.Context) {
    id := c.Param("id")

    store.mu.Lock()
    defer store.mu.Unlock()

    if todo, exists := store.todos[id]; exists {
        todo.Completed = !todo.Completed
        c.JSON(http.StatusOK, todo)
    } else {
        c.JSON(http.StatusNotFound, gin.H{
            "error": "找不到該待辦事項",
        })
    }
}

// 生成唯一 ID
func generateID() string {
    return uuid.New().String()
}
