# 🔧 SAPA-UMKM Connection Test Script
# Script untuk troubleshooting koneksi Front-End & Back-End

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🔍 SAPA-UMKM Connection Tester" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check IP Address
Write-Host "1️⃣  Checking IP Address..." -ForegroundColor Yellow
$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" }
Write-Host "Available IP Addresses:" -ForegroundColor Green
foreach ($ip in $ipAddresses) {
    Write-Host "   - $($ip.IPAddress)" -ForegroundColor White
}
Write-Host ""

# Ask user for IP to test
$testIP = Read-Host "Enter IP address to test (or press Enter to use 192.168.0.14)"
if ([string]::IsNullOrWhiteSpace($testIP)) {
    $testIP = "192.168.0.14"
}
Write-Host "Testing with IP: $testIP" -ForegroundColor Cyan
Write-Host ""

# Test 2: Check if port 5000 is listening
Write-Host "2️⃣  Checking if port 5000 is listening..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "   ✅ Port 5000 is LISTENING" -ForegroundColor Green
    Write-Host "   Process ID: $($port5000.OwningProcess)" -ForegroundColor White
} else {
    Write-Host "   ❌ Port 5000 is NOT listening!" -ForegroundColor Red
    Write-Host "   Please start Flask backend: python run.py" -ForegroundColor Yellow
    Write-Host ""
    $startBackend = Read-Host "Start backend now? (y/n)"
    if ($startBackend -eq 'y') {
        Write-Host "Starting backend..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd API; .\venv\Scripts\Activate.ps1; python run.py"
        Start-Sleep -Seconds 5
    }
}
Write-Host ""

# Test 3: Test localhost connection
Write-Host "3️⃣  Testing localhost connection..." -ForegroundColor Yellow
try {
    $localhostResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5
    Write-Host "   ✅ Localhost: SUCCESS" -ForegroundColor Green
    Write-Host "   Status: $($localhostResponse.status)" -ForegroundColor White
    Write-Host "   Message: $($localhostResponse.message)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Localhost: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Test IP address connection
Write-Host "4️⃣  Testing IP address connection..." -ForegroundColor Yellow
try {
    $ipResponse = Invoke-RestMethod -Uri "http://$testIP:5000/api/health" -Method Get -TimeoutSec 5
    Write-Host "   ✅ IP Address ($testIP): SUCCESS" -ForegroundColor Green
    Write-Host "   Status: $($ipResponse.status)" -ForegroundColor White
    Write-Host "   Message: $($ipResponse.message)" -ForegroundColor White
} catch {
    Write-Host "   ❌ IP Address ($testIP): FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Possible causes:" -ForegroundColor Yellow
    Write-Host "   - Windows Firewall blocking port 5000" -ForegroundColor White
    Write-Host "   - Backend not running" -ForegroundColor White
    Write-Host "   - Wrong IP address" -ForegroundColor White
}
Write-Host ""

# Test 5: Test auth endpoint
Write-Host "5️⃣  Testing auth endpoint..." -ForegroundColor Yellow
try {
    $authBody = @{
        email_or_username = "test_connection"
        password = "test_connection"
    } | ConvertTo-Json

    $authResponse = Invoke-RestMethod -Uri "http://$testIP:5000/api/auth/login" `
        -Method Post `
        -Body $authBody `
        -ContentType "application/json" `
        -TimeoutSec 5 `
        -ErrorAction SilentlyContinue
    
    Write-Host "   ⚠️  Auth endpoint responded (unexpected success)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401 -or $_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "   ✅ Auth endpoint: WORKING" -ForegroundColor Green
        Write-Host "   (401/400 response is expected for invalid credentials)" -ForegroundColor White
    } else {
        Write-Host "   ❌ Auth endpoint: FAILED" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 6: Check Windows Firewall
Write-Host "6️⃣  Checking Windows Firewall..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "*5000*" -ErrorAction SilentlyContinue
if ($firewallRule) {
    Write-Host "   ✅ Firewall rule for port 5000 exists" -ForegroundColor Green
    foreach ($rule in $firewallRule) {
        Write-Host "   - $($rule.DisplayName): $($rule.Enabled)" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️  No firewall rule found for port 5000" -ForegroundColor Yellow
    Write-Host ""
    $createRule = Read-Host "Create firewall rule now? (y/n)"
    if ($createRule -eq 'y') {
        try {
            New-NetFirewallRule -DisplayName "SAPA-UMKM Flask API" `
                -Direction Inbound `
                -LocalPort 5000 `
                -Protocol TCP `
                -Action Allow `
                -Profile Any
            Write-Host "   ✅ Firewall rule created successfully!" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Failed to create firewall rule. Run PowerShell as Administrator." -ForegroundColor Red
        }
    }
}
Write-Host ""

# Test 7: Check config.ts
Write-Host "7️⃣  Checking front-end configuration..." -ForegroundColor Yellow
$configPath = "services\api\config.ts"
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    if ($configContent -match 'const YOUR_COMPUTER_IP = "([^"]+)"') {
        $configIP = $matches[1]
        Write-Host "   Current IP in config.ts: $configIP" -ForegroundColor White
        
        if ($configIP -eq $testIP) {
            Write-Host "   ✅ IP matches!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  IP mismatch!" -ForegroundColor Yellow
            Write-Host "   Config has: $configIP" -ForegroundColor Red
            Write-Host "   Testing with: $testIP" -ForegroundColor Red
            Write-Host ""
            $updateConfig = Read-Host "Update config.ts with $testIP? (y/n)"
            if ($updateConfig -eq 'y') {
                $configContent = $configContent -replace 'const YOUR_COMPUTER_IP = "[^"]+"', "const YOUR_COMPUTER_IP = `"$testIP`""
                Set-Content -Path $configPath -Value $configContent
                Write-Host "   ✅ Config updated!" -ForegroundColor Green
            }
        }
    }
} else {
    Write-Host "   ❌ config.ts not found!" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📊 SUMMARY & RECOMMENDATIONS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔗 Connection URLs:" -ForegroundColor Yellow
Write-Host "   - Health Check: http://$testIP:5000/api/health" -ForegroundColor White
Write-Host "   - Auth Login: http://$testIP:5000/api/auth/login" -ForegroundColor White
Write-Host ""

Write-Host "📱 React Native Configuration:" -ForegroundColor Yellow
Write-Host "   File: services/api/config.ts" -ForegroundColor White
Write-Host "   Set: const YOUR_COMPUTER_IP = `"$testIP`"" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Ensure Flask backend is running" -ForegroundColor White
Write-Host "   2. Verify IP in services/api/config.ts" -ForegroundColor White
Write-Host "   3. Test in browser: http://$testIP:5000/api/health" -ForegroundColor White
Write-Host "   4. Run React Native app and test connection" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
