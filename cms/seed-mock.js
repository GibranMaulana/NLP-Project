import { getCliClient } from 'sanity/cli'
const client = getCliClient()

const MOCK_SCENARIOS = {
  "krisis-deadline-sarah": {
    title: "Krisis Deadline Integrasi: Membongkar Asumsi & Delesi",
    slug: "krisis-deadline-sarah",
    method: "meta_model",
    maxTension: 3,
    prologue: [
      {
        _type: "block",
        _key: "p1",
        children: [
          {
            _type: "span",
            text: "Kamis, 16:45. Peluncuran integrasi pembayaran klien korporat dijadwalkan besok pukul 09:00. Sarah, Product Lead Anda, tiba-tiba masuk ke ruangan dengan wajah tegang dan membanting dokumen ke meja. Kegagalan peluncuran ini dapat memicu penalti kontrak senilai miliaran rupiah.",
          },
        ],
      },
    ],
    stages: [
      {
        id: "s1",
        stageId: "s1",
        title: "Babak 1: Ledakan Kepanikan",
        speaker: "Sarah",
        phaseType: "Pacing",
        botPrompt:
          "Mas, peluncuran integrasi klien besok pagi pasti gagal total! Semua orang di tim backend lepas tangan dan nggak ada yang peduli sama sekali!",
        replies: [
          {
            _key: "r1_a",
            text: "Tenang dulu Sarah. Benarkah 'semua orang' tidak peduli, atau siapa spesifiknya di tim backend yang belum merespons?",
            valueType: {
              title: "Generalization (Universal Quantifier)",
              description: "Menantang kata mutlak 'semua orang' dan 'nggak ada yang peduli' untuk mengembalikan fakta orang per orang.",
            },
            nextStageId: "s2_honesty",
            tensionEffect: -1,
            systemFeedback:
              "Bagus sekali! Menantang generalisasi 'semua orang' dengan nada tenang membantu Sarah melihat bahwa tidak semua orang menentangnya.",
          },
          {
            _key: "r1_b",
            text: "Bagian mana yang spesifiknya belum beres hingga kamu menyimpulkan peluncuran ini 'pasti gagal total'?",
            valueType: {
              title: "Deletion (Unspecified Verb)",
              description: "Membongkar delesi informasi di balik klaim 'gagal total' untuk menemukan data riil.",
            },
            nextStageId: "s2_technical",
            tensionEffect: 0,
            systemFeedback:
              "Tepat pada data faktual! Anda meminta spesifikasi dari delesi 'gagal total', meski Sarah masih agak tegang.",
          },
          {
            _key: "r1_c",
            text: "Kamu berasumsi buruk karena panik kan? Kalau kamu percaya diri, harusnya situasi ini nggak bikin kamu ketakutan begini.",
            valueType: {
              title: "Distortion (Mind Reading & Cause-Effect)",
              description: "Menebak isi pikiran lawan bicara dan menarik hubungan sebab-akibat yang menghakimi.",
            },
            nextStageId: "s2_conflict",
            tensionEffect: 1,
            systemFeedback:
              "Fatal! Melakukan 'Mind Reading' (menebak motif orang lain) saat mereka tertekan langsung memicu respons defensif agresif.",
          },
        ],
      },
      {
        id: "s2_honesty",
        stageId: "s2_honesty",
        title: "Babak 2: Pengakuan Akar Masalah",
        speaker: "Sarah",
        phaseType: "Leading",
        botPrompt:
          "Sebenarnya... masalahnya bukan backend doang mas. Kemarin saya telat ngirim update spesifikasi API payment karena klien banyak minta revisi. Dimas jadi kebingungan pas testing tadi siang.",
        replies: [
          {
            _key: "r2h_a",
            text: "Dari revisi spesifikasi itu, apa fungsi teknis spesifik yang paling membuat Dimas bingung?",
            valueType: {
              title: "Deletion (Lack of Referential Index)",
              description: "Menggali detail informasi teknis spesifik yang belum jelas tanpa menghakimi keterlambatan.",
            },
            nextStageId: "s3_optimal",
            tensionEffect: -1,
            systemFeedback:
              "Presisi tinggi! Anda memulihkan informasi yang hilang (Deletion) dan mengarahkan Sarah pada penyelesaian teknis.",
          },
          {
            _key: "r2h_b",
            text: "Kenapa kamu selalu menunda mengirimkan dokumen penting ke tim teknis tiap ada perubahan?",
            valueType: {
              title: "Generalization (Universal Quantifier 'Selalu')",
              description: "Menyerang lawan bicara dengan kata mutlak 'selalu' yang menutup ruang kolaborasi.",
            },
            nextStageId: "s2_conflict",
            tensionEffect: 1,
            systemFeedback:
              "Menyerang dengan kata 'selalu' menghancurkan kepercayaan. Lawan bicara yang sudah jujur akan merasa menyesal telah terbuka.",
          },
        ],
      },
      {
        id: "s2_technical",
        stageId: "s2_technical",
        title: "Babak 2: Hambatan Teknis Kaku",
        speaker: "Sarah",
        phaseType: "Leading",
        botPrompt:
          "Dimas bilang endpoint callback webhook payment masih error 500 kalau request paralel. Mereka minta waktu 2 hari lagi, padahal klien maunya besok jam 9 pagi teng!",
        replies: [
          {
            _key: "r2t_a",
            text: "Apakah error pada request paralel ini otomatis berarti seluruh flow transaksi utama klien tidak bisa dipakai sama sekali?",
            valueType: {
              title: "Distortion (Complex Equivalence / Cause-Effect)",
              description: "Membedah apakah A (error paralel) sungguh-sungguh sama dengan B (seluruh sistem mati).",
            },
            nextStageId: "s3_optimal",
            tensionEffect: -1,
            systemFeedback:
              "Analisis Meta Model yang tajam! Anda memisahkan fakta teknis dari kesimpulan distorsif lawan bicara.",
          },
          {
            _key: "r2t_b",
            text: "Apa yang akan terjadi jika kita rilis modul non-payment dulu dan menunda webhook ini 3 jam?",
            valueType: {
              title: "Generalization (Modal Operator of Necessity)",
              description: "Menantang keharusan mutlak 'klien harus besok jam 9' dengan konsekuensi riil.",
            },
            nextStageId: "s3_optimal",
            tensionEffect: 0,
            systemFeedback:
              "Bagus! Menantang keharusan mutlak ('klien maunya jam 9') membuka alternatif solusi baru.",
          },
          {
            _key: "r2t_c",
            text: "Pokoknya harus beres malam ini. Tidak ada toleransi alasan teknis!",
            valueType: {
              title: "Generalization (Modal Operator of Necessity 'Harus')",
              description: "Memaksakan keharusan tanpa dasar mitigasi risiko riil.",
            },
            nextStageId: "s3_fragile",
            tensionEffect: 1,
            systemFeedback:
              "Memaksakan keharusan secara kaku ('Pokoknya harus') mempertinggi risiko bencana produksi.",
          },
        ],
      },
      {
        id: "s2_conflict",
        stageId: "s2_conflict",
        title: "Babak 2: Serangan Balik Defensif",
        speaker: "Sarah",
        phaseType: "Leading",
        botPrompt:
          "Loh kok Mas malah nyalahin saya?! Mas kan manajernya, dari minggu lalu saya udah minta tambahan engineer tapi Mas nggak pernah tanggapin!",
        replies: [
          {
            _key: "r2c_a",
            text: "Kapan persisnya kita pernah membicarakan ini, dan apa yang waktu itu spesifiknya belum teralokasi?",
            valueType: {
              title: "Deletion (Restoring Unspecified Reference)",
              description: "Mengembalikan klaim 'nggak pernah tanggapin' ke fakta historis yang spesifik.",
            },
            nextStageId: "s3_fragile",
            tensionEffect: -1,
            systemFeedback:
              "Langkah dingin yang memulihkan data faktual dari klaim emosional yang terhapus.",
          },
          {
            _key: "r2c_b",
            text: "Kamu melempar tuduhan ini pasti karena kamu sadar kamu sendiri yang gagal mengatur waktu kan?",
            valueType: {
              title: "Distortion (Mind Reading & Hostile Presupposition)",
              description: "Presuposisi permusuhan yang fatal dalam komunikasi.",
            },
            nextStageId: "game_over",
            tensionEffect: 2,
            systemFeedback:
              "Fatal! Melakukan presuposisi jahat membakar jembatan komunikasi. Lawan bicara walk-out.",
          },
        ],
      },
      {
        id: "s3_optimal",
        stageId: "s3_optimal",
        title: "Babak 3: Keselarasan & Rencana Konkret",
        speaker: "Sarah",
        phaseType: "Leading",
        botPrompt:
          "Masuk akal mas. Kalau kita rilis fitur katalog & checkout dulu, lalu webhook payment kita monitoring manual 2 jam pertama, risiko sistem aman. Saya akan telepon Dimas sekarang untuk simulasi bareng.",
        replies: [
          {
            _key: "r3o_a",
            text: "Tepat. Berapa estimasi waktu spesifik yang Dimas butuhkan untuk memastikan setup monitoring manual itu siap?",
            valueType: {
              title: "Deletion (Precision on Quantification)",
              description: "Mengunci kepastian eksekusi dengan data kuantitas waktu yang presisi.",
            },
            nextStageId: "end_optimal",
            tensionEffect: -1,
            systemFeedback:
              "Sempurna! Menutup percakapan dengan presisi waktu (Deletion recovered) memastikan eksekusi tidak mengambang.",
          },
        ],
      },
      {
        id: "s3_fragile",
        stageId: "s3_fragile",
        title: "Babak 3: Kepatuhan dengan Keterpaksaan",
        speaker: "Sarah",
        phaseType: "Leading",
        botPrompt:
          "Ya udah kalau Mas maunya gitu. Saya push Dimas lembur malam ini. Tapi kalau besok pagi ada bug atau data transaksi berantakan, jangan limpahkan tanggung jawab ke saya ya.",
        replies: [
          {
            _key: "r3f_a",
            text: "Apa bukti yang membuatmu menyimpulkan bahwa saya akan melimpahkan kesalahan kepadamu jika terjadi kendala?",
            valueType: {
              title: "Distortion (Challenging Presupposition & Mind Reading)",
              description: "Menantang prasangka buruk lawan bicara terhadap niat manajerial.",
            },
            nextStageId: "end_fragile",
            tensionEffect: 0,
            systemFeedback:
              "Mencoba menantang distorsi di akhir, namun suasana sudah terlanjur dingin.",
          },
        ],
      },
      {
        id: "game_over",
        stageId: "game_over",
        title: "Titik Akhir (Walkout)",
        speaker: "Sarah",
        phaseType: "Leading",
        botPrompt: "Cukup! Sikap Anda benar-benar keterlaluan. Pertemuan ini saya batalkan!",
        replies: []
      },
      {
        id: "end_optimal",
        stageId: "end_optimal",
        title: "Titik Akhir (Optimal)",
        speaker: "Sarah",
        phaseType: "Leading",
        botPrompt: "Baik, saya segera kabari progresnya dalam 30 menit.",
        replies: []
      },
      {
        id: "end_fragile",
        stageId: "end_fragile",
        title: "Titik Akhir (Fragile)",
        speaker: "Sarah",
        phaseType: "Leading",
        botPrompt: "Terserah, saya kerjakan saja sesuai instruksi.",
        replies: []
      }
    ],
    diagnoses: [
      {
        conditionType: "game_over",
        title: "Percakapan Buntu (Deadlock / Walk-Out)",
        headline: "Percakapan Berakhir Buntu: Ego Mengalahkan Solusi",
        harshTruth:
          "Sarah menutup laptop dan meninggalkan ruangan. Peluncuran besok pagi gagal total dan risiko penalti kontrak menjadi kenyataan.\n\nDalam prinsip NLP: 'Pacing must precede Leading'. Ketika seseorang sedang berada dalam badai amigdala (panik/terancam), menekan mereka dengan logika interogatif dan tuduhan hanya memicu respons 'Fight or Flight'. Tanpa membangun rasa aman psikologis (psychological safety), kata-kata Anda tidak lagi didengar sebagai solusi, melainkan sebagai ancaman eksistensial.",
      },
      {
        conditionType: "fragile",
        title: "Selesai dengan Gesekan (The Interrogation Trap)",
        headline: "Solusi Terpaksa, Kepercayaan Retak",
        harshTruth:
          "Rilis besok pagi mungkin terselamatkan secara darurat, namun tim Anda bekerja di bawah teror dan ketakutan. Sarah merasa disidang di meja interogasi alih-alih didukung sebagai rekan kerja.\n\nGaya komunikasi Anda efektif membongkar fakta teknis, tetapi dengan ongkos 'human connection' yang sangat mahal. Di lingkungan eksekutif, kepemimpinan semacam ini menghasilkan kepatuhan pasif: tim tidak akan berinisiatif, menyembunyikan masalah lebih lama, dan turnover engineer akan meningkat drastis.",
      },
      {
        conditionType: "optimal",
        title: "Resolusi Optimal (Transformative Breakthrough)",
        headline: "Klarifikasi Presisi & Kolaborasi Tanpa Friksi",
        harshTruth:
          "Anda mendemonstrasikan penguasaan Meta Model tingkat mahir. Dengan memvalidasi emosi di awal (Pacing), Anda memberi ruang aman bagi Sarah untuk mengakui keterlambatan spesifikasinya tanpa rasa takut dipermalukan.\n\nBegitu rasa percaya terbentuk, Anda dengan lihai membedah generalisasi 'semua orang lepas tangan' menjadi langkah aksi konkret (Chunking Down). Masalah bisnis terselamatkan, komitmen tim menguat, dan martabat lawan bicara tetap terjaga utuh.",
      },
    ],
  },
  
  "resistensi-migrasi-alex": {
    title: "Resistensi Tim: Mengubah Pertahanan Menjadi Kolaborasi",
    slug: "resistensi-migrasi-alex",
    method: "open_closed_language",
    maxTension: 3,
    prologue: [
      {
        _type: "block",
        _key: "p2",
        children: [
          {
            _type: "span",
            text: "Manajemen memutuskan memigrasikan arsitektur sistem ke teknologi cloud-native terbaru. Alex, Principal Engineer paling senior di perusahaan, menolak hadir di 3 sesi perancangan dan mulai menunjukkan tanda-tanda 'quiet quitting'. Jika Alex mengundurkan diri, blueprint sistem perbankan perusahaan akan kehilangan penjaganya.",
          },
        ],
      },
    ],
    stages: [
      {
        id: "s1",
        stageId: "s1",
        title: "Babak 1: Sikap Dingin & Skeptis",
        speaker: "Alex",
        phaseType: "Pacing",
        botPrompt:
          "Terserah manajemen aja mau migrasi atau nggak. Tapi kalau nanti server down pas traffic puncak gajian, jangan cari saya. Dari dulu masukan tim teknis nggak pernah dianggap penting.",
        replies: [
          {
            _key: "r1_a",
            text: "Alex, apa pertimbangan teknis paling krusial yang menurutmu belum dilihat manajemen saat merancang migrasi ini?",
            valueType: {
              title: "Open-Ended Question (Eksplorasi)",
              description: "Pertanyaan terbuka yang mengundang keahlian lawan bicara.",
            },
            nextStageId: "s2_open",
            tensionEffect: -1,
            systemFeedback:
              "Bagus sekali! Pertanyaan terbuka 'Apa pertimbangan...' menggeser Alex dari defensif menjadi konsultan berharga.",
          },
          {
            _key: "r1_b",
            text: "Bisa selesai migrasinya sebelum kuartal ini berakhir atau nggak?",
            valueType: {
              title: "Closed / Polar Question",
              description: "Pertanyaan ya/tidak yang menyudutkan tanpa mendengar argumen.",
            },
            nextStageId: "s2_compliance",
            tensionEffect: 1,
            systemFeedback:
              "Hati-hati! Pertanyaan biner (bisa/nggak) menutup dialog dan memicu kepatuhan semu.",
          },
          {
            _key: "r1_c",
            text: "Kamu nolak migrasi ini karena takut keahlian tokomu nggak relevan lagi kan?",
            valueType: {
              title: "Closed / Leading & Accusatory",
              description: "Menembakkan prasangka pribadi berkedok pertanyaan.",
            },
            nextStageId: "s2_conflict",
            tensionEffect: 2,
            systemFeedback:
              "Sangat berbahaya! Tuduhan psikologis langsung memutus rasa hormat profesional.",
          },
        ],
      },
      {
        id: "s2_open",
        stageId: "s2_open",
        title: "Babak 2: Pengungkapan Risiko Nyata",
        speaker: "Alex",
        phaseType: "Leading",
        botPrompt:
          "Core banking kita masih pakai stored procedure 15 tahun lalu. Database baru yang diusulkan konsultan itu nggak support locking row selevel itu. Kalau migrasi dipaksakan cut-off langsung, data mutasi nasabah bisa hilang miliaran rupiah.",
        replies: [
          {
            _key: "r2o_a",
            text: "Itu temuan yang sangat fatal. Bagaimana pandanganmu jika kita terapkan pola Strangler Fig — migrasi modul non-kritis dulu sambil mempertahankan engine inti?",
            valueType: {
              title: "Open Collaboration",
              description: "Melibatkan keahlian lawan bicara dalam merumuskan arsitektur transisi.",
            },
            nextStageId: "s3_optimal",
            tensionEffect: -1,
            systemFeedback:
              "Sempurna! Anda memvalidasi keahlian Alex dan mengajaknya mendesain mitigasi bersama.",
          },
          {
            _key: "r2o_b",
            text: "Konsultan kita lulusan top global Alex, masa mereka sebodoh itu nggak mikir locking row?",
            valueType: {
              title: "Closed / Appeal to Authority",
              description: "Meremehkan pengalaman riil dengan otoritas luar.",
            },
            nextStageId: "s2_conflict",
            tensionEffect: 1,
            systemFeedback:
              "Menghina keahlian lokal demi membela konsultan luar akan membunuh loyalitas engineer senior.",
          },
        ],
      },
      {
        id: "s2_compliance",
        stageId: "s2_compliance",
        title: "Babak 2: Jawaban Datar Tanpa Komitmen",
        speaker: "Alex",
        phaseType: "Leading",
        botPrompt:
          "Bisa.",
        replies: [
          {
            _key: "r2m_a",
            text: "Alex, jawabanmu singkat sekali. Apa kekhawatiran terbesar yang masih tertahan di pikiranmu?",
            valueType: {
              title: "Pacing / Meta-Awareness",
              description: "Membaca bahasa tubuh dan keheningan, lalu membuka kembali pintu dialog.",
            },
            nextStageId: "s2_open",
            tensionEffect: -1,
            systemFeedback:
              "Kepekaan luar biasa! Anda tidak menelan mentah-mentah kata 'bisa' dan berhasil menggali unexpressed concern.",
          },
          {
            _key: "r2m_b",
            text: "Bagus kalau gitu. Saya pegang omonganmu, jangan sampai ada alasan molor lagi.",
            valueType: {
              title: "Closed / Rigid",
              description: "Mengabaikan sinyal pasif-agresif.",
            },
            nextStageId: "s3_fragile",
            tensionEffect: 1,
            systemFeedback:
              "Ilusi kontrol. Anda merasa menang debat, padahal bencana teknis sedang mengintai.",
          },
        ],
      },
      {
        id: "s2_conflict",
        stageId: "s2_conflict",
        title: "Babak 2: Pengunduran Diri",
        speaker: "Alex",
        phaseType: "Leading",
        botPrompt:
          "Kalau Mas merasa saya beban dan nggak kompeten, silakan proses surat pengunduran diri saya hari ini juga. Saya nggak mau jadi kambing hitam pas sistem baru ini crash.",
        replies: [
          {
            _key: "r2c_a",
            text: "Alex, tarik napas dulu. Saya keliru berspekulasi soal motivasimu tadi dan saya minta maaf. Pengalamanmu 10 tahun di sini tak tergantikan. Tolong bantu saya paham risikonya.",
            valueType: {
              title: "Radical Empathy & Reset",
              description: "Menurunkan ego dan memulihkan rasa hormat.",
            },
            nextStageId: "s3_fragile",
            tensionEffect: -2,
            systemFeedback:
              "Penyelamatan tingkat dewa. Kerendahan hati seorang pemimpin mampu membalikkan jurang pengunduran diri.",
          },
          {
            _key: "r2c_b",
            text: "Silakan, kami tidak menahan orang yang tidak satu visi dengan masa depan perusahaan.",
            valueType: {
              title: "Rejection",
              description: "Mendorong rekan berharga keluar.",
            },
            nextStageId: "game_over",
            tensionEffect: 2,
            systemFeedback:
              "Bencana organisasi. Talenta inti hilang, pengetahuan sistem lenyap.",
          },
        ],
      },
      {
        id: "s3_optimal",
        stageId: "s3_optimal",
        title: "Babak 3: Kepemimpinan Teknis Pulih",
        speaker: "Alex",
        phaseType: "Leading",
        botPrompt:
          "Kalau strateginya Strangler Fig, saya setuju 100%. Kita bisa mulai dari modul reporting analytics dulu minggu depan. Saya sendiri yang akan awasi transisi datanya biar nggak bocor.",
        replies: [
          {
            _key: "r3o_a",
            text: "Luar biasa Alex. Saya percayakan arsitektur transisi ini sepenuhnya padamu. Ayo kita jadwalkan sync dengan tim direksi.",
            valueType: {
              title: "Empowerment & Trust",
              description: "Memberikan kepemilikan solusi kepada orang yang tepat.",
            },
            nextStageId: "end_optimal",
            tensionEffect: -1,
            systemFeedback:
              "Kemenangan ganda: sistem terlindungi, moral tim teknis meroket.",
          },
        ],
      },
      {
        id: "s3_fragile",
        stageId: "s3_fragile",
        title: "Babak 3: Kepatuhan Dingin",
        speaker: "Alex",
        phaseType: "Leading",
        botPrompt:
          "Saya akan laksanakan tugas sesuai arahan Mas. Tapi saya tidak bertanggung jawab atas integritas data di luar lingkup modul saya.",
        replies: [
          {
            _key: "r3f_a",
            text: "Baik, lakukan yang terbaik.",
            valueType: {
              title: "Cold Finish",
              description: "Penyelesaian tanpa rekonsiliasi emosional.",
            },
            nextStageId: "end_fragile",
            tensionEffect: 0,
            systemFeedback:
              "Proyek berjalan, namun silo mentality terbentuk kuat di dalam tim.",
          },
        ],
      },
      {
        id: "game_over",
        stageId: "game_over",
        title: "Titik Akhir (Walkout)",
        speaker: "Alex",
        phaseType: "Leading",
        botPrompt: "Saya pamit dari perusahaan hari ini.",
        replies: []
      },
      {
        id: "end_optimal",
        stageId: "end_optimal",
        title: "Titik Akhir (Optimal)",
        speaker: "Alex",
        phaseType: "Leading",
        botPrompt: "Baik, saya siapkan proposal desainnya sekarang.",
        replies: []
      },
      {
        id: "end_fragile",
        stageId: "end_fragile",
        title: "Titik Akhir (Fragile)",
        speaker: "Alex",
        phaseType: "Leading",
        botPrompt: "Ya, saya mengerti.",
        replies: []
      }
    ],
    diagnoses: [
      {
        conditionType: "game_over",
        title: "Talenta Inti Hengkang (Quiet Quitting to Walk-Out)",
        headline: "Kehilangan Aset Terbesar: Ketika Otoritas Membungkam Dialog",
        harshTruth:
          "Alex resmi mengajukan surat pengunduran diri dan menolak serah terima dokumen legacy code. Migrasi sistem tertunda 9 bulan dengan pembengkakan biaya mencapai ratusan juta rupiah.\n\nDalam NLP, 'Closed Questions' dan tuduhan menghakimi mengaktifkan mekanisme proteksi diri lawan bicara. Pertanyaan seperti 'Kamu malas kan?' bukan mencari informasi, melainkan memaksakan vonis. Ketika orang cerdas dihadapkan pada pertanyaan tertutup yang memojokkan, mereka hanya punya dua pilihan: memalsukan persetujuan atau pergi.",
      },
      {
        conditionType: "fragile",
        title: "Kepatuhan Semu (Surface Compliance)",
        headline: "Kepatuhan di Bibir, Bencana di Lapangan",
        harshTruth:
          "Alex setuju mengerjakan proyek ini, namun dengan sikap pasif-agresif ('Bukan salah saya kalau sistem meledak'). Anda memenangkan argumen di meja rapat, tetapi kehilangan keterlibatan batin (engagement) dari engineer terbaik Anda.\n\nBahasa tertutup menghasilkan 'Yes-Men'. Tim hanya mengerjakan tepat apa yang diperintahkan tanpa mau memberi peringatan dini saat melihat lubang di haluan kapal. Kepemimpinan ini rapuh karena Anda harus memantau setiap langkah kecil mereka (micromanagement).",
      },
      {
        conditionType: "optimal",
        title: "Eksplorasi Transformatif (Psychological Safety)",
        headline: "Dari Penolakan Keras Menjadi Penjaga Sistem",
        harshTruth:
          "Anda mendemonstrasikan kekuatan magis dari Open-Ended Inquiries ('Apa pertimbanganmu...', 'Bagaimana pandanganmu...'). Alih-alih menganggap skeptisisme Alex sebagai pembangkangan, Anda memandangnya sebagai sinyal kepedulian yang terdistorsi.\n\nDengan membuka ruang eksplorasi, risiko kehilangan data nasabah berhasil dicegah sebelum sistem dirombak. Alex merasa dihormati sebagai arsitek intelektual, dan proyek migrasi kini memiliki champion paling kredibel di mata seluruh tim teknis.",
      },
    ],
  },
  
  "kesenjangan-visi-maya": {
    title: "Kesenjangan Abstraksi: Menjembatani Visi & Realitas Tim",
    slug: "kesenjangan-visi-maya",
    method: "chunking",
    maxTension: 3,
    prologue: [
      {
        _type: "block",
        _key: "p3",
        children: [
          {
            _type: "span",
            text: "Rapat dewan komisaris baru saja selesai. CEO menginginkan 'Disrupsi Brand Omnichannel untuk Mendominasi Pasar Regional'. Maya, Head of Marketing Anda, duduk lemas di meja kerjanya. Tim lapangan marketing di bawahnya kebingungan harus memposting apa besok pagi, sementara Maya terjebak di antara jargon direksi dan kebingungan tim eksekusi.",
          },
        ],
      },
    ],
    stages: [
      {
        id: "s1",
        stageId: "s1",
        title: "Babak 1: Kebingungan Level Abstraksi",
        speaker: "Maya",
        phaseType: "Pacing",
        botPrompt:
          "Mas, saya pusing banget. Direksi minta kita 'Mendominasi Pasar Regional', tapi tim konten saya masih debat kusir soal warna tombol landing page! Saya nggak tahu harus menerjemahkan visi awang-awang ini ke tim gimana!",
        replies: [
          {
            _key: "r1_a",
            text: "Mari kita bedah (Chunk Down): Dari kalimat 'Mendominasi Pasar' itu, apa 2 metrik perilaku konsumen spesifik yang paling ingin dilihat direksi kuartal ini?",
            valueType: {
              title: "Chunking Down (Mencari Detail Konkret)",
              description: "Menurunkan abstraksi filosofis ke angka dan perilaku nyata.",
            },
            nextStageId: "s2_down",
            tensionEffect: -1,
            systemFeedback:
              "Tepat sasaran! Chunking Down langsung mendaratkan jargon abstrak menjadi fokus pengukuran realistis.",
          },
          {
            _key: "r1_b",
            text: "Sebenarnya, apa tujuan fundamental (Chunk Up) di balik ambisi ekspansi regional ini bagi kelangsungan produk kita?",
            valueType: {
              title: "Chunking Up (Mencari Nilai & Purpose)",
              description: "Menaikkan level obrolan untuk memahami intensi tertinggi dari keputusan.",
            },
            nextStageId: "s2_up",
            tensionEffect: 0,
            systemFeedback:
              "Bagus untuk menyelaraskan 'Why', namun pastikan setelah ini segera diturunkan ke aksi nyata agar Maya tidak makin pusing.",
          },
          {
            _key: "r1_c",
            text: "Ya wajar direksi minta begitu. Pokoknya timmu harus bikin kampanye yang viral dan spektakuler!",
            valueType: {
              title: "Stay in the Clouds (Abstraksi Kosong)",
              description: "Menambah beban jargon tanpa memberikan kejelasan operasional.",
            },
            nextStageId: "s2_vague",
            tensionEffect: 1,
            systemFeedback:
              "Menambah frustrasi! Menjawab jargon dengan jargon baru ('viral & spektakuler') membuat tim makin tersesat.",
          },
        ],
      },
      {
        id: "s2_down",
        stageId: "s2_down",
        title: "Babak 2: Pemetaan Metrik Nyata",
        speaker: "Maya",
        phaseType: "Leading",
        botPrompt:
          "Kalau dipikir-pikir... direksi sebenarnya cuma peduli pada 2 hal: peningkatan lead dari segmen corporate B2B sebesar 30%, dan retensi klien lama. Debat tim soal warna banner kemarin emang sama sekali nggak nyambung sama tujuan itu.",
        replies: [
          {
            _key: "r2d_a",
            text: "Sangat jernih! Dari target B2B itu, apa 1 eksperimen paling sederhana yang bisa diuji coba tim konten minggu ini?",
            valueType: {
              title: "Chunking Down ke Tindakan Mikro",
              description: "Mengonversi metrik menjadi tindakan harian pertama.",
            },
            nextStageId: "s3_optimal",
            tensionEffect: -1,
            systemFeedback:
              "Formula kepemimpinan terbaik: dari Visi Besar -> Metrik Sukses -> Eksperimen Minggu Ini.",
          },
          {
            _key: "r2d_b",
            text: "Kalau gitu saya ambil alih review copy banner mereka satu per satu mulai besok pagi.",
            valueType: {
              title: "Over-Chunking Down (Micromanagement)",
              description: "Turun terlalu rendah hingga mengambil alih tugas teknis bawahan.",
            },
            nextStageId: "s3_fragile",
            tensionEffect: 1,
            systemFeedback:
              "Bahaya micromanagement! Chunking Down bertujuan memberi kejelasan arah, bukan merampas otonomi eksekusi tim.",
          },
        ],
      },
      {
        id: "s2_up",
        stageId: "s2_up",
        title: "Babak 2: Menemukan 'Why'",
        speaker: "Maya",
        phaseType: "Leading",
        botPrompt:
          "Tujuan utamanya adalah repositioning. Kita nggak mau lagi dianggap aplikasi murah oleh kompetitor lokal, tapi mitra strategis terpercaya buat korporasi multinasional.",
        replies: [
          {
            _key: "r2u_a",
            text: "Keren sekali definisimu. Sekarang mari kita turunkan (Chunk Down): narasi atau bukti studi kasus apa yang bisa dibuat tim konten untuk mencerminkan trust itu?",
            valueType: {
              title: "Harmonious Chunking (Up to Down)",
              description: "Menggunakan purpose luhur sebagai jangkar untuk memandu detail materi konten.",
            },
            nextStageId: "s3_optimal",
            tensionEffect: -1,
            systemFeedback:
              "Pola NLP tingkat tinggi! Anda membawa Maya naik ke Purpose (Up), lalu langsung membimbingnya terjun ke Eksekusi (Down).",
          },
          {
            _key: "r2u_b",
            text: "Iya benar, trust itu konsep luhur. Bikin manifesto filosofis dulu aja Maya sebelum mikir jualan.",
            valueType: {
              title: "Infinite Upward Loop",
              description: "Terjebak di awang-awang tanpa pernah mendarat.",
            },
            nextStageId: "s2_vague",
            tensionEffect: 1,
            systemFeedback:
              "Analisis paralisis! Terlalu lama di awan filosofis membuat tim lapangan kehilangan arah operasional.",
          },
        ],
      },
      {
        id: "s2_vague",
        stageId: "s2_vague",
        title: "Babak 2: Kelelahan Mental Tim",
        speaker: "Maya",
        phaseType: "Leading",
        botPrompt:
          "Slogan lagi, jargon lagi... Mas, tim saya butuh kejelasan siapa yang harus dihubungi dan format apa yang dibuat, bukan ceramah motivasi 'spektakuler'. Kalau Mas nggak bisa kasih arahan konkret, saya lepas tangan aja!",
        replies: [
          {
            _key: "r2v_a",
            text: "Maafkan saya Maya, kamu benar. Mari kita berhenti pakai jargon. Buka papan tulis sekarang, kita bedah daftar tugas tim satu per satu secara riil.",
            valueType: {
              title: "Grounding (Hard Chunk Down)",
              description: "Membuang abstraksi dan langsung masuk ke meja kerja praktis.",
            },
            nextStageId: "s3_fragile",
            tensionEffect: -1,
            systemFeedback:
              "Koreksi cepat yang menyelamatkan tim dari keputusasaan birokrasi.",
          },
          {
            _key: "r2v_b",
            text: "Sebagai Head of Marketing kamu harusnya bisa mikir mandiri dong, jangan semua minta disuapi!",
            valueType: {
              title: "Blame & Abdication",
              description: "Membuang tanggung jawab pemimpin.",
            },
            nextStageId: "game_over",
            tensionEffect: 2,
            systemFeedback:
              "Kegagalan kepemimpinan total. Pemimpin menolak memandu dan menyalahkan bawahan atas kekaburan visi.",
          },
        ],
      },
      {
        id: "s3_optimal",
        stageId: "s3_optimal",
        title: "Babak 3: Alignment Total dari Visi ke Aksi",
        speaker: "Maya",
        phaseType: "Leading",
        botPrompt:
          "Brilian! Kita akan rilis 3 studi kasus keberhasilan klien enterprise bulan ini, dan tim media sosial fokus distribusikan itu via LinkedIn. Beban saya terasa terangkat 80%. Saya kumpulkan tim sekarang!",
        replies: [
          {
            _key: "r3o_a",
            text: "Luar biasa Maya. Sekarang timmu punya kompas yang jernih. Gas pol!",
            valueType: {
              title: "Inspiration & Release",
              description: "Melepas tim untuk mengeksekusi dengan percaya diri.",
            },
            nextStageId: "end_optimal",
            tensionEffect: -1,
            systemFeedback:
              "Kesenjangan abstraksi teratasi secara paripurna. Visi direksi dan aksi tim menyatu sempurna.",
          },
        ],
      },
      {
        id: "s3_fragile",
        stageId: "s3_fragile",
        title: "Babak 3: Eksekusi Terbimbing Kaku",
        speaker: "Maya",
        phaseType: "Leading",
        botPrompt:
          "Oke mas, saya ikuti daftar tugas teknis yang Mas berikan tadi. Tapi tolong jangan ubah-ubah lagi roadmap-nya di tengah jalan ya.",
        replies: [
          {
            _key: "r3f_a",
            text: "Siap, jalankan dulu yang ini.",
            valueType: {
              title: "Standard Operational Finish",
              description: "Penyelesaian operasional standar.",
            },
            nextStageId: "end_fragile",
            tensionEffect: 0,
            systemFeedback:
              "Tugas berjalan, namun Maya merasa menjadi robot pelaksana ketimbang pemikir strategis.",
          },
        ],
      },
      {
        id: "game_over",
        stageId: "game_over",
        title: "Titik Akhir (Walkout)",
        speaker: "Maya",
        phaseType: "Leading",
        botPrompt: "Silahkan cari Head of Marketing lain yang sesuai.",
        replies: []
      },
      {
        id: "end_optimal",
        stageId: "end_optimal",
        title: "Titik Akhir (Optimal)",
        speaker: "Maya",
        phaseType: "Leading",
        botPrompt: "Saya siap mengerjakan!",
        replies: []
      },
      {
        id: "end_fragile",
        stageId: "end_fragile",
        title: "Titik Akhir (Fragile)",
        speaker: "Maya",
        phaseType: "Leading",
        botPrompt: "Ya mas.",
        replies: []
      }
    ],
    diagnoses: [
      {
        conditionType: "game_over",
        title: "Disorientasi Organisasi (Paralysis by Vagueness)",
        headline: "Tenggelam dalam Jargon: Kematian Eksekusi Tim",
        harshTruth:
          "Maya menyerah dan tim marketing berjalan tanpa arah. Anggaran ratusan juta terbuang untuk konten yang tidak memberikan dampak bisnis nyata bagi perusahaan.\n\nDalam NLP, 'Chunking Mismatch' adalah penyebab utama 70% inisiatif strategis korporasi gagal. Direksi berbicara di level abstraksi tertinggi (Global Purpose / Chunk Up), sementara tim eksekutor hidup di level detail operasional (Banners / Chunk Down). Kegagalan seorang pemimpin adalah membiarkan dua dunia ini terputus, atau lebih buruk lagi: menuntut hasil tanpa pernah menjembatani tangga abstraksinya.",
      },
      {
        conditionType: "fragile",
        title: "Micromanagement Berlebihan (Trap of Detail)",
        headline: "Kejelasan Tercapai, Kemandirian Hilang",
        harshTruth:
          "Tim Anda kini tahu apa yang harus dikerjakan besok pagi, tetapi hanya karena Anda turun tangan mendikte setiap detail kecil pekerjaan mereka. Maya merasa dikebiri kapasitas strategisnya dan kini ragu mengambil keputusan sendiri.\n\nChunking Down yang terlalu agresif membunuh inisiatif. Seni NLP adalah menurunkan level abstraksi secukupnya hingga tim mendapatkan kejelasan arah (Clarity), lalu membiarkan mereka memiliki kebebasan taktis dalam mengeksekusi solusinya.",
      },
      {
        conditionType: "optimal",
        title: "Alignment Abstraksi Paripurna (The Strategic Bridge)",
        headline: "Menghubungkan Langit Visi dengan Bumi Realitas",
        harshTruth:
          "Anda mendemonstrasikan keahlian orkestrasi Chunking kelas master. Anda membantu Maya mendaki ke level 'Purpose' (Chunking Up) untuk memahami nilai repositioning brand, lalu dengan elegan menuntunnya menuruni tangga abstraksi menuju 2 metrik B2B terukur dan 1 aksi eksperimen mingguan (Chunking Down).\n\nTim lapangan tidak lagi merasa mengerjakan tugas membosankan, melainkan menyadari bahwa setiap postingan LinkedIn yang mereka rancang adalah batu bata dari ambisi besar perusahaan. Inilah esensi kepemimpinan inspiratif.",
      },
    ],
  },
};

async function seed() {
  const batches = await client.fetch(`*[_type == "batch"]{_id, title}`);
  const batchId = batches.find(b => b.title.includes("Partij 2"))?._id || batches[0]?._id;

  if (!batchId) {
    console.error("No batches found!");
    return;
  }

  function findValueTypeRef(mockTitle) {
    if (!mockTitle) return null;
    const lower = mockTitle.toLowerCase();
    if (lower.includes("generalization")) return "valueType-generalization";
    if (lower.includes("deletion")) return "valueType-deletion";
    if (lower.includes("distortion")) return "valueType-distortion";
    if (lower.includes("chunking down") || lower.includes("grounding") || lower.includes("operational")) return "590e3f5a-1335-48b9-a606-3c44b34ce4b6";
    if (lower.includes("chunking up") || lower.includes("cloud") || lower.includes("infinite") || lower.includes("inspiration")) return "393de655-dfc1-42cb-a941-24ee8153874f";
    if (lower.includes("open") || lower.includes("empathy") || lower.includes("empowerment") || lower.includes("pacing")) return "9d174567-d4e7-417a-ad76-48f34806e749";
    if (lower.includes("close") || lower.includes("rigid") || lower.includes("blame") || lower.includes("cold") || lower.includes("rejection")) return "302ddedc-2d8a-432e-bce5-b21bd805ec61";
    
    // fallback
    return "9d174567-d4e7-417a-ad76-48f34806e749";
  }

  for (const [key, mock] of Object.entries(MOCK_SCENARIOS)) {
    console.log(`Seeding scenario: ${mock.title}...`);
    
    // Create diagnoses first
    const diagRefs = [];
    for (const diag of mock.diagnoses) {
      const createdDiag = await client.create({
        _type: 'diagnosis',
        title: diag.title,
        headline: diag.headline,
        conditionType: diag.conditionType,
        harshTruth: diag.harshTruth
      });
      diagRefs.push({
        _key: `diag-${createdDiag._id}`,
        _type: 'reference',
        _ref: createdDiag._id
      });
    }

    // Map stages and their replies
    const stages = mock.stages.map(s => ({
      _key: s.id,
      _type: 'stage',
      title: s.title,
      speaker: s.speaker,
      phaseType: s.phaseType,
      botPrompt: s.botPrompt,
      replies: (s.replies || []).map((r, i) => ({
        _key: r._key || `reply-${Date.now()}-${i}`,
        _type: 'reply',
        text: r.text,
        tensionEffect: r.tensionEffect,
        systemFeedback: r.systemFeedback,
        valueType: r.valueType?.title ? { _type: 'reference', _ref: findValueTypeRef(r.valueType.title) } : undefined,
        nextStage: r.nextStageId, // Maps to the stage._key
      }))
    }));

    // Create scenario
    const scenarioData = {
      _type: 'scenario',
      title: mock.title,
      slug: { _type: 'slug', current: mock.slug },
      batch: { _type: 'reference', _ref: batchId },
      prologue: mock.prologue,
      mainQuest: `Complete the ${mock.title} scenario.`,
      initialTension: 1,
      maxTension: mock.maxTension,
      maxTensionTargetStage: "game_over",
      maxTensionDialogue: "Saya sudah muak dengan cara bicara Anda. Pembicaraan ini selesai!",
      stages: stages,
      diagnoses: diagRefs,
    };

    try {
      const res = await client.create(scenarioData);
      console.log(`Created scenario ${mock.title} with ID: ${res._id}`);
    } catch (e) {
      console.error(`Error creating scenario ${mock.title}:`, e);
    }
  }
}

seed();
