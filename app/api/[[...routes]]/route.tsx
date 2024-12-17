/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { abi } from './abi'

const DEGEN_CONTRACT = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
const VAULT_CONTRACT = "0xa8a30E0dafCA4156f28d96cCa5671a0eEcA5E407"  // Replace with your vault contract
const CHAIN = "eip155:8453"  // Base mainnet

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  title: 'DEGEN Vault',
})

// Handle approve transaction
app.transaction('/approve', (c) => {
  const { inputText } = c

  if (!inputText || parseInt(inputText) < 10000) {
    return c.error({ message: 'Minimum deposit is 10,000 DEGEN' })
  }

  return c.contract({
    abi,
    chainId: CHAIN,
    functionName: "approve",
    args: [VAULT_CONTRACT, inputText],
    to: DEGEN_CONTRACT,
  })
})

// Handle deposit transaction - only after approval
app.transaction('/deposit', (c) => {
  const { inputText } = c

  if (!inputText || parseInt(inputText) < 10000) {
    return c.error({ message: 'Minimum deposit is 10,000 DEGEN' })
  }

  return c.contract({
    abi,
    chainId: CHAIN,
    functionName: "transfer",
    args: [VAULT_CONTRACT, inputText],
    to: DEGEN_CONTRACT,
  })
})

// Handle withdraw transaction
app.transaction('/withdraw', (c) => {
  const { address, inputText } = c

  if (!inputText) {
    return c.error({ message: 'Please enter an amount to withdraw' })
  }

  return c.contract({
    abi,
    chainId: CHAIN,
    functionName: "transferFrom",
    args: [VAULT_CONTRACT, address, inputText],
    to: DEGEN_CONTRACT,
  })
})

app.frame('/', (c) => {
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
          ⚠️ Unlockable funds do not count towards your tip allowance. Use a wallet linked to your Farcaster account. Locked DEGEN cannot be transferred!
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter amount" />,
      <Button.Transaction target="/approve">1. Approve</Button.Transaction>,
      <Button.Transaction target="/deposit">2. Deposit</Button.Transaction>,
      <Button.Transaction target="/withdraw">Withdraw</Button.Transaction>,
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
