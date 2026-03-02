[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

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

# Known video IDs from previous run
$videoIds = @{
  'ultima-gota'                    = 'Mt-9bDmBWSs'
  'likewise'                       = 'SDvStpNqPj0'
  'dias-medievais-de-castro-marim' = 'l0UanW6to3g'
  'one-select-properties'          = 'rT2SFmrrw7M'
  'mia'                            = 'owMpfJw_ZpA'
  'pro-am-vilamoura'               = '_eP8rm0hJyY'
  'barturs'                        = 'VO1hzdaoCko'
  'lets-communicate'               = '8E_JVIPPbTo'
  'kipt'                           = 'XED6X-89kUs'
  'emjogo'                         = 'yGjXcnerzm4'
  'travel-tech-partners'           = '7vSNeYAN-dE'
  'toma-la-da-ca'                  = 'HdHOsaQ6SoE'
  'designer-outlet-algarve'        = 'BfTxZDY4TGk'
  'ibc-security'                   = 'z7n4p7au7Yc'
  'indasa'                         = 'ToAr4Gbu2gk'
  'rocamar-beach-hotel'            = 'TX5assyouVs'
  'odyssea'                        = 'oAiOIBIs3pw'
  'the-originals'                  = '5673i4LDkKE'
  'ria-shopping'                   = '0gBMaWBaCwk'
  'parque-mineiro-aljustrel'       = 'gTg8LeCRj0w'
  'fujifilm'                       = 'NWEPCClqDrw'
  'algarseafood'                   = 'CVUtLS4WXW0'
  'aequum'                         = 'c2Xn8B8Dhf4'
  'hackathon'                      = '86FgEIoor4I'
  'refood'                         = 'PWIBs-amki4'
}

function Escape-SQL($text) {
  return $text -replace "'", "''"
}

function Strip-HTML($text) {
  $t = $text -replace '<strong>', '' -replace '</strong>', '' -replace '<em>', '' -replace '</em>', ''
  $t = $t -replace '<br\s*/?>', ' '
  $t = $t -replace '<[^>]+>', ''
  $t = $t -replace '&amp;', '&' -replace '&nbsp;', ' ' -replace '&lt;', '<' -replace '&gt;', '>'
  $t = $t -replace '&#8211;', '-' -replace '&#8220;', '"' -replace '&#8221;', '"'
  $t = $t -replace '&#038;', '&' -replace '&laquo;', '«' -replace '&raquo;', '»'
  $t = $t -replace '\s+', ' '
  return $t.Trim()
}

$results = @{}

foreach ($slug in $slugs) {
  $url = "https://flowproductions.pt/portfolio/$slug/"
  Write-Host "Fetching: $slug ..."
  
  $tempFile = [System.IO.Path]::GetTempFileName()
  & curl.exe -s -L -o $tempFile --max-time 20 $url 2>$null
  
  if (-not (Test-Path $tempFile)) {
    Write-Host "  -> ERR (no file)"
    $results[$slug] = @{ status='error'; content=$null }
    continue
  }
  
  $bytes = [System.IO.File]::ReadAllBytes($tempFile)
  $html = [System.Text.Encoding]::UTF8.GetString($bytes)
  Remove-Item $tempFile -ErrorAction SilentlyContinue
  
  # Extract portfolio_page_description content
  $descMatch = [regex]::Match($html, '<div class="portfolio_page_description">([\s\S]*?)</div>\s*</section>', 'IgnoreCase')
  $content = $null
  $summary = $null
  
  if ($descMatch.Success) {
    $inner = $descMatch.Groups[1].Value
    $paras = [regex]::Matches($inner, '<p[^>]*>([\s\S]*?)</p>', 'IgnoreCase')
    $parts = @()
    foreach ($p in $paras) {
      $text = Strip-HTML $p.Groups[1].Value
      # Skip lorem ipsum placeholder
      if ($text.Length -gt 10 -and $text -notmatch 'nemo enim|lorem ipsum') {
        $parts += $text
      }
    }
    # Also get headings
    $headings = [regex]::Matches($inner, '<h[2-4][^>]*>([\s\S]*?)</h[2-4]>', 'IgnoreCase')
    foreach ($h in $headings) {
      $text = Strip-HTML $h.Groups[1].Value
      if ($text.Length -gt 3) {
        # Insert heading before its paragraphs (simplified: prepend to start)
        $parts = @($text) + $parts
      }
    }
    if ($parts.Count -gt 0) {
      $summary = $parts[0]
      $content = $parts -join ' '
    }
  }
  
  $videoId = if ($videoIds.ContainsKey($slug)) { $videoIds[$slug] } else { $null }
  
  Write-Host "  -> content=$(if($content){$content.Substring(0,[Math]::Min(80,$content.Length))} else {'(none)'})"
  $results[$slug] = @{ status='ok'; content=$content; summary=$summary; videoId=$videoId }
}

# Save JSON
$results | ConvertTo-Json -Depth 3 | Out-File "scripts\content_data.json" -Encoding UTF8
Write-Host "`nSaved to scripts\content_data.json"
