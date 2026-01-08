package backend

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var db *mongo.Database

// ConnectDB connects to MongoDB
func ConnectDB(ctx context.Context) error {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "rentkar"
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return fmt.Errorf("failed to connect: %w", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		return fmt.Errorf("failed to ping: %w", err)
	}

	db = client.Database(dbName)
	log.Println("Connected to MongoDB")
	return nil
}

// DisconnectDB disconnects from MongoDB
func DisconnectDB(ctx context.Context) error {
	if db != nil {
		return db.Client().Disconnect(ctx)
	}
	return nil
}

// GetCollection returns a MongoDB collection
func GetCollection(name string) *mongo.Collection {
	return db.Collection(name)
}
