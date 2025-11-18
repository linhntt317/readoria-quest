@echo off
echo Clearing Next.js cache...

if exist .next (
    rmdir /s /q .next
    echo .next folder deleted
) else (
    echo .next folder not found
)

if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo node_modules cache deleted
)

echo.
echo Cache cleared! Now run: npm run dev
pause
