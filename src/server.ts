import 'dotenv/config'
import { buildApp } from './app'
import { env } from './config/env'

async function main() {
  const app = await buildApp()

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.info(`[Server] Rodando na porta ${env.PORT} — ${env.NODE_ENV}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
