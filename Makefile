COMPOSE = docker compose -f infrastr/docker-compose.yaml --env-file .env

.PHONY: dev down logs db reset

dev:
	$(COMPOSE) up --build -d
	cd frontend && npm run dev

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

db:
	$(COMPOSE) up -d db

reset:
	$(COMPOSE) down -v
