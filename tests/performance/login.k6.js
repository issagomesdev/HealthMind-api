import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.05'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3333'

// Pré-cadastrar usuário antes de rodar:
// curl -X POST http://localhost:3333/auth/register -H "Content-Type: application/json" \
//   -d '{"name":"K6 User","email":"k6test@example.com","username":"k6test","password":"senha12345","type":"patient"}'

export default function () {
  const payload = JSON.stringify({
    email: 'k6test@example.com',
    password: 'senha12345',
  })

  const params = { headers: { 'Content-Type': 'application/json' } }

  const res = http.post(`${BASE_URL}/auth/login`, payload, params)

  check(res, {
    'status é 200': (r) => r.status === 200,
    'token retornado': (r) => !!JSON.parse(r.body).token,
    'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1)
}
