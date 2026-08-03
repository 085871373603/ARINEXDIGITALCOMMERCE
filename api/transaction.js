const axios = require('axios');
const crypto = require('crypto');

export default async function handler(req, res) {
    // Mengizinkan akses (CORS) agar HTML Kakak tidak diblokir
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Menangani request pre-flight dari browser
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Pastikan metode yang masuk adalah POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Hanya menerima request POST' });
    }

    // Menangkap data yang dikirim dari HTML Kakak
    const { buyer_sku_code, customer_no, ref_id } = req.body;

// Kredensial Digiflazz (Aman di dalam Server)
const username = "jecedogOq0PD";
const apiKey = "dev-ce95aa90-8ee0-11f1-85c2-5dfa23426c1"; 


    // Membuat MD5 Signature (Tanda Tangan Keamanan)
    const signString = username + apiKey + ref_id;
    const signHash = crypto.createHash('md5').update(signString).digest('hex');

    // Menyusun paket data untuk dikirim ke Digiflazz
    const payload = {
        username: username,
        buyer_sku_code: buyer_sku_code,
        customer_no: customer_no,
        ref_id: ref_id,
        sign: signHash,
        testing: true // Mode Development
    };

    try {
        // Mengirim request ke Digiflazz
        const digiflazzResponse = await axios.post('https://api.digiflazz.com/v1/transaction', payload);
        
        // Mengembalikan jawaban Digiflazz ke HTML Kakak
        res.status(200).json(digiflazzResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.response ? error.response.data : { error: 'Gagal terhubung ke server Digiflazz' });
    }
}
