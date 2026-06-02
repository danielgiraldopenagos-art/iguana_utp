$port = 8080
$path = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "www"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Servidor corriendo en http://localhost:$port/"
Write-Host "phpMyAdmin: http://localhost:8081/"
Write-Host "Presiona Ctrl+C para detener."

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.php" }

    $filePath = Join-Path $path $localPath.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [IO.Path]::GetExtension($filePath)
        $mimeType = switch ($ext) {
            ".html" { "text/html" }
            ".php"  { "text/html" }
            ".css"  { "text/css" }
            ".js"   { "application/javascript" }
            ".json" { "application/json" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".png"  { "image/png" }
            ".svg"  { "image/svg+xml" }
            default { "application/octet-stream" }
        }
        $content = [IO.File]::ReadAllBytes($filePath)
        $response.ContentType = $mimeType
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $notFound = "<h1>404 Not Found</h1>"
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }

    $response.OutputStream.Close()
}

$listener.Stop()
