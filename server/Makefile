postgresinit:
	docker run --name postgres15 -p 5433:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -d postgres:15-alpine

postgres:
	docker exec -it postgres15 psql

createdb:
	docker exec -it postgres15 createdb --username=root --owner=root go-live-chat

dropdb:
	docker exec -it postgres15 dropdb go-live-chat

migrateup:
	migrate -path db/migrations -database "postgresql://root:root@localhost:5433/go-live-chat?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migrations -database "postgresql://root:root@localhost:5433/go-live-chat?sslmode=disable" -verbose down
	

.PHONY: postgresinit postgres createdb dropdb migrateup migratedown