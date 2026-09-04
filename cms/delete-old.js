import { getCliClient } from 'sanity/cli'
const client = getCliClient()
async function run() {
  const titles = [
    "Krisis Deadline Integrasi: Membongkar Asumsi & Delesi",
    "Resistensi Tim: Mengubah Pertahanan Menjadi Kolaborasi",
    "Kesenjangan Abstraksi: Menjembatani Visi & Realitas Tim"
  ]
  const scenarios = await client.fetch(`*[_type == "scenario" && title in $titles]{_id}`, {titles})
  for (const s of scenarios) {
    await client.delete(s._id)
    console.log("Deleted", s._id)
  }
}
run()
