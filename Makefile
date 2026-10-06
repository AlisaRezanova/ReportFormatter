COMPOSE = docker compose -f infrastr/docker-compose.yaml --env-file .env

.PHONY: dev down logs db reset migration migrate

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

# usage: make migration m="add users rules issues"
migration:
	cd backend && .venv/bin/alembic revision --autogenerate -m "$(m)"

migrate:
	cd backend && .venv/bin/alembic upgrade head
