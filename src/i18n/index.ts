import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// นำเข้าไฟล์ภาษา
import translationTH from './locales/th/translation.json';
import translationEN from './locales/en/translation.json';
import translationJP from './locales/jp/translation.json';

// ทรัพยากรภาษาที่รองรับ
const resources = {
  th: {
    translation: translationTH
  },
  en: {
    translation: translationEN
  },
  jp: {
    translation: translationJP
  }
};

// ตรวจสอบภาษาที่บันทึกไว้ใน localStorage
let savedLanguage = 'th'; // ค่าเริ่มต้นเป็นภาษาไทย
try {
  const storedLanguage = localStorage.getItem('preferred-language');
  if (storedLanguage) {
    savedLanguage = storedLanguage;
  }
} catch (error) {
  console.error('Failed to access localStorage:', error);
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,  // ใช้ภาษาที่บันทึกไว้
    fallbackLng: 'en',  // ภาษาสำรองเมื่อไม่พบคำแปล
    interpolation: {
      escapeValue: false  // ไม่ต้อง escape ค่า HTML
    }
  });

// เมื่อมีการเปลี่ยนภาษา ให้บันทึกลงใน localStorage
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('preferred-language', lng);
  } catch (error) {
    console.error('Failed to save language to localStorage:', error);
  }
});

export default i18n; 