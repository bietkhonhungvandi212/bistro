default: up

bootstrap:
	make install
	make container-up
	make up

up:
	yarn start:dev

install:
	yarn install

container-up:
	docker compose up -d --remove-orphans

container-down:
	docker compose down

ps: 
	docker compose ps