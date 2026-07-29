export const DAILY_PROMPTS = [
  "Apa satu hal kecil hari ini yang diam-diam kamu syukuri?",
  "Kapan terakhir kali kamu merasa benar-benar damai?",
  "Ceritakan tentang seseorang yang selalu membuatmu tersenyum.",
  "Apa pelajaran terbesar yang kamu dapatkan dari sebuah kesalahan baru-baru ini?",
  "Jika hari ini adalah sebuah lagu, lagu apakah itu dan mengapa?",
  "Apa ketakutan terbesarmu saat ini, dan bagaimana kamu menghadapinya?",
  "Sebutkan tiga hal yang membuatmu merasa bangga pada dirimu sendiri.",
  "Apa satu kebiasaan buruk yang ingin kamu tinggalkan, dan mengapa?",
  "Bagaimana perasaanmu tentang tempatmu berada dalam hidup saat ini?",
  "Tuliskan surat singkat untuk dirimu di masa lalu.",
  "Apa mimpimu yang belum terwujud, dan apa langkah kecil untuk mencapainya?",
  "Ceritakan sebuah memori masa kecil yang paling membekas di hatimu.",
  "Hal apa yang paling sering membuatmu cemas, dan apakah itu benar-benar terjadi?",
  "Siapa orang yang paling kamu rindukan hari ini, dan apa yang ingin kamu sampaikan padanya?",
  "Apa satu hal yang ingin kamu pelajari atau kuasai di masa depan?"
];

export const getRandomPrompt = () => {
  return DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)];
};
