#!/usr/bin/env bash
set -e

echo "=== Instalando Docker ==="

# Install using official script
curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
sudo sh /tmp/get-docker.sh

# Add current user to docker group
sudo usermod -aG docker "$USER"

echo ""
echo "Docker instalado. Versión:"
docker --version

echo ""
echo "=== Siguientes pasos ==="
echo "1. Cierra y vuelve a abrir tu terminal (o ejecuta 'newgrp docker')"
echo "2. Ejecuta: docker compose up -d"
echo "3. Abre http://localhost:8080"
