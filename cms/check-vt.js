import { getCliClient } from 'sanity/cli'
const client = getCliClient()
client.fetch(`*[_type == "valueType"]{_id, title}`).then(console.log)
