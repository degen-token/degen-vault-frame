/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  title: 'DEGEN Vault',
})

app.frame('/', (c) => {
  const { status } = c
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: '#0f172a',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 40,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginBottom: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Deposit your $DEGEN into a vault to earn a tip allowance.
        </div>

        <div
          style={{
            background: 'white',
            padding: '15px 30px',
            fontSize: 36,
            borderRadius: '8px',
            marginBottom: 30,
          }}
        >
          10000
        </div>

        <div
          style={{
            color: 'white',
            fontSize: 24,
            marginBottom: 40,
          }}
        >
          Minimum deposit of 10,000 $DEGEN for 3 months.
        </div>

        <div
          style={{
            background: '#c2410c',
            padding: '20px',
            color: 'white',
            fontSize: 20,
            maxWidth: '80%',
            borderRadius: '8px',
            marginTop: 20,
          }}
        >
          ⚠️ Unlockable funds do not count towards your tip allowance. Use a wallet linked to your Farcaster account.
        </div>
      </div>
    ),
    intents: [
      <Button value="deposit">Deposit</Button>,
      <Button value="withdraw">Withdraw</Button>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
