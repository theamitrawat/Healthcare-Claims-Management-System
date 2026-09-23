@echo off
setlocal

set MAVEN_VERSION=3.9.11
set PROJECT_DIR=%~dp0
set MAVEN_DIR=%PROJECT_DIR%.mvn\apache-maven-%MAVEN_VERSION%
set MAVEN_CMD=%MAVEN_DIR%\bin\mvn.cmd
set MAVEN_ZIP=%PROJECT_DIR%.mvn\apache-maven-%MAVEN_VERSION%-bin.zip
set MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip

if not exist "%MAVEN_CMD%" (
  echo Maven %MAVEN_VERSION% was not found locally.
  echo Downloading Maven into .mvn folder...

  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'"
  if errorlevel 1 exit /b 1

  powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%PROJECT_DIR%.mvn' -Force"
  if errorlevel 1 exit /b 1
)

call "%MAVEN_CMD%" %*
