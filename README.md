
## Getting Started

Chạy server ở local:

```bash
# Tải các package
npm install

#Tạo database
npx sequelize-cli db:create

# Chạy các migrations (tạo bảng)
- run migrations: 
npx sequelize-cli db:migrate

# Khởi tạo dữ liệu có sẵn
- run seeder:
npx sequelize-cli db:seed:all

# Khởi tạo CSDL đơn vị hành chính: chạy các file 
# CreateTables_vn_units.sql và ImportData_vn_units.sql trong ./assets/vietnamese-provinces-database
# (Có thể dùng MySQL Workbench hoặc các phần mềm tương tự)

# Chạy server
- start:
npm start

```

*Note: máy tính cài phải sequelize; thay đổi nội dung file config/config.son và .env: 

- config/config.son:
```
{
	"development": {
		"username": "root",
		"password": [Your local Mysql root password],
		"database": "giasu_api",
		"host": "127.0.0.1",
		"dialect": "mysql"
	},
	"production": {
		"use_env_variable": "DATABASE_URL"
	}
}
```

- .env:

```
PORT=10000
ACCESS_TOKEN_SECRET="anything"
REFRESH_TOKEN_SECRET="anything"
ACCESS_TOKEN_EXP="3h"
REFRESH_TOKEN_EXP="7d"
```
