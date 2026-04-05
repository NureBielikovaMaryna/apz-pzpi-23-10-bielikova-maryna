//Запити до Штучного Інтелекту:
//1. Я вивчаю патерни проєктування за книгою GoF і шукаю вдалу тему для доповіді. Підкажи, які структурні патерни (крім Singleton) є найбільш наочними для демонстрації в презентації? Допоможи також коротко структурувати загальну класифікацію GoF
//2. Я зупинила свій вибір на патерні Adapter. Допоможи мені більш професійно сформулювати його основне призначення та область застосування. Також мені потрібно виділити чіткий перелік переваг та недоліків, щоб обґрунтувати, у яких реальних ситуаціях його використання буде найбільш доцільним.
//3. Я пишу приклад коду на Java для демонстрації роботи Адаптера (моделюю підключення старого MicroUSB-пристрою до USB-інтерфейсу). Допоможи мені правильно розподілити ролі між класами Client, Target та Adaptee. Крім того, хочу перевірити свою логіку для UML-діаграми: чи правильно я розумію, що для Об'єктного Адаптера потрібно використовувати агрегацію замість успадкування?

// Target
public interface UsbDevice {
    void connectWithUsbCable();
}

// Adaptee
public class OldMicroUsbDevice {
    public void plugInMicroUsb() {
        System.out.println("Підключено через застарілий кабель MicroUSB.");
    }
}

// Adapter
public class MicroUsbToUsbAdapter implements UsbDevice {
    private OldMicroUsbDevice oldDevice; // Посилання на Adaptee

    public MicroUsbToUsbAdapter(OldMicroUsbDevice oldDevice) {
        this.oldDevice = oldDevice;
    }

    @Override
    public void connectWithUsbCable() {
        // Адаптація виклику
        System.out.println("Адаптер перетворює сигнал USB на MicroUSB...");
        oldDevice.plugInMicroUsb();
    }
}

// Client
public class Main {
    public static void main(String[] args) {
        // 1. Створюємо старий пристрій (Службу)
        OldMicroUsbDevice oldPhone = new OldMicroUsbDevice();

        // 2. Створюємо Адаптер, передаючи йому старий пристрій
        UsbDevice adapter = new MicroUsbToUsbAdapter(oldPhone);

        // 3. Клієнт використовує цільовий інтерфейс
        System.out.println("Клієнт: Підключаю пристрій по USB...");
        adapter.connectWithUsbCable();
    }
}

