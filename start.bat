@echo off
chcp 65001
echo ===============================================
echo   数据中心运行监控大屏 - 启动脚本
echo ===============================================
echo.

echo [1/3] 启动后端API服务...
start "Backend Server" cmd /k "cd /d %~dp0server && npm start"
echo 后端服务正在启动...
timeout /t 3 /nobreak >nul

echo.
echo [2/3] 启动前端大屏...
start "Frontend Dashboard" cmd /k "cd /d %~dp0 && npm run dev"
echo 前端服务正在启动...

echo.
echo ===============================================
echo   服务启动完成！
echo ===============================================
echo   后端API: http://localhost:3000
echo   前端大屏: http://localhost:10001
echo ===============================================
echo.
pause