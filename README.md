## Run môi trường development
* docker-compose up -d
* docker exec -it container_webserver_id bash
* cp .env.example .env
* npm install
* npm run migrate:run
* npm run seed:run
* Mã nguồn được map vào folder /opt/app