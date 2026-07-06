#!/bin/bash
# Execute com: sudo bash setup_db.sh

echo "Configurando o banco de dados JampaSafe no PostgreSQL..."

# Cria o usuário e o banco de dados
sudo -u postgres psql -c "CREATE USER jampasafe_user WITH PASSWORD 'jampasafe123';"
sudo -u postgres psql -c "CREATE DATABASE jampasafe OWNER jampasafe_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE jampasafe TO jampasafe_user;"

echo "Configuração do banco de dados finalizada com sucesso."
echo "Agora você já pode executar o backend (Spring Boot)."
