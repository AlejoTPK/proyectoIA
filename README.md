# 🏗️ AI-Powered Knowledge & SQL Engine

Una plataforma robusta de vectorización de documentos (RAG) y generación de consultas SQL (NL2SQL) diseñada con una arquitectura híbrida *Backend-For-Frontend*.

Este proyecto utiliza **React** para una interfaz de usuario dinámica y **FastAPI** para el procesamiento pesado de IA y lógica de negocio, todo orquestado mediante **Docker**.

---

## 🚀 Tecnologías Principales

### Frontend (UI/UX)
- **React 18+** & **Vite**: Velocidad y modernidad en el desarrollo.
- **TypeScript**: Tipado estricto para un código más seguro y mantenible.
- **TailwindCSS v4**: Diseño premium con utilidades de última generación.
- **Axios**: Comunicación fluida con el backend.

### Backend (Core & AI)
- **Python 3.11+** & **FastAPI**: Backend asíncrono de alto rendimiento.
- **SQLAlchemy 2.0**: ORM moderno con soporte para vectores.
- **LangChain / LlamaIndex**: Frameworks líderes para orquestación de LLMs.
- **Celery & Redis**: Procesamiento asíncrono para tareas de larga duración (vectorización).

### Infraestructura y Datos
- **PostgreSQL 16 + pgvector**: Almacenamiento relacional y vectorial en una sola base de datos.
- **Docker & Docker Compose**: Despliegue reproducible y escalable.
- **Alembic**: Gestión de migraciones de base de datos.

---

## ✨ Características Clave

1.  **Pipeline RAG (Retrieval-Augmented Generation)**:
    - Ingesta de documentos PDF/DOCX.
    - Chunking semántico y generación de embeddings.
    - Búsqueda por similitud vectorial usando `pgvector`.
2.  **Motor NL2SQL Inteligente**:
    - Transformación de lenguaje natural a SQL ejecutable.
    - Introspección dinámica del esquema de base de datos.
    - Validación de seguridad (Zero-Trust) para evitar comandos destructivos.
3.  **Procesamiento Asíncrono**:
    - La carga y procesamiento de documentos no bloquea la interfaz de usuario.
    - Seguimiento de estado de tareas en tiempo real.

---

## 🛠️ Configuración y Ejecución

### Requisitos Previos
- Docker y Docker Compose instalados.
- Archivo `.env` configurado (ver `.env.example`).

### Inicio Rápido
1.  Clona el repositorio.
2.  Configura tus variables de entorno:
    ```bash
    cp .env.example .env
    ```
3.  Levanta los servicios con Docker:
    ```bash
    docker-compose up --build
    ```

La aplicación estará disponible en:
- **Frontend**: `http://localhost:5173`
- **API (Docs)**: `http://localhost:8000/docs`

---

## 📁 Estructura del Proyecto

```text
.
├── backend/            # Código fuente FastAPI, Workers y Lógica de IA
├── frontend/           # Aplicación React + TypeScript + Tailwind
├── docker-compose.yml  # Orquestación de servicios (API, Web, Worker, DB, Redis)
├── DESIGN.md           # Especificaciones de diseño y UI/UX
└── README.md           # Documentación principal del proyecto
```

---

## 🛡️ Seguridad y Buenas Prácticas

- **Tipado Estricto**: Uso obligatorio de Pydantic y Type Hints en el backend.
- **Validación SQL**: Intercepción de comandos maliciosos mediante AST.
- **Contenerización**: Aislamiento total de servicios y dependencias.
- **Manejo de Errores**: Sistema centralizado de excepciones y logging estructurado.

---

Desarrollado con ❤️ para el procesamiento inteligente de datos.
