
$filePath = "d:\IMP\GitHub\kutumbly\lib\i18n.ts"
$content = Get-Content -Path $filePath -Encoding UTF8

# Specific replacements based on plan
$replacements = @(
    @{ Pattern = "हऽ"; Replacement = "हवे" },
    @{ Pattern = "नईखे"; Replacement = "नाही बा" },
    @{ Pattern = "हमनी के"; Replacement = "हमन के" },
    @{ Pattern = "हमनन के"; Replacement = "हमन के" },
    @{ Pattern = "राउर"; Replacement = "आपन" },
    @{ Pattern = "प्रাইবেসি"; Replacement = "प्राइवेसी" },
    @{ Pattern = "તિજોરી"; Replacement = "तिजोरी" },
    @{ Pattern = " ना "; Replacement = " नाही " },
    @{ Pattern = " ना।"; Replacement = " नाही।" }
)

foreach ($r in $replacements) {
    # Use regex replace
    $content = $content -replace $r.Pattern, $r.Replacement
}

# Special case for Line 171 extra tail removing/fixing if needed
# Actually, the loop should handle most.
# Let's add more specific one-offs if needed.

Set-Content -Path $filePath -Value $content -Encoding UTF8
