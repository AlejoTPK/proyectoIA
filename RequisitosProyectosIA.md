

# **🏗️ Blueprint: AI-Powered Knowledge & SQL Engine (Hybrid Architecture)**

Este documento define la hoja de ruta técnica para el desarrollo de una plataforma robusta de vectorización de documentos y generación de consultas SQL. Se utilizará una arquitectura híbrida *Backend-For-Frontend* para aprovechar la velocidad de React en la UI y la supremacía de Python en el procesamiento de IA.

## **1\. Stack Tecnológico y Arquitectura de Sistemas**

Para garantizar rendimiento, escalabilidad y acceso al ecosistema nativo de IA, se implementará el siguiente stack:

* **Frontend (UI/UX):** **React 18+** (inicializado con **Vite**), **TypeScript**, y TailwindCSS. Comunicación vía Axios/Fetch.  
* **Backend (Core & AI):** **Python 3.11+** con **FastAPI** (tipado estricto con Pydantic y generación automática de OpenAPI).  
* **Base de Datos (Relacional y Vectorial):** **PostgreSQL 16** con la extensión pgvector.  
* **Procesamiento Asíncrono:** **Redis** como *message broker* y **Celery** (Python) para la ingesta y vectorización en segundo plano sin bloquear el API de FastAPI.  
* **IA/LLM Framework:** **LangChain** (Python) o SDK nativo de OpenAI/LlamaIndex.  
* **Infraestructura:** 100% contenerizado con **Docker** y docker-compose, listo para ser desplegado en VPS mediante gestores de contenedores.  
* **ORM:** **SQLAlchemy 2.0** con soporte para campos vectoriales. Control de migraciones con **Alembic**.

---

## **2\. Fases del Plan de Trabajo (Instrucciones de Ejecución)**

### **Fase 1: Infraestructura Base y Monorepo (Docker)**

**Objetivo:** Configurar el entorno de desarrollo y la red interna de contenedores.

1. **Orquestación:** Crea un docker-compose.yml en la raíz que levante 5 servicios interconectados:  
   * frontend: Contenedor Node/Vite en modo dev (puerto 5173).  
   * api: Contenedor Python/FastAPI (puerto 8000).  
   * worker: Contenedor Python/Celery consumiendo la misma base de código que api.  
   * db: PostgreSQL con imagen pgvector/pgvector:pg16.  
   * redis: Imagen oficial de Redis.  
2. **Modelado de Datos (Alembic/SQLAlchemy):** Define migraciones para:  
   * documents: id, filename, status.  
   * document\_chunks: id, document\_id, content, embedding (tipo Vector).  
   * query\_logs: Auditoría de prompts y SQL generado.  
3. **Arquitectura del Backend:** Estructura de carpetas limpia en FastAPI (/api, /core, /services, /models, /worker).

### **Fase 2: Backend \- Pipeline RAG y Tareas Asíncronas**

**Objetivo:** Ingesta de documentos pesados delegada a workers.

1. **Endpoint de Ingesta:** POST /api/v1/documents/upload.  
2. **Celery Worker (tasks.py):**  
   * **Parsing:** Extracción de texto de PDF/DOCX (usando PyPDF2 o pdfplumber).  
   * **Chunking Semántico:** RecursiveCharacterTextSplitter de LangChain.  
   * **Embedding & Storage:** Generación de vectores e inserción en PostgreSQL vía SQLAlchemy.  
3. **Búsqueda:** Endpoint POST /api/v1/documents/search que utilice similitud de coseno (\<=\> operator en pgvector).

### **Fase 3: Backend \- Motor NL2SQL Inteligente**

**Objetivo:** Transformar lenguaje humano a SQL ejecutable y seguro.

1. **Schema Introspection:** Servicio que extraiga dinámicamente el DDL de tablas permitidas en la base de datos (excluyendo esquemas del sistema).  
2. **Prompt Engineering:**  
   * Configurar un *System Prompt* restrictivo: Actuar como un motor SQL de **solo lectura**.  
   * Implementar validadores en Python que rechacen el string generado si contiene palabras clave destructivas (DROP, DELETE, UPDATE, INSERT).  
3. **Ejecución Seguro:** Endpoint POST /api/v1/sql/query que reciba lenguaje natural, genere el SQL, lo ejecute en la DB y retorne los datos estructurados en formato JSON.

### **Fase 4: Frontend \- Interfaz de Usuario (React)**

**Objetivo:** Consumir los servicios del backend mediante una UI interactiva.

1. **Módulo RAG:**  
   * Componente Drag & Drop para subir archivos.  
   * Indicador visual que consulte periódicamente (polling) el estado de la tarea en Celery.  
2. **Módulo NL2SQL:**  
   * Interfaz estilo chat para ingresar preguntas.  
   * Visualizador dual: Mostrar el SQL generado con resaltado de sintaxis, seguido de una tabla (DataGrid) renderizando el JSON de respuesta.

---

## **3\. Entregables Críticos de Inicialización**

1. **docker-compose.yml**: Configuración de los 5 servicios con variables de entorno compartidas (archivo .env).  
2. **Backend:** requirements.txt, main.py (setup de FastAPI), y alembic.ini.  
3. **Frontend:** package.json, configuración de Vite con proxy hacia http://api:8000 para evitar problemas de CORS.

---

## **4\. Criterios de Aceptación (Definition of Done)**

* \[ \] El comando docker-compose up \--build levanta todo el ecosistema (Front, Back, Worker, DB, Redis) sin errores.  
* \[ \] Se puede subir un PDF desde React, y el worker de Celery lo procesa sin bloquear el uso de la app.  
* \[ \] Desde el frontend, se puede preguntar en español sobre la base de datos, ver el SQL generado y visualizar los datos resultantes en una tabla web.

**Instrucción para el Agente:** *Actúa como un Senior Software Architect. Inicia ejecutando la Fase 1: genera la estructura de carpetas (separando frontend y backend), crea el archivo Docker Compose unificado, configura FastAPI con Pydantic/SQLAlchemy, e inicializa el proyecto Vite/React.*

---

Excelente decisión. Separar las responsabilidades y usar el ecosistema nativo de IA te ahorrará semanas de dolores de cabeza.

Aquí tienes el plan de trabajo definitivo (Blueprint). Está diseñado para que Antigravity monte un monorepo contenerizado donde el frontend (React) y el backend (FastAPI/Python) convivan armónicamente y se comuniquen a través de la red interna de Docker.

Copia y pega este bloque completo a tu agente:

---

# **🏗️ Blueprint: AI-Powered Knowledge & SQL Engine (Hybrid Architecture)**

Este documento define la hoja de ruta técnica para el desarrollo de una plataforma robusta de vectorización de documentos y generación de consultas SQL. Se utilizará una arquitectura híbrida *Backend-For-Frontend* para aprovechar la velocidad de React en la UI y la supremacía de Python en el procesamiento de IA.

## **1\. Stack Tecnológico y Arquitectura de Sistemas**

Para garantizar rendimiento, escalabilidad y acceso al ecosistema nativo de IA, se implementará el siguiente stack:

* **Frontend (UI/UX):** **React 18+** (inicializado con **Vite**), **TypeScript**, y TailwindCSS. Comunicación vía Axios/Fetch.  
* **Backend (Core & AI):** **Python 3.11+** con **FastAPI** (tipado estricto con Pydantic y generación automática de OpenAPI).  
* **Base de Datos (Relacional y Vectorial):** **PostgreSQL 16** con la extensión pgvector.  
* **Procesamiento Asíncrono:** **Redis** como *message broker* y **Celery** (Python) para la ingesta y vectorización en segundo plano sin bloquear el API de FastAPI.  
* **IA/LLM Framework:** **LangChain** (Python) o SDK nativo de OpenAI/LlamaIndex.  
* **Infraestructura:** 100% contenerizado con **Docker** y docker-compose, listo para ser desplegado en VPS mediante gestores de contenedores.  
* **ORM:** **SQLAlchemy 2.0** con soporte para campos vectoriales. Control de migraciones con **Alembic**.

---

## **2\. Fases del Plan de Trabajo (Instrucciones de Ejecución)**

### **Fase 1: Infraestructura Base y Monorepo (Docker)**

**Objetivo:** Configurar el entorno de desarrollo y la red interna de contenedores.

1. **Orquestación:** Crea un docker-compose.yml en la raíz que levante 5 servicios interconectados:  
   * frontend: Contenedor Node/Vite en modo dev (puerto 5173).  
   * api: Contenedor Python/FastAPI (puerto 8000).  
   * worker: Contenedor Python/Celery consumiendo la misma base de código que api.  
   * db: PostgreSQL con imagen pgvector/pgvector:pg16.  
   * redis: Imagen oficial de Redis.  
2. **Modelado de Datos (Alembic/SQLAlchemy):** Define migraciones para:  
   * documents: id, filename, status.  
   * document\_chunks: id, document\_id, content, embedding (tipo Vector).  
   * query\_logs: Auditoría de prompts y SQL generado.  
3. **Arquitectura del Backend:** Estructura de carpetas limpia en FastAPI (/api, /core, /services, /models, /worker).

### **Fase 2: Backend \- Pipeline RAG y Tareas Asíncronas**

**Objetivo:** Ingesta de documentos pesados delegada a workers.

1. **Endpoint de Ingesta:** POST /api/v1/documents/upload.  
2. **Celery Worker (tasks.py):**  
   * **Parsing:** Extracción de texto de PDF/DOCX (usando PyPDF2 o pdfplumber).  
   * **Chunking Semántico:** RecursiveCharacterTextSplitter de LangChain.  
   * **Embedding & Storage:** Generación de vectores e inserción en PostgreSQL vía SQLAlchemy.  
3. **Búsqueda:** Endpoint POST /api/v1/documents/search que utilice similitud de coseno (\<=\> operator en pgvector).

### **Fase 3: Backend \- Motor NL2SQL Inteligente**

**Objetivo:** Transformar lenguaje humano a SQL ejecutable y seguro.

1. **Schema Introspection:** Servicio que extraiga dinámicamente el DDL de tablas permitidas en la base de datos (excluyendo esquemas del sistema).  
2. **Prompt Engineering:**  
   * Configurar un *System Prompt* restrictivo: Actuar como un motor SQL de **solo lectura**.  
   * Implementar validadores en Python que rechacen el string generado si contiene palabras clave destructivas (DROP, DELETE, UPDATE, INSERT).  
3. **Ejecución Seguro:** Endpoint POST /api/v1/sql/query que reciba lenguaje natural, genere el SQL, lo ejecute en la DB y retorne los datos estructurados en formato JSON.

### **Fase 4: Frontend \- Interfaz de Usuario (React)**

**Objetivo:** Consumir los servicios del backend mediante una UI interactiva.

1. **Módulo RAG:**  
   * Componente Drag & Drop para subir archivos.  
   * Indicador visual que consulte periódicamente (polling) el estado de la tarea en Celery.  
2. **Módulo NL2SQL:**  
   * Interfaz estilo chat para ingresar preguntas.  
   * Visualizador dual: Mostrar el SQL generado con resaltado de sintaxis, seguido de una tabla (DataGrid) renderizando el JSON de respuesta.

---

## **3\. Entregables Críticos de Inicialización**

1. **docker-compose.yml**: Configuración de los 5 servicios con variables de entorno compartidas (archivo .env).  
2. **Backend:** requirements.txt, main.py (setup de FastAPI), y alembic.ini.  
3. **Frontend:** package.json, configuración de Vite con proxy hacia http://api:8000 para evitar problemas de CORS.

---

## **4\. Criterios de Aceptación (Definition of Done)**

* \[ \] El comando docker-compose up \--build levanta todo el ecosistema (Front, Back, Worker, DB, Redis) sin errores.  
* \[ \] Se puede subir un PDF desde React, y el worker de Celery lo procesa sin bloquear el uso de la app.  
* \[ \] Desde el frontend, se puede preguntar en español sobre la base de datos, ver el SQL generado y visualizar los datos resultantes en una tabla web.

**Instrucción para el Agente:** *Actúa como un Senior Software Architect. Inicia ejecutando la Fase 1: genera la estructura de carpetas (separando frontend y backend), crea el archivo Docker Compose unificado, configura FastAPI con Pydantic/SQLAlchemy, e inicializa el proyecto Vite/React.*

