import axios from 'axios';

export const LogOut = async () => {
    try {
        await axios.post('/api/logout'); // Logout endpoint'ine istek gönder
        // Başarılı çıkış durumunda herhangi bir ek işlem yapılabilir
    } catch (error) {
        console.error("Çıkış işlemi sırasında hata oluştu:", error);
        throw error; // Hata durumunda yukarıya ilet
    }
};