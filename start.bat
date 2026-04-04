@echo off
REM 波司登媒体数据分析平台 - 快速启动脚本

echo ========================================
echo 波司登媒体数据分析平台 - 启动脚本
echo ========================================
echo.

REM 检查 pnpm 是否安装
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ pnpm 未安装，正在安装...
    call npm install -g pnpm
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ pnpm 安装失败，请手动运行: npm install -g pnpm
        pause
        exit /b 1
    )
    echo ✅ pnpm 安装成功
)

echo.
echo 📦 正在安装项目依赖...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装成功

echo.
echo 🚀 正在启动开发服务器...
echo.
echo 访问地址: http://localhost:3000
echo.
call pnpm dev

pause


