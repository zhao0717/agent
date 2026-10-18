
.PHONY: up down logs lint format seed reset test verify-trust audit-dependencies audit-licenses sandbox-env

PYTEST_ARGS ?=
BACKEND_PYTHON ?= $(shell cat backend/.python-version)
SANDBOX_ENV_FILE := docker/sandbox_provisioner/sandbox.env

# sandbox.env 不进 Git；缺失时由模板生成，避免 Compose 把挂载源创建成空目录。
sandbox-env:
	@if [ -d $(SANDBOX_ENV_FILE) ]; then rmdir $(SANDBOX_ENV_FILE); fi
	@if [ ! -f $(SANDBOX_ENV_FILE) ]; then \
		cp $(SANDBOX_ENV_FILE).example $(SANDBOX_ENV_FILE); \
		echo "Created $(SANDBOX_ENV_FILE) from $(SANDBOX_ENV_FILE).example"; \
	fi

up: sandbox-env
	@if [ ! -f .env ]; then \
		echo "Error: .env file not found. Please create it from .env.template"; \
		exit 1; \
	fi
	docker compose up -d

down:
	docker compose down

reset: sandbox-env
	@if [ ! -f .env ]; then \
		echo "Error: .env file not found. Please create it from .env.template"; \
		exit 1; \
	fi
	@if [ -n "$$VANETS_STATE_DIR" ] || grep -Eq '^[[:space:]]*VANETS_STATE_DIR[[:space:]]*=[[:space:]]*[^[:space:]#]' .env; then \
		echo "Refusing to delete an external VANETS_STATE_DIR; stop the slot and remove its exact state directory explicitly." >&2; \
		exit 1; \
	fi
	docker compose down
	rm -rf docker/volumes
	docker compose up -d
	@echo "Waiting for api to be ready..."
	@until docker compose exec -T api true >/dev/null 2>&1; do sleep 2; done
	$(MAKE) seed

logs:
	@docker compose logs --tail=50 api
	@echo "\n\nBranch: $$(git branch --show-current)"
	@echo "Commit ID: $$(git rev-parse HEAD)"
	@echo "System: $$(uname -a)"

seed:
	docker compose exec api uv run python scripts/seed_initial_users.py

######################
# LINTING AND FORMATTING
######################

format:
	cd backend && UV_PYTHON=$(BACKEND_PYTHON) uv run ruff format package
	cd backend && UV_PYTHON=$(BACKEND_PYTHON) uv run ruff check package --fix
	cd backend && UV_PYTHON=$(BACKEND_PYTHON) uv run ruff check --select I package --fix
	cd web && pnpm run format
	cd web && pnpm run lint

# 只检查不修改，供提交前与 CI 使用（与 ruff.yml 的命令保持一致）
lint:
	cd backend && UV_PYTHON=$(BACKEND_PYTHON) uv run ruff check package
	cd backend && UV_PYTHON=$(BACKEND_PYTHON) uv run ruff check --select I package
	cd web && pnpm run lint:check

# 后端单元测试（不依赖 docker 服务）；integration/e2e 需在容器环境运行
test:
	cd backend && UV_PYTHON=$(BACKEND_PYTHON) uv run pytest test/unit -m "not slow" $(PYTEST_ARGS)

verify-trust:
	python3 scripts/verify_engineering_contracts.py
	python3 -m unittest scripts.test_verify_engineering_contracts scripts.test_bump_version

audit-dependencies:
	cd backend && uv audit --locked --no-dev
	cd packages/vanets-cli && uv audit --locked --no-dev
	cd web && pnpm audit --audit-level=high --prod
	cd docs && pnpm audit --audit-level=high --prod
	@if uv audit --script scripts/dependency-audit-fixtures/vulnerable.py > /tmp/vanets-python-audit-negative.log 2>&1; then echo "Expected the vulnerable Python fixture to fail"; exit 1; fi
	grep -q "aiohttp 3.14.1 has" /tmp/vanets-python-audit-negative.log
	grep -q "GHSA-cq5v-8q36-5273" /tmp/vanets-python-audit-negative.log
	bash scripts/dependency-audit-fixtures/run-node-negative-control.sh

audit-licenses:
	cd backend && UV_PYTHON=$(BACKEND_PYTHON) uv run --isolated --no-dev --with pip-licenses pip-licenses --from mixed --format markdown
	cd packages/vanets-cli && uv run --isolated --no-dev --with pip-licenses pip-licenses --from mixed --format markdown
