name="postgres_test"
docker rm $name -f || true
docker run --name $name -d -p 5432:5432 postgres
sleep 5
docker exec $name psql -U postgres -c 'CREATE DATABASE test;'
docker exec $name psql -U postgres -d test -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
docker cp ./schema.sql $name:/root
docker cp ./postman/data.sql $name:/root
docker exec $name psql -U postgres -d test -a -f /root/schema.sql
docker exec $name psql -U postgres -d test -a -f /root/data.sql
