@echo off
REM Windows batch script to fix POST comment RLS policy
REM Usage: fix-post-comment-rls.bat

setlocal enabledelayedexpansion

set SUPABASE_PROJECT_ID=ljmoqseafxhncpwzuwex
set SUPABASE_URL=https://%SUPABASE_PROJECT_ID%.supabase.co
set SERVICE_ROLE_KEY=%SUPABASE_SERVICE_ROLE_KEY%

if "%SERVICE_ROLE_KEY%"=="" (
    echo Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set
    echo Set it first: set SUPABASE_SERVICE_ROLE_KEY=your-key-here
    exit /b 1
)

echo Fixing POST comment RLS policy...
echo URL: %SUPABASE_URL%/rest/v1/rpc/exec_sql

REM Execute SQL via curl with proper headers
curl -X POST "%SUPABASE_URL%/rest/v1/rpc/exec_sql" ^
  -H "apikey: %SERVICE_ROLE_KEY%" ^
  -H "Authorization: Bearer %SERVICE_ROLE_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"sql\": \"DROP POLICY IF EXISTS 'Authenticated users can insert comments' ON public.comments; CREATE POLICY 'Anyone can insert comments' ON public.comments FOR INSERT WITH CHECK (true);\"}"

echo.
echo RLS policy fix complete! Try posting a comment now.
