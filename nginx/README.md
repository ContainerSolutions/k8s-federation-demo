# Nginx configuration that provides basic stats

1. docker-compose up -d
1. curl http://localhost:8080/basic_status

Response looks like this

```
Active connections: 3 
server accepts handled requests
 20 20 36 
Reading: 0 Writing: 1 Waiting: 2 
```

