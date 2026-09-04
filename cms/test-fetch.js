import { getCliClient } from 'sanity/cli'
const client = getCliClient()
async function check() {
  const scenario = await client.fetch(`*[_type == "scenario" && _id == "F5YQWIMseZg5bENUqhCrU5"][0]`)
  console.dir(scenario.stages[0].replies, {depth: null})
}
check()
