import eslintPluginTailwindcss from "eslint-plugin-tailwindcss";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. جلب الإعدادات الموصى بها تلقائياً
  ...(eslintPluginTailwindcss.configs["flat/recommended"] || []),

  // 2. ربط ملف الـ CSS والـ Rules بالطريقة الصحيحة لـ v4
  {
    plugins: {
      tailwindcss: eslintPluginTailwindcss,
    },
    settings: {
      tailwindcss: {
        // تأكد من أن هذا هو مسار ملف الـ CSS الخاص بمشروعك (الموجود في مجلد src/index.css)
        cssConfigPath: "./src/index.css",
      },
    },
    rules: {
      // الاسم الرسمي الصحيح المعتمد في الحزمة لـ Tailwind v4 (بالمفرد)
      "tailwindcss/enforces-canonical-classname": "warn",
    },
  },
]);
