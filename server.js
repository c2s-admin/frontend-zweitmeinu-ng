#!/usr/bin/env node
/**
 * Plesk Node.js Manager Entry Point (Phusion Passenger)
 *
 * This file is required by Plesk's Node.js application manager.
 * It starts the Next.js production server using the built-in Next.js server.
 *
 * @see docs/DEPLOYMENT-WORKFLOW.md
 */

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, '0.0.0.0', (err) => {
    if (err) throw err
    console.log(`✅ Next.js server ready on http://0.0.0.0:${port}`)
    console.log(`📍 Environment: ${process.env.NODE_ENV}`)
    console.log(`🏥 Healthcare Platform: zweitmeinung.ng`)
  })
})

// Healthcare-specific error handling
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err)
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
  process.exit(1)
})
