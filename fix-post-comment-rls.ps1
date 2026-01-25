# PowerShell script to apply RLS fix to Supabase
# Usage: powershell -ExecutionPolicy Bypass -File fix-post-comment-rls.ps1

$SUPABASE_PROJECT_ID = "ljmoqseafxhncpwzuwex"
$SUPABASE_URL = "https://$SUPABASE_PROJECT_ID.supabase.co"
$SERVICE_ROLE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SERVICE_ROLE_KEY) {
    Write-Host "❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key'" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔧 Fixing POST comment RLS policy..." -ForegroundColor Cyan
Write-Host "URL: $SUPABASE_URL/rest/v1/rpc/exec_sql" -ForegroundColor Gray

$sql = "DROP POLICY IF EXISTS `"Authenticated users can insert comments`" ON public.comments; CREATE POLICY `"Anyone can insert comments`" ON public.comments FOR INSERT WITH CHECK (true);"

$body = @{
    sql = $sql
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest `
        -Uri "$($SUPABASE_URL)/rest/v1/rpc/exec_sql" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $SERVICE_ROLE_KEY"
            "Content-Type"  = "application/json"
        } `
        -Body $body `
        -ErrorAction Continue

    Write-Host "✅ RLS policy fixed!" -ForegroundColor Green
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Try posting a comment now." -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "Make sure SUPABASE_SERVICE_ROLE_KEY is correct" -ForegroundColor Yellow
    exit 1
}
