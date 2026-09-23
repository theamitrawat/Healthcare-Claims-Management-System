# Healthcare Claims Management System

A RESTful backend application for managing patient records and healthcare insurance claims. The system provides structured APIs for patient registration, claim submission, claim review, and claim status updates.

## Overview

Healthcare Claims Management System helps organize core claim-processing workflows:

- Manage patient information
- Register healthcare claims against patients
- Track claim status
- Approve or reject submitted claims
- Persist patient and claim data in MySQL

The application follows a clean layered architecture with separate controller, service, repository, and persistence layers.

## Tech Stack

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Validation
- MySQL
- Maven
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

## Architecture

```text
Client
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
MySQL Database
```

The controller layer exposes REST endpoints, the service layer handles business logic, the repository layer performs database operations, and MySQL stores application data.

## Project Structure

```text
src/main/java/com/example/healthcareclaims
  HealthcareClaimsManagementApplication.java
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
  application.properties          (default profile, uses H2)
  application-mysql.properties    (mysql profile, uses MySQL)

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
```

## Prerequisites

- Java 17
- Maven
- MySQL Server
- API client such as Postman

Check Java:

```bash
java -version
```

Check Maven:

```bash
mvn -version
```

## Database Setup

By default, the application runs with a local embedded H2 database stored in the `data/` folder. This lets the API start without requiring database credentials.

To run with MySQL, create the MySQL database:

```sql
CREATE DATABASE healthcare_claims_db;
```

Then update database credentials in:

```text
.env
```

Create your local environment file from the example:

```bash
cp .env.example .env
```

Then update `.env`:

```properties
DB_URL=jdbc:mysql://localhost:3306/healthcare_claims_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

Run the backend with the MySQL profile:

```bat
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

Database tables are managed by Spring Data JPA using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

If MySQL startup fails with `Access denied for user 'root'@'localhost'`, update `DB_USERNAME` and `DB_PASSWORD` in `.env` with the same MySQL credentials you use to log in locally.

## Running The Application

From the project root folder, run:

```bash
mvn spring-boot:run
```

The API starts at:

```text
http://localhost:8080
```

On Windows, if `mvn` is not installed globally, use the included project runner:

```bat
mvnw.cmd spring-boot:run
```

In another terminal, start the React UI:

```bash
cd frontend
npm install
npm run dev
```

The UI starts at:

```text
http://localhost:5173
```

If the backend API runs on a different URL, create `frontend/.env` from `frontend/.env.example` and update `VITE_API_BASE_URL`.

## Deployment

### Backend (Spring Boot)

The backend is a Java Spring Boot application. It must be deployed on a platform that supports Java, such as:

- [Railway](https://railway.app) — simple, free tier available
- [Render](https://render.com) — supports Java, free tier available
- [Heroku](https://heroku.com) — supports Java

Vercel does NOT run Java backends. Do not try to deploy the Spring Boot backend to Vercel.

### Frontend (React)

The React frontend is a plain static site built with Vite. It can be deployed to:

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)

Before deploying the frontend, set the environment variable `VITE_API_BASE_URL` to the public URL of your deployed backend. For example:

```text
VITE_API_BASE_URL=https://your-backend-url.railway.app
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

- Patient not found
- Claim not found
- Invalid request data

## Testing

Run automated tests:

```bash
mvn test
```

Recommended manual API test flow:

1. `POST /patients`
2. `GET /patients`
3. `GET /patients/1`
4. `POST /claims`
5. `GET /claims`
6. `PUT /claims/1/approve`
7. `PUT /claims/1/reject`
8. `DELETE /claims/1`
