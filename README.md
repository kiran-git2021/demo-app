
# IoT-Platform-A

Directory
<pre>
IoT-Platform-A
| ____ backend/
|      |____ App-code/
|      |     |___ conf/
|      |     |___ log/
|      |     |___ Modules/
|      |     |___ packages/
|      |     |    |__ requirements.txt
|      |     |
|      |     |___ services/
|      |     |___ be_app.py
|      |     
|      |
|      |__ Dockerfile
|   
|____ frontend/
|     |___react-app/
|     |
|     |___ Dockerfile
|
| ____ docker-compose.yml
| ____ readme.md
|
|

</pre>

## DOCKER BUILD & RUN  COMMANDS

## 1. Frontend (React + Nginx)

### Step 1: Build the image

```bash
  cd frontend
  docker build -t my-frontend .
```

### Step 2: Run the container

```bash
  docker run -d -p 3000:80 --name frontend my-frontend
```

#### Access: http://localhost:3000

## 2 Backend (FastAPI)
### Step 1: Build the image

```bash
  cd backend
  docker build -t my-backend .
```

## Step 2: Run the container

```bash
  docker run -d -p 8000:8000 --name backend \
    --env-file ../.env \
    my-backend
   ```


#### Access FastAPI docs: http://localhost:8000/docs
#### Make sure Postgres, Elasticsearch, and Keycloak are running if your backend depends on them.

## PostgreSQL

### Step 1: Run the official image

```bash
  docker run -d -p 5432:5432 --name postgres \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=admin123 \
    -e POSTGRES_DB=mydb \
    -v postgres_data:/var/lib/postgresql/data \
    postgres:15
```

#### Connect from backend using postgres:5432 as host if using Docker network.

## Elasticsearch

```bash
  docker run -d -p 9200:9200 --name elasticsearch \
    -e discovery.type=single-node \
    -e xpack.security.enabled=false \
    -v es_data:/usr/share/elasticsearch/data \
    docker.elastic.co/elasticsearch/elasticsearch:8.10.0
```

#### Access: http://localhost:9200

## Keycloak

```bash
  docker run -d -p 8080:8080 --name keycloak \
    -e KEYCLOAK_ADMIN=admin \
    -e KEYCLOAK_ADMIN_PASSWORD=admin \
    -e KC_DB=postgres \
    -e KC_DB_URL=jdbc:postgresql://<POSTGRES_HOST>:5432/keycloak \
    -e KC_DB_USERNAME=admin \
    -e KC_DB_PASSWORD=admin123 \
    quay.io/keycloak/keycloak:23.0 start-dev
```

#### Access: http://localhost:8080
#### Replace <POSTGRES_HOST> with the correct hostname or container name if connecting via Docker network.

## Connect Everything

#### Make sure the backend’s .env points to the container names as hosts:

```bash
  POSTGRES_HOST=postgres
  ELASTICSEARCH_HOST=elasticsearch
  KEYCLOAK_HOST=keycloak
```

## If you want, you can create a Docker network to link containers:

```bash
    docker network create app-network
    docker network connect app-network frontend
    docker network connect app-network backend
    docker network connect app-network postgres
    docker network connect app-network elasticsearch
    docker network connect app-network keycloak
```
## docker run commands
```bash
   docker-compose build
   docker-compose up
```