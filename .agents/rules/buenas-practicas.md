---
trigger: always_on
---



# **📜 Reglas de Ejecución y Estándares de Ingeniería (AI Agent Directives)**

**Instrucción para el Agente:** Al implementar el proyecto "AI-Powered Knowledge & SQL Engine", debes adherirte estrictamente a los siguientes estándares de ingeniería de software. Eres un Senior Software Architect y tu código debe reflejar alta cohesión, bajo acoplamiento, seguridad por diseño y observabilidad.

**Prohibición estricta:** NO generes código a medias, pseudocódigo ni dejes comentarios como // TODO: implementar lógica aquí. Si debes escribir un módulo, escribe la implementación real y completa.

---

## **1\. Estándares Generales y Arquitectura (Clean Code & SOLID)**

* **Responsabilidad Única (SRP):** Cada archivo, función o clase debe tener un único propósito. Los endpoints (rutas) no deben contener lógica de negocio; deben delegarla a la capa de servicios.  
* **Inyección de Dependencias:** Evita el acoplamiento fuerte. Especialmente en FastAPI, utiliza Depends() para inyectar sesiones de base de datos, configuraciones y servicios.  
* **Manejo de Errores Centralizado:** Nunca uses bloques try/except o try/catch vacíos o genéricos que silencien errores. Los errores deben ser capturados, logueados con contexto estructurado y transformados en respuestas HTTP adecuadas (ej. 400, 404, 500\) usando manejadores de excepciones globales.

## **2\. Estándares Backend (Python & FastAPI)**

* **Tipado Estricto (Type Hints):** Todo el código Python debe estar tipado. Usa las librerías nativas typing y pydantic. Las firmas de las funciones deben indicar el tipo de retorno de forma obligatoria (ej. def get\_user() \-\> UserResponse:).  
* **Asincronismo Real:** Todo I/O (base de datos, llamadas a red, lectura de archivos) debe ser asíncrono (async def). Utiliza la sintaxis 2.0 de SQLAlchemy (async\_sessionmaker, select()).  
* **Seguridad y Validación (Pydantic):** Valida todos los inputs y sanitiza los outputs. No devuelvas nunca modelos de SQLAlchemy directamente en las respuestas; serialízalos siempre a través de esquemas Pydantic (response\_model).  
* **Celery y Tareas en Segundo Plano:** Las tareas de Celery deben ser idempotentes. Implementa mecanismos de reintento (retry) para fallos transitorios (ej. timeout de la base de datos o fallo en la API del LLM).

## **3\. Estándares Frontend (React, Vite & TypeScript)**

* **TypeScript Estricto:** El código generará error si hay tipos any implícitos. Usa interfaces y types explícitos para props de componentes, estados y respuestas de API.  
* **Arquitectura de Componentes:** Separa estrictamente la capa de UI de la lógica de estado. Utiliza *Custom Hooks* para encapsular llamadas a la API y lógica de negocio compleja.  
* **Manejo del Estado de Red:** No uses useEffect puros para llamadas asíncronas de obtención de datos. Simula el uso de patrones robustos (como TanStack Query/React Query) para manejar *loading*, *error*, y *caching* de manera nativa y declarativa.  
* **Evitar Prop Drilling:** Para estados globales o profundos, utiliza el Context API de React o un gestor de estado ligero (como Zustand) si la complejidad lo amerita.

## **4\. Estándares de Infraestructura y Docker**

* **Imágenes Ligeras y Seguras:** Utiliza imágenes base oficiales mínimas (ej. python:3.11-slim, node:18-alpine).  
* **Multi-stage Builds:** En los Dockerfiles, separa la fase de construcción (instalación de dependencias, compilación) de la fase de ejecución para reducir el tamaño final de la imagen.  
* **Principio de Mínimo Privilegio:** Los contenedores en producción NUNCA deben correr como usuario root. Crea un usuario no privilegiado dentro del Dockerfile (ej. USER appuser).  
* **Gestión de Secretos:** Nunca hardcodees credenciales, URIs de bases de datos o claves de API. Todo debe inyectarse estrictamente a través de variables de entorno (.env).

## **5\. Seguridad Crítica (Módulo NL2SQL y RAG)**

* **Contención del Motor SQL (Zero-Trust):**  
  * La conexión que ejecuta el SQL generado por el LLM DEBE usar un rol/usuario de PostgreSQL con permisos estrictos de **SOLO LECTURA** (GRANT SELECT) limitado explícitamente a las tablas permitidas.  
  * Implementa una validación adicional mediante el Abstract Syntax Tree (AST) usando herramientas como sqlglot para interceptar y rechazar comandos destructivos (DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE) antes de que toquen la base de datos. Las expresiones regulares (Regex) NO son suficientes para validar seguridad.  
* **Prevención de Fugas de Metadatos:** El servicio de introspección de esquemas (Schema Introspection) debe filtrar tablas del sistema (pg\_catalog, information\_schema) y tablas de usuarios/autenticación antes de inyectar el DDL en el prompt del LLM.

