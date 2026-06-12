$src = "C:\Users\gmaro\.gemini\antigravity-ide\brain\d42a9d4e-70a7-4e6d-9c57-d853e8819455"
$dst = "C:\Users\gmaro\.gemini\antigravity-ide\scratch\gainable-fr\public\blog"

Copy-Item "$src\diagnostic_dpe_1781256462246.png" "$dst\diagnostic-dpe.jpg" -Force
Copy-Item "$src\diagnostic_immobilier_1781256476492.png" "$dst\diagnostic-immobilier.jpg" -Force
Copy-Item "$src\diagnostic_electricite_1781256490368.png" "$dst\diagnostic-electricite.jpg" -Force
Copy-Item "$src\diagnostic_amiante_1781256504855.png" "$dst\diagnostic-amiante.jpg" -Force
Copy-Item "$src\bureau_etude_thermique_1781256519180.png" "$dst\bureau-etude-thermique.jpg" -Force
Copy-Item "$src\etude_thermique_re2020_1781256533190.png" "$dst\etude-thermique-re2020.jpg" -Force
Copy-Item "$src\plan_thermique_1781256550301.png" "$dst\plan-thermique.jpg" -Force
Copy-Item "$src\simulation_thermique_1781256565119.png" "$dst\simulation-thermique.jpg" -Force

Write-Host "All 8 images copied successfully!"
