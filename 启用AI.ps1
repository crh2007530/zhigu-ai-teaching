$ErrorActionPreference='Stop'
Set-Location -LiteralPath $PSScriptRoot
$nodeCmd=Get-Command node -ErrorAction SilentlyContinue
$nodePath=if($nodeCmd){$nodeCmd.Source}else{'node-not-installed'}
if(!(Test-Path -LiteralPath $nodePath)){throw '需要安装Node.js 20或以上版本。'}
$names=@('AI_PROVIDER','DEEPSEEK_API_KEY','DASHSCOPE_API_KEY','DEEPSEEK_MODEL','QWEN_MODEL','QWEN_REGION','PORT')
$saved=@{};foreach($n in $names){$saved[$n]=[Environment]::GetEnvironmentVariable($n,'Process')}
try {
 $choice=Read-Host '选择模型：1 DeepSeek（默认）；2 千问'
 $env:AI_PROVIDER=if($choice -eq '2'){'qwen'}else{'deepseek'}
 $secure=Read-Host '输入对应服务API Key（隐藏输入，仅用于本次进程，不写入文件）' -AsSecureString
 $ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
 try{$plain=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)}finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)}
 if([string]::IsNullOrWhiteSpace($plain)){throw '未输入密钥。'}
 if($env:AI_PROVIDER -eq 'deepseek'){$env:DEEPSEEK_API_KEY=$plain;$env:DEEPSEEK_MODEL='deepseek-flash'}
 else{$env:DASHSCOPE_API_KEY=$plain;$env:QWEN_MODEL='qwen3-vl-flash';$r=Read-Host '千问地域：1 北京（默认）；2 新加坡';$env:QWEN_REGION=if($r -eq '2'){'singapore'}else{'beijing'}}
 $plain=$null;$env:PORT='8790'
 Start-Process 'http://127.0.0.1:8790/'
 & $nodePath (Join-Path $PSScriptRoot 'server.mjs')
}finally{foreach($n in $names){[Environment]::SetEnvironmentVariable($n,$saved[$n],'Process')};$plain=$null;if($secure){$secure.Dispose()}}
