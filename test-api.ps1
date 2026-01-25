$body = @{
    chapterId = '38e538d6-e0a8-486d-934c-080d46a43528'
    nickname = 'test'
    content = 'test comment'
} | ConvertTo-Json

Write-Host "Testing POST /api/comments..."
$response = Invoke-WebRequest -Uri 'http://localhost:3000/api/comments' `
  -Method POST `
  -Headers @{'Content-Type'='application/json'} `
  -Body $body `
  -ErrorAction Continue

Write-Host "Status: $($response.StatusCode)"
Write-Host "Body: $($response.Content)"
