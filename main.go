package main

import (
	_ "embed"

	"github.com/wailsapp/wails"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB
var dbErr error

//go:embed frontend/build/static/js/main.js
var js string

//go:embed frontend/build/static/css/main.css
var css string

type Product struct {
	gorm.Model
	Code  string
	Price uint
}

func getProducts() []Product {
	var products []Product
	db.Find(&products)
	return products
}

func createProduct(code string, price uint) Product {
	var product Product
	db.Create(&Product{Code: code, Price: price})
	db.Find(&product, "code = ?", code)

	return product
}

func main() {
	db, dbErr = gorm.Open(sqlite.Open("data.db"), &gorm.Config{})

	if dbErr != nil {
		panic(dbErr)
	}

	// Migrate the schema
	db.AutoMigrate(&Product{})

	// Create
	// db.Create(&Product{Code: "D42", Price: 100})

	app := wails.CreateApp(&wails.AppConfig{
		Resizable: true,
		Width:     1024,
		Height:    768,
		Title:     "formulae",
		JS:        js,
		CSS:       css,
		Colour:    "#131313",
	})
	app.Bind(createProduct)
	app.Bind(getProducts)
	app.Run()
}
