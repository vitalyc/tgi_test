@echo off
setlocal

:: Check if a parameter was passed
if "%~1"=="" (
    echo Arguments Error: %~nx0 number
    exit /b -2
)

set num=%~1

:: Check if the parameter is a valid number using arithmetic
set /a check=%num% >nul 2>nul
if errorlevel 1 (
    echo Invalid argument. Must be number: %num%
    exit /b -1
)

:: Perform the comparison
if %num% LSS 10 (
    echo %num% is less than 10
    exit /b 0
) else (
    echo %num% is not less than 10
    exit /b %num%
)
