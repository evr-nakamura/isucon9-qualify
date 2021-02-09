export GO111MODULE=on
DB_HOST:=127.0.0.1
DB_PORT:=3306
DB_USER:=isucari
DB_PASS:=isucari
DB_NAME:=isucari

MYSQL_CMD:=mysql -h$(DB_HOST) -P$(DB_PORT) -u$(DB_USER) -p$(DB_PASS) $(DB_NAME)

NGX_LOG:=/var/log/nginx/access.log
MYSQL_LOG:=/tmp/slow-query.log

KATARU_CFG:=./kataribe.toml

SLACKCAT:=slackcat --tee --channel isucon_d2c
SLACKRAW:=slackcat --channel isucon_d2c

PPROF:=go tool pprof -png -output pprof.png http://localhost:6060/debug/pprof/profile

PROJECT_ROOT:=/home/isucon/isucari
BUILD_DIR:=/home/isucon/isucari/webapp/go
BIN_NAME:=isucari

CA:=-o /dev/null -s -w "%{http_code}\n"

all: build

.PHONY: clean
clean:
	cd $(BUILD_DIR); \
	rm -rf torb

deps:
	cd $(BUILD_DIR); \
	go mod download

.PHONY: build
build:
	cd $(BUILD_DIR); \
	go build -o $(BIN_NAME)
	#TODO

.PHONY: restart
restart:
	sudo systemctl restart isucari.golang.service

.PHONY: test
test:
	curl localhost $(CA)

# ここから元から作ってるやつ
.PHONY: dev
dev: build 
	cd $(BUILD_DIR); \
	./$(BIN_NAME)

.PHONY: bench-dev
bench-dev: commit before slow-on dev

.PHONY: bench
bench: commit before build restart log

.PHONY: log
log: 
	sudo journalctl -u isucari.golang -n10 -f

.PHONY: maji
bench: commit before build restart

.PHONY: anal
anal: slow kataru

.PHONY: push
push: 
	git push

.PHONY: commit
commit:
	cd $(PROJECT_ROOT); \
	git add .; \
	git commit --allow-empty -m "bench"

.PHONY: before
before:
	$(eval when := $(shell date "+%s"))
	mkdir -p ~/logs/$(when)
	@if [ -f $(NGX_LOG) ]; then \
		sudo mv -f $(NGX_LOG) ~/logs/$(when)/ ; \
	fi
	# @if [ -f $(MYSQL_LOG) ]; then \
	# 	sudo mv -f $(MYSQL_LOG) ~/logs/$(when)/ ; \
	# fi
	sudo systemctl restart nginx
	# sudo systemctl restart mysql

.PHONY: slow
slow: 
	sudo pt-query-digest $(MYSQL_LOG) | $(SLACKCAT)

# .PHONY: kataru
# kataru:
# 	sudo cat $(NGX_LOG) | kataribe -f ./kataribe.toml | $(SLACKCAT)

.PHONY: alp
alp:
	sudo cat $(NGX_LOG) | alp -f /var/log/nginx/access.log --sum | $(SLACKCAT)

.PHONY: pprof
pprof:
	$(PPROF)
	$(SLACKRAW) -n pprof.png ./pprof.png

.PHONY: slow-on
slow-on:
	sudo mysql -e "set global slow_query_log_file = '$(MYSQL_LOG)'; set global long_query_time = 0; set global slow_query_log = ON;"
	# sudo $(MYSQL_CMD) -e "set global slow_query_log_file = '$(MYSQL_LOG)'; set global long_query_time = 0; set global slow_query_log = ON;"

.PHONY: slow-off
slow-off:
	sudo mysql -e "set global slow_query_log = OFF;"
	# sudo $(MYSQL_CMD) -e "set global slow_query_log = OFF;"

.PHONY: setup
setup:
	sudo apt install -y dstat
	sudo apt install -y percona-toolkit dstat git unzip snapd
	git config --global user.email "hiroki.nakamura@ever-rise.co.jp"
	git config --global user.name "nakamura"
	# wget https://github.com/matsuu/kataribe/releases/download/v0.4.1/kataribe-v0.4.1_linux_amd64.zip -O kataribe.zip
	# unzip -o kataribe.zip
	# sudo mv kataribe /usr/local/bin/
	# sudo chmod +x /usr/local/bin/kataribe
	# rm kataribe.zip
	# kataribe -generate
	wget https://github.com/tkuchiki/alp/releases/download/v0.3.1/alp_linux_amd64.zip
	unzip alp_linux_amd64.zip
	sudo mv alp /usr/local/bin
	wget https://github.com/KLab/myprofiler/releases/download/0.2/myprofiler.linux_amd64.tar.gz
	tar xf myprofiler.linux_amd64.tar.gz
	rm myprofiler.linux_amd64.tar.gz
	sudo mv myprofiler /usr/local/bin/
	sudo chmod +x /usr/local/bin/myprofiler
	wget https://github.com/bcicen/slackcat/releases/download/v1.5/slackcat-1.5-linux-amd64 -O slackcat
	sudo mv slackcat /usr/local/bin/
	sudo chmod +x /usr/local/bin/slackcat
	slackcat --configure
