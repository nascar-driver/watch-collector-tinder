# Normalize watch PNGs to a uniform subject size.
#
# For each image: find the tight alpha bounding box, then re-center the subject
# (copied 1:1, no scaling -> no quality loss) onto a square canvas sized so the
# subject fills TARGET_H of the height. 0.89 matches the Daytona Panda, which
# reads perfectly in the card. Every output is then a square with an identical
# subject-fill ratio, so object-contain renders them all the same apparent size.
#
# Originals in /public/watches are untouched; output lands in /public/watches-normalized.

Add-Type -AssemblyName System.Drawing

$root    = Split-Path -Parent $PSScriptRoot
$srcDir  = Join-Path $root "public\watches"
$outDir  = Join-Path $root "public\watches-normalized"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$TARGET_H      = 0.89   # subject height as fraction of canvas (Daytona Panda)
$WIDTH_MARGIN  = 0.92   # safety: widest watch keeps a little side gap
$ALPHA_CUTOFF  = 16     # alpha above this counts as "subject"

Get-ChildItem $srcDir -Filter *.png | ForEach-Object {
  $bmp = New-Object System.Drawing.Bitmap $_.FullName
  $w = $bmp.Width; $h = $bmp.Height
  $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
  $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $bytes = New-Object byte[] ($data.Stride * $h)
  [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
  $stride = $data.Stride
  $bmp.UnlockBits($data)

  # --- tight alpha bounding box ---
  $minX = $w; $minY = $h; $maxX = -1; $maxY = -1
  for ($y = 0; $y -lt $h; $y++) {
    $row = $y * $stride
    for ($x = 0; $x -lt $w; $x++) {
      if ($bytes[$row + $x * 4 + 3] -gt $ALPHA_CUTOFF) {
        if ($x -lt $minX) { $minX = $x }; if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }; if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -lt 0) {
    Write-Host ("SKIP {0} (no opaque pixels)" -f $_.Name) -ForegroundColor Yellow
    $bmp.Dispose(); return
  }

  $bw = $maxX - $minX + 1
  $bh = $maxY - $minY + 1

  # --- square canvas sized to the target fill, never smaller than the subject ---
  $S = [int][math]::Ceiling([math]::Max($bh / $TARGET_H, $bw / $WIDTH_MARGIN))
  $destX = [int][math]::Round(($S - $bw) / 2)
  $destY = [int][math]::Round(($S - $bh) / 2)

  $dest = New-Object System.Drawing.Bitmap $S, $S, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($dest)
  $g.CompositingMode    = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
  $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $srcRect  = New-Object System.Drawing.Rectangle $minX, $minY, $bw, $bh
  $destRect = New-Object System.Drawing.Rectangle $destX, $destY, $bw, $bh
  $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()

  $outPath = Join-Path $outDir $_.Name
  $dest.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $dest.Dispose(); $bmp.Dispose()

  $fillH = [math]::Round($bh / $S * 100)
  Write-Host ("OK   {0,-52} {1}x{2} -> {3}x{3}  (fill {4}%)" -f $_.Name, $bw, $bh, $S, $fillH)
}

Write-Host "`nDone -> $outDir" -ForegroundColor Green
