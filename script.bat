@echo off
open bitrix388.timeweb.ru 21
ci99420_lashin
3TiEMgxc
cd cc.odinmed.net/public_html/wam/page
mdelete "*.php"
mput "./Public/page/*.php"
cd ../JS
mdelete "*.js"
mput "./Public/JS/*.js"
cd ../CSS
mdelete "*.css"
mput "./Public/CSS/*.css"
cd ../
delete "index.php"
mput "./Public/index.php"
bye
pause
