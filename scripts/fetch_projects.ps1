[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$slugs = @(
  'ultima-gota','likewise','dias-medievais-de-castro-marim','medwater','one-select-properties',
  'neomarca','mia','witfy','pro-am-vilamoura','barturs','lets-communicate','kipt','dental-hpa',
  'emjogo','albufeira-digital-nomads','travel-tech-partners','toma-la-da-ca','kubidoce',
  'rb-woodfinish','missao-conducao','adm-24','nature-soul-food','jardim-aurora',
  'dom-jose-beach-hotel','designer-outlet-algarve','ibc-security','indasa','rocamar-beach-hotel',
  'odyssea','the-originals','ria-shopping','parque-mineiro-aljustrel','fujifilm','algarseafood',
  'zion-creative-artisans','100lixo','urlegfix','cesarius','rocket-booster','pizza-lab',
  'liga-portuguesa-contra-o-cancro','aequum','hackathon','social-hackathon','refood'
)

$results = @{}

foreach ($slug in $slugs) {
  $url = "https://flowproductions.pt/portfolio/$slug/"
  try {
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
    $html = $resp.Content

    # YouTube embed URL
    $ytMatch = [regex]::Match($html, 'src="(https://www\.youtube\.com/embed/[^"?]+)')
    $videoUrl = if ($ytMatch.Success) { $ytMatch.Groups[1].Value } else { $null }

    # Client
    $clientMatch = [regex]::Match($html, 'Cliente</[^>]+>\s*<[^>]+>([^<]+)</') 
    if (-not $clientMatch.Success) {
      $clientMatch = [regex]::Match($html, 'Cliente[^>]*>[^<]*<[^>]+>([^<]+)</')
    }
    $client = if ($clientMatch.Success) { $clientMatch.Groups[1].Value.Trim() } else { $null }

    # Year
    $yearMatch = [regex]::Match($html, 'Ano</[^>]+>\s*<[^>]+>([^<]+)</')
    if (-not $yearMatch.Success) {
      $yearMatch = [regex]::Match($html, 'Ano[^>]*>[^<]*<[^>]+>([^<]+)</')
    }
    $year = if ($yearMatch.Success) { $yearMatch.Groups[1].Value.Trim() } else { $null }

    # Store raw HTML excerpt for manual review
    $results[$slug] = @{
      slug     = $slug
      videoUrl = $videoUrl
      client   = $client
      year     = $year
      status   = 'ok'
      rawSnippet = ($html -replace '(?s)<head>.*?</head>','') -replace '<[^>]+>','' -replace '\s+',' ' | 
                   Select-String -Pattern '.{0,2000}' | Select-Object -First 1 -ExpandProperty Matches | 
                   Select-Object -ExpandProperty Value
    }
    Write-Host "OK: $slug | video=$videoUrl | client=$client | year=$year"
  } catch {
    $results[$slug] = @{ slug = $slug; status = 'error'; error = $_.Exception.Message }
    Write-Host "ERR: $slug - $($_.Exception.Message)"
  }
  Start-Sleep -Milliseconds 300
}

# Output as JSON
$results | ConvertTo-Json -Depth 4 | Out-File -FilePath "scripts\project_data.json" -Encoding UTF8
Write-Host "`nDone. Results saved to scripts\project_data.json"
