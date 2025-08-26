# 1. استخدم صورة جاهزة للـ Playwright (Node + Chromium + Firefox + WebKit)
FROM mcr.microsoft.com/playwright:focal

# 2. إعداد مجلد العمل داخل الحاوية
WORKDIR /app

# 3. نسخ ملفات المشروع الأساسية أولاً (package.json + package-lock.json)
COPY package*.json ./

# 4. تثبيت مكتبات Node dependencies
RUN npm install

# 5. نسخ بقية ملفات المشروع
COPY . .

# 6. ضبط متغير البيئة (اختياري)
ENV NODE_ENV=production

# 7. أمر تشغيل البوت
CMD ["node", "index.js"]
