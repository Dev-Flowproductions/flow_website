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

function Extract-YouTubeId($html) {
  $m = [regex]::Match($html, 'youtube\.com/embed/([A-Za-z0-9_-]{11})')
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Strip-HTML($text) {
  $t = $text -replace '<script[^>]*>[\s\S]*?</script>', ''
  $t = $t -replace '<style[^>]*>[\s\S]*?</style>', ''
  $t = $t -replace '<[^>]+>', ' '
  $t = $t -replace '&amp;', '&'
  $t = $t -replace '&nbsp;', ' '
  $t = $t -replace '&lt;', '<'
  $t = $t -replace '&gt;', '>'
  $t = $t -replace '&#8211;', '–'
  $t = $t -replace '&#8220;', '"'
  $t = $t -replace '&#8221;', '"'
  $t = $t -replace '\s+', ' '
  return $t.Trim()
}

function Extract-PostContent($html) {
  # Try to get the main entry content
  $m = [regex]::Match($html, '<div[^>]+class="[^"]*entry.content[^"]*"[^>]*>([\s\S]*?)</div>\s*</div>\s*</article>', 'IgnoreCase')
  if (-not $m.Success) {
    $m = [regex]::Match($html, '<div[^>]+class="[^"]*entry.content[^"]*"[^>]*>([\s\S]*?)</div>\s*</article>', 'IgnoreCase')
  }
  if (-not $m.Success) {
    $m = [regex]::Match($html, 'class="wp-block-group__inner-container">([\s\S]{100,3000}?)</div>', 'IgnoreCase')
  }
  if ($m.Success) {
    $inner = $m.Groups[1].Value
    # Extract paragraphs and headings
    $blocks = [regex]::Matches($inner, '<(p|h[2-4])[^>]*>([\s\S]*?)</(p|h[2-4])>', 'IgnoreCase')
    $parts = @()
    foreach ($b in $blocks) {
      $text = Strip-HTML $b.Groups[2].Value
      if ($text.Length -gt 10 -and $text -notmatch 'nemo enim|lorem ipsum') {
        $parts += $text
      }
    }
    if ($parts.Count -gt 0) { return $parts -join ' ' }
  }
  return $null
}

function Extract-Client($html) {
  # Pattern: label "Cliente" followed by value
  $m = [regex]::Match($html, 'Cliente[^<]*</[^>]+>\s*<[^>]+>([^<]{2,60})</','IgnoreCase')
  if ($m.Success) { return $m.Groups[1].Value.Trim() }
  # Alternate pattern
  $m = [regex]::Match($html, '<[^>]+label[^>]*>[^<]*Cliente[^<]*</[^>]+>\s*<[^>]+>([^<]{2,60})</', 'IgnoreCase')
  if ($m.Success) { return $m.Groups[1].Value.Trim() }
  return $null
}

function Extract-Year($html) {
  $m = [regex]::Match($html, 'Ano[^<]*</[^>]+>\s*<[^>]+>([^<]{3,30})</','IgnoreCase')
  if ($m.Success) { return $m.Groups[1].Value.Trim() }
  return $null
}

$output = @()

foreach ($slug in $slugs) {
  $url = "https://flowproductions.pt/portfolio/$slug/"
  Write-Host "Fetching: $slug ..."
  
  $tempFile = [System.IO.Path]::GetTempFileName()
  $exitCode = & curl.exe -s -L -o $tempFile --max-time 20 $url
  $status = $LASTEXITCODE
  
  if ($status -ne 0 -or -not (Test-Path $tempFile)) {
    Write-Host "  -> ERR (curl exit $status)"
    $output += [PSCustomObject]@{ slug=$slug; status='error'; videoId=$null; client=$null; year=$null; content=$null }
    continue
  }
  
  $html = Get-Content $tempFile -Raw -Encoding UTF8
  Remove-Item $tempFile -ErrorAction SilentlyContinue
  
  if ($html -match '404|Not Found' -and $html.Length -lt 5000) {
    Write-Host "  -> 404"
    $output += [PSCustomObject]@{ slug=$slug; status='404'; videoId=$null; client=$null; year=$null; content=$null }
    continue
  }
  
  $ytId     = Extract-YouTubeId $html
  $client   = Extract-Client $html
  $year     = Extract-Year $html
  $content  = Extract-PostContent $html
  
  Write-Host "  -> OK | yt=$ytId | client=$client | year=$year | content=$(if($content){$content.Substring(0,[Math]::Min(60,$content.Length))})"
  
  $output += [PSCustomObject]@{
    slug    = $slug
    status  = 'ok'
    videoId = $ytId
    client  = $client
    year    = $year
    content = $content
  }
}

$output | ConvertTo-Json -Depth 3 | Out-File "scripts\project_data.json" -Encoding UTF8
Write-Host "`nSaved to scripts\project_data.json"
