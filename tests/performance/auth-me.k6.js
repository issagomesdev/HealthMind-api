import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 30 },
    { duration: '1m', target: 80 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.01'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3333'
const TOKEN = __ENV.TOKEN || ''

// Gerar TOKEN antes de rodar:
// export TOKEN=$(curl -s -X POST http://localhost:3333/auth/login \
//   -H "Content-Type: application/json" \
//   -d '{"email":"k6test@example.com","password":"senha12345"}' | jq -r '.token')
// k6 run --env TOKEN=$TOKEN tests/performance/auth-me.k6.js

export default function () {
  if (!TOKEN) {
    console.error('TOKEN não configurado. Use: k6 run --env TOKEN=<seu_token> ...')
    return
  }

  const params = { headers: { Authorization: `Bearer ${TOKEN}` } }
  const res = http.get(`${BASE_URL}/auth/me`, params)

  check(res, {
    'status é 200': (r) => r.status === 200,
    'user retornado': (r) => !!JSON.parse(r.body).user,
    'tempo de resposta < 300ms': (r) => r.timings.duration < 300,
  })

  sleep(1)
}
