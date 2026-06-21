// Generate slug dari teks: huruf kecil, ganti spasi dengan strip,
// tambahkan suffix acak agar unik.
const slugify = (text) => {
  const base = String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // buang karakter non-alfanumerik
    .replace(/\s+/g, '-')          // spasi -> strip
    .replace(/-+/g, '-');          // strip ganda -> satu
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
};

module.exports = { slugify };
