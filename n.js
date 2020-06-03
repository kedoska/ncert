const https = require('https')

const argv = process.argv.slice(2)
if (argv.length <= 0) {
  console.error(`hosts name required
node n.js www.google.com www.linux.org`)
  process.exit(1)
}

const verify = (host) => new Promise((resolve) => {
  const options = {
    host,
    port: 443,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    const {
      valid_from: from,
      valid_to: to,
      issuer: {
        O: issuerName,
      }
    } = res.connection.getPeerCertificate()

    resolve({
      host,
      from,
      to,
      issuerName,
    })
  })

  req.on('error', ({ message }) => resolve({
    host,
    message,
  }))

  req.end()
})

  ; (async () => {
    const [...hosts] = argv

    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i]
      const data = await verify(host)
      console.dir(data)
    }
  })()
