# Healthcare Claims Management System

A full-stack web application for managing patient records and healthcare insurance claims. The Spring Boot backend provides a REST API and the React frontend provides a browser-based UI to interact with it.

## Live Demo

| Service | URL |
| --- | --- |
| Backend API | https://healthcare-claims-management-system.onrender.com |
| Frontend UI | https://healthcare-claims-management-system-ui.onrender.com |

## Overview

- Manage patient information
- Register healthcare claims against patients
- Track claim status
- Approve or reject submitted claims
- Data is stored in a cloud MySQL database (Aiven)

The application follows a clean layered architecture:

```text
Client (React)
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
MySQL Database (Aiven)
```

## Tech Stack

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Validation
- MySQL (Aiven cloud database)
- Maven
- Docker
- React
- Vite
- JUnit
- Mockito

## Features

### Patient Management

- Create patient records
- Retrieve all patients
- Retrieve a patient by ID
- Update patient details
- Delete patient records

Patient fields:

```text
id, name, age, gender, email
```

### Claim Management

- Create claims for registered patients
- Retrieve all claims
- Retrieve a claim by ID
- Update claim details
- Delete claims
- Approve claims
- Reject claims

Claim fields:

```text
id, patientId, description, amount, status
```

Supported claim statuses:

```text
PENDING, APPROVED, REJECTED
```

## Project Structure

```text
src/main/java/com/example/healthcareclaims
  HealthcareClaimsManagementApplication.java
  config/
    WebConfig.java              (global CORS configuration)
  controller/
    PatientController.java
    ClaimController.java
  service/
    PatientService.java
    ClaimService.java
  repository/
    PatientRepository.java
    ClaimRepository.java
  entity/
    Patient.java
    Claim.java
    ClaimStatus.java

src/main/resources
  application.properties          (default profile, uses H2 for local dev)
  application-mysql.properties    (mysql profile, used in production)

src/test/java
  service/
    PatientServiceTest.java

frontend/
  src/
    main.jsx
    styles.css
  index.html
  vite.config.js
  package.json

Dockerfile
.env.example
```

## Prerequisites

To run locally you need:

- Java 17
- Maven

Check Java:

```bash
java -version
```

Check Maven:

```bash
mvn -version
```

## Running Locally

### Option 1 — H2 embedded database (no setup needed)

This is the easiest way to run the project locally. No database credentials required.

```bat
mvnw.cmd spring-boot:run
```

The API starts at:

```
http://localhost:8080
```

### Option 2 — Aiven cloud MySQL (same database as production)

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Fill in your Aiven credentials in `.env`:

```properties
DB_URL=jdbc:mysql://<your-aiven-host>:<port>/defaultdb?sslMode=REQUIRED
DB_USERNAME=your_aiven_username
DB_PASSWORD=your_aiven_password
```

Then run with the mysql profile:

```bat
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

### Start the React frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The UI starts at:

```
http://localhost:5173
```

If your backend is running on a different URL, create `frontend/.env` and set:

```
VITE_API_BASE_URL=http://localhost:8080
```

## Environment Variables

The backend reads these three variables when running with the `mysql` profile:

| Variable | Description | Example |
| --- | --- | --- |
| `DB_URL` | JDBC connection string for MySQL | `jdbc:mysql://host:port/defaultdb?sslMode=REQUIRED` |
| `DB_USERNAME` | MySQL username | `avnadmin` |
| `DB_PASSWORD` | MySQL password | `your_password` |

Locally these are read from the `.env` file in the project root.
In production these are set as environment variables in the Render dashboard.

The `.env` file is gitignored and must never be committed. Use `.env.example` as a reference.

## Deployment

### Backend on Render

The backend is deployed on [Render](https://render.com) as a Docker web service.

#### How to deploy

1. Push this project to a GitHub repository.
2. Go to [render.com](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Render detects the `Dockerfile` automatically.
5. Set these environment variables in the Render dashboard under **Environment**:

```text
DB_URL        = jdbc:mysql://<aiven-host>:<port>/defaultdb?sslMode=REQUIRED
DB_USERNAME   = your_aiven_username
DB_PASSWORD   = your_aiven_password
```

6. Click **Save Changes**. Render rebuilds and redeploys automatically.

#### How the Dockerfile works

The `Dockerfile` uses a two-stage build:

- **Stage 1:** Maven + JDK image compiles the code and produces a JAR file.
- **Stage 2:** A smaller JRE-only image runs the JAR.

The app starts with `-Dspring.profiles.active=mysql` so it reads credentials from environment variables instead of the `.env` file.

### Frontend on Render

The React frontend is deployed on Render as a static site.

#### How to deploy

1. Go to [render.com](https://render.com) and create a new **Static Site**.
2. Connect the same GitHub repository.
3. Set **Build Command** to:

```bash
cd frontend && npm install && npm run build
```

4. Set **Publish Directory** to:

```
frontend/dist
```

5. Set this environment variable in the Render dashboard:

```text
VITE_API_BASE_URL = https://healthcare-claims-management-system.onrender.com
```

6. Click **Save Changes**.

### Database on Aiven

The production database is a free MySQL instance on [Aiven](https://aiven.io).

1. Sign up at [console.aiven.io](https://console.aiven.io).
2. Create a new **MySQL** service (free tier).
3. Copy the connection details from the Aiven dashboard.
4. Set them as environment variables in your Render backend service.

Tables are created automatically by Spring Data JPA on first startup using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

## API Endpoints

### Patients

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/patients` | Create a patient |
| GET | `/patients` | Get all patients |
| GET | `/patients/{id}` | Get patient by ID |
| PUT | `/patients/{id}` | Update patient |
| DELETE | `/patients/{id}` | Delete patient |

### Claims

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/claims` | Create a claim |
| GET | `/claims` | Get all claims |
| GET | `/claims/{id}` | Get claim by ID |
| PUT | `/claims/{id}` | Update claim |
| DELETE | `/claims/{id}` | Delete claim |
| PUT | `/claims/{id}/approve` | Approve claim |
| PUT | `/claims/{id}/reject` | Reject claim |

## Example Requests

### Create Patient

```http
POST /patients
Content-Type: application/json
```

```json
{
  "name": "Amit Rawat",
  "age": 30,
  "gender": "Male",
  "email": "amit@example.com"
}
```

### Create Claim

```http
POST /claims
Content-Type: application/json
```

```json
{
  "patientId": 1,
  "description": "Blood test and consultation",
  "amount": 1200.50
}
```

### Approve Claim

```http
PUT /claims/1/approve
```

### Reject Claim

```http
PUT /claims/1/reject
```

## Example Responses

Patient response:

```json
{
  "id": 1,
  "name": "Amit Rawat",
  "age": 30,
  "gender": "Male",
  "email": "amit@example.com"
}
```

Claim response:

```json
{
  "id": 1,
  "patientId": 1,
  "patient": {
    "id": 1,
    "name": "Amit Rawat",
    "age": 30,
    "gender": "Male",
    "email": "amit@example.com"
  },
  "description": "Blood test and consultation",
  "amount": 1200.5,
  "status": "PENDING"
}
```

## Validation And Error Handling

The API validates incoming request data:

- Patient name is required
- Patient email must be valid
- Patient age cannot be negative
- Claim patient ID is required
- Claim description is required
- Claim amount must be greater than zero

The API returns errors for common failure cases:

- `404 Not Found` — patient or claim does not exist
- `400 Bad Request` — invalid input data

## Testing

Run automated tests:

```bash
mvn test
```

Recommended manual API test flow using Postman or the live frontend:

1. `POST /patients` — create a patient
2. `GET /patients` — confirm patient appears
3. `POST /claims` — create a claim for that patient
4. `GET /claims` — confirm claim appears with status PENDING
5. `PUT /claims/1/approve` — approve the claim
6. `GET /claims/1` — confirm status is now APPROVED
7. `DELETE /claims/1` — delete the claim
8. `DELETE /patients/1` — delete the patient
