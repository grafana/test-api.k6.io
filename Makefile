install:
	poetry install --no-root

lint:
	poetry run ruff check

format:
	poetry run ruff check --select I --fix
	poetry run ruff format

serve:
	poetry run python manage.py collectstatic --noinput
	poetry run uvicorn --port 8000 base.asgi:application
