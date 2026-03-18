# Homologacao operacional RDO Mensal V2 (OPSCOPE)
# Uso basico:
#   powershell -ExecutionPolicy Bypass -File .\homologacao-rdo-mensal-v2.ps1 `
#     -BaseUrl "https://staging.opscope.local" `
#     -ProjectId "PROJECT_ID" `
#     -Cookie "opscope.sid=SEU_COOKIE" `
#     -ScenariosFile ".\rdo-mensal-v2-scenarios.json"
#
# Alternativa com token:
#   -BearerToken "SEU_TOKEN"
#
# Se nao houver ScenariosFile, use -Start e -End para um unico cenario.

[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)]
  [string]$BaseUrl,

  [Parameter(Mandatory=$true)]
  [string]$ProjectId,

  [string]$Start,
  [string]$End,

  [ValidateSet("recalculated","provided")]
  [string]$ComparisonMode = "recalculated",

  [string]$Cookie,
  [string]$BearerToken,

  [string]$OutputDir = "rdo-mensal-v2-homologacao",
  [string]$ScenariosFile
)

Set-StrictMode -Version Latest

function New-DirIfMissing([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) {
    New-Item -ItemType Directory -Path $path | Out-Null
  }
}

function Write-JsonFile([string]$path, $data) {
  $json = $data | ConvertTo-Json -Depth 8
  Set-Content -Path $path -Value $json -Encoding UTF8
}

function Invoke-ApiJson([string]$Method, [string]$Url, $Body, $Headers) {
  $payload = $Body | ConvertTo-Json -Depth 6
  return Invoke-RestMethod -Method $Method -Uri $Url -Headers $Headers -Body $payload -ContentType "application/json"
}

function Invoke-ApiPdf([string]$Url, $Body, $Headers, [string]$OutFile) {
  $payload = $Body | ConvertTo-Json -Depth 6
  Invoke-WebRequest -Method POST -Uri $Url -Headers $Headers -Body $payload -ContentType "application/json" -OutFile $OutFile | Out-Null
}

function Get-PdfPageCount([string]$filePath) {
  if (-not (Test-Path -LiteralPath $filePath)) {
    return 0
  }
  try {
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $text = [System.Text.Encoding]::ASCII.GetString($bytes)
    $pageMatches = [regex]::Matches($text, "/Type\s*/Page\b").Count
    $pagesMatches = [regex]::Matches($text, "/Type\s*/Pages\b").Count
    $count = $pageMatches - $pagesMatches
    if ($count -lt 0) { return 0 }
    return $count
  } catch {
    return 0
  }
}

function Build-Headers {
  $headers = @{}
  if ($BearerToken) {
    $headers["Authorization"] = "Bearer $BearerToken"
  }
  if ($Cookie) {
    $headers["Cookie"] = $Cookie
  }
  return $headers
}

if (-not $BearerToken -and -not $Cookie) {
  throw "Informe -BearerToken ou -Cookie para autenticacao."
}

New-DirIfMissing $OutputDir

$headers = Build-Headers

$scenarios = @()
if ($ScenariosFile -and (Test-Path -LiteralPath $ScenariosFile)) {
  $scenarios = Get-Content -Path $ScenariosFile -Raw | ConvertFrom-Json
} else {
  if (-not $Start -or -not $End) {
    throw "Informe -Start e -End ou forneca -ScenariosFile."
  }
  $scenarios = @(@{
    id = "custom"
    label = "Cenario custom"
    start = $Start
    end = $End
  })
}

$summaryList = @()

foreach ($scenario in $scenarios) {
  $scenarioId = $scenario.id
  if (-not $scenarioId) {
    $scenarioId = ($scenario.label -replace "[^a-zA-Z0-9\-]", "_").ToLower()
  }
  $scenarioDir = Join-Path $OutputDir $scenarioId
  New-DirIfMissing $scenarioDir

  $payload = @{
    projectId = $ProjectId
    start = $scenario.start
    end = $scenario.end
    comparisonMode = $ComparisonMode
  }

  $htmlUrl = "$BaseUrl/api/rdo/monthly/v2/html"
  $pdfUrl = "$BaseUrl/api/rdo/monthly/v2/pdf"

  $htmlFile = Join-Path $scenarioDir "$scenarioId.html"
  $pdfFile = Join-Path $scenarioDir "$scenarioId.pdf"
  $logsFile = Join-Path $scenarioDir "$scenarioId.logs.json"
  $metaFile = Join-Path $scenarioDir "$scenarioId.summary.json"

  Write-Host "==> [$scenarioId] HTML"
  $htmlStart = Get-Date
  $htmlResponse = Invoke-ApiJson -Method POST -Url $htmlUrl -Body $payload -Headers $headers
  $htmlDuration = (Get-Date) - $htmlStart
  Set-Content -Path $htmlFile -Value $htmlResponse.html -Encoding UTF8

  Write-Host "==> [$scenarioId] PDF"
  $pdfStart = Get-Date
  $pdfError = $null
  try {
    Invoke-ApiPdf -Url $pdfUrl -Body $payload -Headers $headers -OutFile $pdfFile
  } catch {
    $pdfError = $_.Exception.Message
  }
  $pdfDuration = (Get-Date) - $pdfStart

  $fromIso = ($htmlStart.AddSeconds(-5)).ToString("o")
  $toIso = (Get-Date).ToString("o")
  $logsUrl = "$BaseUrl/api/admin/logs?endpoint=/api/rdo/monthly/v2&from=$fromIso&to=$toIso&limit=200"
  Write-Host "==> [$scenarioId] LOGS"
  $logsResponse = Invoke-RestMethod -Method GET -Uri $logsUrl -Headers $headers
  Write-JsonFile -path $logsFile -data $logsResponse

  $pageCount = Get-PdfPageCount $pdfFile
  $integrityStatus = $htmlResponse.integrityStatus
  $summary = @{
    scenario = $scenarioId
    label = $scenario.label
    start = $scenario.start
    end = $scenario.end
    integrityStatus = $integrityStatus
    htmlMs = [int]$htmlDuration.TotalMilliseconds
    pdfMs = [int]$pdfDuration.TotalMilliseconds
    pdfPages = $pageCount
    htmlFile = $htmlFile
    pdfFile = $pdfFile
    logsFile = $logsFile
    pdfError = $pdfError
    issues = $htmlResponse.issues
  }
  Write-JsonFile -path $metaFile -data $summary
  $summaryList += $summary
}

$summaryFile = Join-Path $OutputDir "homologacao-resumo.json"
Write-JsonFile -path $summaryFile -data $summaryList
Write-Host "Concluido. Resumo: $summaryFile"
