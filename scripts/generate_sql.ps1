[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

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

function Strip-HTML($text) {
  $t = $text -replace '<[^>]+>', ' '
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  $t = $t -replace '\s+', ' '
  return $t.Trim()
}

function Escape-SQL($text) {
  if (-not $text) { return '' }
  return $text -replace "'", "''"
}

function Get-ProjectData($slug) {
  $url = "https://flowproductions.pt/portfolio/$slug/"
  $tmp = [System.IO.Path]::GetTempFileName() + ".html"
  
  & curl.exe --compressed -s -L -o $tmp --max-time 25 $url 2>$null
  
  if (-not (Test-Path $tmp)) { return $null }
  
  $html = [System.IO.File]::ReadAllText($tmp, [System.Text.Encoding]::UTF8)
  Remove-Item $tmp -ErrorAction SilentlyContinue
  
  if ($html.Length -lt 5000) { return @{ status='404' } }
  
  # --- YouTube ID ---
  $ytMatch = [regex]::Match($html, 'youtube\.com/embed/([A-Za-z0-9_-]{11})')
  $videoId = if ($ytMatch.Success) { $ytMatch.Groups[1].Value } else { $null }
  
  # --- Client ---
  $clientMatch = [regex]::Match($html, 'item_title">Cliente</span><span[^>]*>([^<]+)</span>')
  $client = if ($clientMatch.Success) { Strip-HTML $clientMatch.Groups[1].Value } else { $null }
  
  # --- Year ---
  $yearMatch = [regex]::Match($html, 'item_title">Ano</span><span[^>]*>([^<]+)</span>')
  $year = if ($yearMatch.Success) { Strip-HTML $yearMatch.Groups[1].Value } else { $null }
  
  # --- Content: everything between the first real paragraph and </section><!-- .entry-content --> ---
  $entryEnd = $html.IndexOf('</section><!-- .entry-content -->')
  if ($entryEnd -lt 0) { $entryEnd = $html.IndexOf('</article>') }
  
  $contentArea = if ($entryEnd -gt 0) { $html.Substring(0, $entryEnd) } else { $html }
  
  # Find all <p> and <h2>/<h3> blocks
  $blocks = [regex]::Matches($contentArea, '<(h[2-4]|p)[^>]*>([\s\S]*?)</(h[2-4]|p)>', 'IgnoreCase')
  $parts = @()
  foreach ($b in $blocks) {
    $text = Strip-HTML $b.Groups[2].Value
    if ($text.Length -gt 15 -and 
        $text -notmatch 'nemo enim|lorem ipsum|©|All Rights Reserved|Edif.cio Ualg|info@flow|910 814|flowproductions.pt' -and
        $text -notmatch '^\d{4}$' -and
        $text -notmatch '^(Home|Blog|Contacts|Sobre|Servi)') {
      $parts += $text
    }
  }
  
  $content = if ($parts.Count -gt 0) { $parts -join ' ' } else { $null }
  $summary = if ($parts.Count -gt 0) { $parts[0] } else { $null }
  
  return @{
    status  = 'ok'
    videoId = $videoId
    client  = $client
    year    = $year
    content = $content
    summary = $summary
  }
}

# Build SQL
$sqlLines = @()
$sqlLines += "-- Auto-generated from flowproductions.pt/portfolio/"
$sqlLines += "-- Run in Supabase SQL Editor"
$sqlLines += ""

foreach ($slug in $slugs) {
  Write-Host "Processing: $slug ..."
  $data = Get-ProjectData $slug
  
  if (-not $data -or $data.status -eq '404') {
    Write-Host "  -> 404/skip"
    $sqlLines += "-- SKIP (404): $slug"
    continue
  }
  
  $videoId = $data.videoId
  $client  = $data.client
  $year    = $data.year
  $content = $data.content
  $summary = $data.summary
  
  # Fix known client issue - missao-conducao's WordPress has wrong client field
  if ($slug -eq 'missao-conducao' -and $client -eq 'Algarve Design Meeting') {
    $client = 'Missão Condução'
  }
  
  Write-Host "  -> yt=$videoId | client=$client | year=$year | content=$(if($content){$content.Substring(0,[Math]::Min(60,$content.Length))} else {'(none)'})"
  
  $esc_content = Escape-SQL $content
  $esc_summary = Escape-SQL $summary
  $esc_client  = Escape-SQL $client
  $esc_year    = Escape-SQL $year
  
  $sql = "UPDATE projects SET"
  
  if ($summary) {
    $sql += "`n  summary = jsonb_build_object('pt','$esc_summary','en','$esc_summary','fr','$esc_summary'),"
  }
  if ($content) {
    $sql += "`n  content = jsonb_build_object('pt','$esc_content','en','$esc_content','fr','$esc_content'),"
  }
  if ($client) {
    $sql += "`n  client_name = '$esc_client',"
  }
  if ($year) {
    $sql += "`n  year_label = to_jsonb('$esc_year'::text),"
  }
  if ($videoId) {
    $sql += "`n  gallery = jsonb_build_object('video_url','https://youtu.be/$videoId'),"
  }
  
  # Remove trailing comma from last SET item
  $sql = $sql -replace ',$', ''
  $sql += "`nWHERE slug->>'pt' = '$slug';"
  $sql += "`n"
  
  $sqlLines += $sql
}

$sqlOutput = $sqlLines -join "`n"
[System.IO.File]::WriteAllText("supabase\seed_from_live.sql", $sqlOutput, [System.Text.Encoding]::UTF8)
Write-Host "`nSQL saved to supabase\seed_from_live.sql"
