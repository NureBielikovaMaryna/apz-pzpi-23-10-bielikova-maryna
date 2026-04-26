import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "please_login": "Login to System",
          "registration_title": "Create Account",
          "login_btn": "Sign In",
          "register_btn": "Register",
          "no_account": "No account? Register now",
          "already_account": "Have an account? Login",
          "admin_panel": "Admin Panel",
          "user_panel": "Dashboard",
          "logout": "Logout",
          "train_schedule": "Schedule",
          "train_number": "Bus #",
          "delay": "Status",
          "my_history": "History",
          "user_name": "Name",
          "email": "Email",
          "password": "Password",
          "refresh_btn": "Refresh",
          "stops": "Stops",
          "arrival": "Arr.",
          "departure": "Dep.",
          "on_time": "On time",
          "min": "min",
          "add_train": "Add Bus",
          "export_json": "Export JSON",
          "stations_tab": "Stations",
          "system_tab": "System",
          "actions": "Actions",
          "create_station_title": "New Station",
          "add_btn": "Add",
          "edit": "Edit",
          "delete": "Delete",
          "save": "Save",
          "order": "Order"
        }
      },
      ua: {
        translation: {
          "please_login": "Вхід у систему",
          "registration_title": "Створення акаунта",
          "login_btn": "Увійти",
          "register_btn": "Зареєструватися",
          "no_account": "Немає акаунта? Реєстрація",
          "already_account": "Є акаунт? Увійти",
          "admin_panel": "Адмін-панель",
          "user_panel": "Кабінет",
          "logout": "Вихід",
          "train_schedule": "Розклад",
          "train_number": "№ Автобуса",
          "delay": "Статус",
          "my_history": "Історія",
          "user_name": "Ім'я",
          "email": "Email",
          "password": "Пароль",
          "refresh_btn": "Оновити",
          "stops": "Зупинки",
          "arrival": "Приб.",
          "departure": "Відпр.",
          "on_time": "Вчасно",
          "min": "хв",
          "add_train": "Додати автобус",
          "export_json": "Експорт JSON",
          "stations_tab": "Станції",
          "system_tab": "Система",
          "actions": "Дії",
          "create_station_title": "Нова станція",
          "add_btn": "Додати",
          "edit": "Редагувати",
          "delete": "Видалити",
          "save": "Зберегти",
          "order": "№"
        }
      }
    },
    lng: "ua", 
    fallbackLng: "en"
  });

export default i18n;