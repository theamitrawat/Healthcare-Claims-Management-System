# ---- Stage 1: Build the application ----
# Use a Maven image to compile and package the Spring Boot app
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven project file first
# Docker caches this layer, so dependencies are only re-downloaded when pom.xml changes
COPY pom.xml .

# Download all dependencies (cached unless pom.xml changes)
RUN mvn dependency:go-offline -q

# Copy the rest of the source code
COPY src ./src

# Build the application, skipping tests (tests already pass locally)
RUN mvn package -DskipTests -q

# ---- Stage 2: Run the application ----
# Use a smaller image that only has Java runtime (no Maven needed)
FROM eclipse-temurin:17-jre

# Set the working directory inside the container
WORKDIR /app

# Copy only the built JAR from the build stage
COPY --from=build /app/target/healthcare-claims-management-system-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 (the default Spring Boot port)
EXPOSE 8080

# Start the application using the mysql profile
# Render will provide DB_URL, DB_USERNAME, DB_PASSWORD as environment variables
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=mysql", "app.jar"]
