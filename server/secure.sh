rm -rf https
mkdir "https"
sudo openssl genrsa -out https/fastify.key 2048
sudo openssl req -new -x509 -key https/fastify.key -out https/fastify.crt -days 3650 -subj /CN=localhost
