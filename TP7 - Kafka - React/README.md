
## Correr API y Peticiones

```Bash
$ node api.js

$ curl -X POST http://localhost:3001/transactions -H "Content-Type: application/json" -d "{\"fromAccount\": \"A123\", \"toAccount\": \"B456\", \"amount\": 5000, \"currency\": \"ARS\", \"userId\": \"U001\"}"
```