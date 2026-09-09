# KeyForge 🗝️

A modern, cloud-native e-commerce platform built for the digital distribution of game keys. KeyForge leverages a microservices architecture to provide an end-to-end shopping experience, automated digital fulfillment, a tiered customer loyalty system ("KeyPoints"), and AI-powered review moderation.

> **Notice:** This repo shows only front end version of Keyforge. Complete and detailed documentation covering architecture diagrams (UML, ERD, sequence diagrams), API references, backend design and UI flows can be found in the **`documentation`** folder.

---

## System Architecture

KeyForge is designed as a distributed system of loosely coupled microservices isolated via Docker containers. All external client requests are routed through a central API Gateway, with identity management centralized through Keycloak.

### Architecture Highlights:
* **Central API Gateway:** Single entry point managing route dispatching and security.
* **Polyglot Persistence:** 
  * **PostgreSQL:** Handles relational and transaction-critical data (products, orders, line items).
  * **MongoDB:** Stores document-oriented, unstructured data (user profiles, reviews).
* **Identity & Access Management:** Centralized authentication via Keycloak utilizing OAuth2, OpenID Connect, and JWT.
* **External Integrations:** Stripe API for payment processing with webhook fulfillment, and Google AI models for review moderation and content synthesis.

---

## 📁 Project Structure & Microservices

```text
keyforge/
├── api-gateway/          # Spring Cloud Gateway (Port: 8090)
├── user-service/         # User profile and loyalty KeyPoints management (MongoDB)
├── product-service/      # Product catalog, stock, and pricing engine (PostgreSQL)
├── order-service/        # Order creation, calculation, and state management (PostgreSQL)
├── payment-service/      # Stripe API integration & payment webhooks
├── review-service/       # Customer ratings & reviews management (MongoDB)
├── ai-service/           # Review moderation & AI review summarization
├── frontend/             # Single Page Application (React.js, TanStack Router, Tailwind CSS)
├── documentation/        # Full technical documentation, diagrams, and API specifications
├── docker-compose.yml    # Container orchestration for services and databases
└── .env.example          # Environment variables template
```

## 🛠️ Complete Tech Stack & Infrastructure

### Backend & Core Services
* **Language & Framework:** Java 21, Spring Boot 3
* **Data Access & ORM:** Spring Data JPA, Hibernate (Code-First schema generation)
* **API Gateway & Routing:** Spring Cloud Gateway
* **Build Tool:** Gradle

### Databases & Multi-Model Storage
* **Relational Storage:** PostgreSQL 16 (Products, Orders, Order Items)
* **Document / NoSQL Storage:** MongoDB (User Profiles, Product Reviews, Rating Aggregates)
* **Identity Storage:** Dedicated PostgreSQL instance for Keycloak

### Identity, Authentication & Security
* **IAM Server:** Keycloak (Quay.io container)
* **Protocols & Standards:** OAuth2, OpenID Connect (OIDC), Stateless JWT tokens
* **Social Login:** Google OAuth2 Integration
* **Route Protection:** Role-based access control (RBAC) enforced at both API Gateway and TanStack Router levels

### Frontend & Client Application
* **Core Framework:** React.js (Single Page Application architecture)
* **Client-Side Routing:** TanStack Router (with route guards and authorization hooks)
* **Styling & Design System:** Tailwind CSS
* **Theme:** Dark mode UI tailored for gaming e-commerce

### DevOps, Networking & Containerization
* **Containerization:** Docker & Docker Engine
* **Service Orchestration:** Docker Compose (Multi-container private bridge network `keyforge-network`)
* **Container Registry:** GitHub Container Registry (GHCR)

### External Integrations & APIs
* **Payment Processing:** Stripe API (Checkout sessions, webhook event verification for order states)
* **Artificial Intelligence:** Google AI API (Automated content moderation, profanity filtering, sentiment/summary generation)

### API Contracts, Documentation & Testing
* **API Specifications:** OpenAPI 3.0 / Swagger UI (`springdoc-openapi`)
* **API Client & Manual Testing:** Insomnia (Token validation, role-permission verification, HTTP 401/403 testing)

---

## Port Mapping & Infrastructure Overview (Docker Compose)

| Container Name | Service Role | Underlying Technology / Database |
| :--- | :--- | :--- |
| `api-gateway` | Main API Entry Point | Spring Cloud Gateway |
| `keycloak` | Identity Management | Keycloak Server |
| `postgres-keycloak` | Keycloak Persistence | PostgreSQL |
| `user-service` | Profiles & KeyPoints | Spring Boot + MongoDB |
| `mongo-users` | User Data Store | MongoDB |
| `product-service` | Catalog & Inventory | Spring Boot + PostgreSQL |
| `postgres-products` | Product Data Store | PostgreSQL |
| `order-service` | Orders & Pricing State | Spring Boot + PostgreSQL |
| `postgres-orders` | Order Data Store | PostgreSQL |
| `payment-service` | Stripe & Webhooks | Spring Boot + Stripe SDK |
| `review-service` | Reviews & Ratings | Spring Boot + MongoDB |
| `mongo-review` | Reviews Data Store | MongoDB |
| `ai-service` | AI Moderation & Summary | Spring Boot + Google AI |
| `frontend` | Web User Interface | React.js + Vite |

---

## Key Business Logic

* **Loyalty Progression Tiers:**
  * Nowicjusz Kowal (0 pts – 0% discount)
  * Uczeń Kuźni (1,000 pts – 3% discount)
  * Czeladnik Kuźni (2,500 pts – 6% discount)
  * Mistrz Kuźni (5,000 pts – 9% discount)
  * Legendarny Kowal (10,000 pts – 12% discount)
  * Wielki Mistrz Kluczy (20,000 pts – 15% discount)
* **Order State Machine:**
  * `READY_FOR_PAYMENT` ➔ `PAID` ➔ `COMPLETED` (Keys revealed, points awarded, refunds locked)
  * `READY_FOR_PAYMENT` ➔ `PAYMENT_FAILED` ➔ `CANCELLED` (Inventory unlocked)
