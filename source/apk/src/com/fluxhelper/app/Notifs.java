package com.fluxhelper.app;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.SystemClock;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Сповіщення про початок уроку: інтерфейс надсилає
 * {"on":true,"min":5,"items":[{"dow":1,"t":"08:30","n":"Алгебра"},...]}
 * (dow: 1 = понеділок ... 5 = п'ятниця). Плануємо EXACT-будильник на
 * (початок уроку - min хвилин); NotifReceiver показує сповіщення і
 * планує наступне. Так телефон повідомляє навіть коли застосунок закритий.
 */
public final class Notifs {

    static final String CH = "lesson";
    static final int REQ = 1001;
    static final int NID = 2001;

    private Notifs() {}

    static SharedPreferences p(Context c) {
        return c.getSharedPreferences("fh", Context.MODE_PRIVATE);
    }

    static void ensureChannel(Context c) {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;
            NotificationChannel ch = new NotificationChannel(CH, "Початок уроків",
                    NotificationManager.IMPORTANCE_DEFAULT);
            ch.setDescription("Сповіщення про початок уроку");
            nm.createNotificationChannel(ch);
        }
    }

    /** зберігає налаштування + перепланувує будильник */
    public static void handleJson(Context c, String json) {
        try {
            JSONObject o = new JSONObject(json == null ? "{}" : json);
            boolean on = o.optBoolean("on", false);
            int min = o.optInt("min", 5);
            if (min < 1 || min > 15) min = 5;   // слайдер у застосунку: 1..15 хв
            JSONArray items = o.optJSONArray("items");
            p(c).edit()
                .putBoolean("on", on)
                .putInt("min", min)
                .putString("items", items == null ? "[]" : items.toString())
                .apply();
            reschedule(c);
        } catch (Exception ignored) { }
    }

    /** знаходить наступний (день, урок, час-хв) і ставить будильник */
    public static void reschedule(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        Intent stub = new Intent(c, NotifReceiver.class);
        PendingIntent pe = PendingIntent.getBroadcast(c, REQ, stub,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        am.cancel(pe);

        SharedPreferences sp = p(c);
        if (!sp.getBoolean("on", false)) return;
        int min = sp.getInt("min", 5);
        try {
            JSONArray items = new JSONArray(sp.getString("items", "[]"));
            Calendar now = Calendar.getInstance();
            for (int off = 0; off < 8; off++) {
                Calendar d = (Calendar) now.clone();
                d.add(Calendar.DAY_OF_YEAR, off);
                int jdow = d.get(Calendar.DAY_OF_WEEK);      // 1 = нд ... 7 = сб
                int dow = ((jdow + 5) % 7) + 1;              // 1 = пн ... 7 = нд
                for (int i = 0; i < items.length(); i++) {
                    JSONObject it = items.optJSONObject(i);
                    if (it == null || it.optInt("dow", -1) != dow) continue;
                    String[] tm = it.optString("t", "").split(":");
                    if (tm.length < 2) continue;
                    int h, m;
                    try {
                        h = Integer.parseInt(tm[0].trim());
                        m = Integer.parseInt(tm[1].trim());
                    } catch (Exception ex) { continue; }
                    Calendar al = (Calendar) d.clone();
                    al.set(Calendar.HOUR_OF_DAY, h);
                    al.set(Calendar.MINUTE, m);
                    al.set(Calendar.SECOND, 0);
                    al.set(Calendar.MILLISECOND, 0);
                    long at = al.getTimeInMillis() - min * 60000L;
                    if (at <= System.currentTimeMillis()) continue;

                    Intent i2 = new Intent(c, NotifReceiver.class);
                    i2.putExtra("name", it.optString("n", "Урок"));
                    i2.putExtra("time", it.optString("t", ""));
                    i2.putExtra("min", min);
                    PendingIntent pe2 = PendingIntent.getBroadcast(c, REQ, i2,
                            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                    // setAlarmClock — найнадійніший канал будильника Android:
                    // спрацьовує навіть у doze на Xiaomi/Huawei і не потребує
                    // дозволу SCHEDULE_EXACT_ALARM. Fallback — exact/inexact.
                    try {
                        Intent openApp = new Intent(c, MainActivity.class);
                        openApp.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                        PendingIntent piOpen = PendingIntent.getActivity(c, 7, openApp,
                                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                        am.setAlarmClock(new AlarmManager.AlarmClockInfo(at, piOpen), pe2);
                    } catch (Exception ex) {
                        try {
                            am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pe2);
                        } catch (SecurityException ex2) {
                            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pe2);
                        }
                    }
                    return;
                }
            }
        } catch (Exception ignored) { }
    }

    /** показує сповіщення "скоро почнеться урок".
     *  ХВИЛИНИ РАХУЄМО В МОМЕНТ ПОКАЗУ (а не при плануванні!):
     *  якщо будильник спрацював пізніше/раніше — у тексті справжні хвилини. */
    public static void show(Context c, String name, String time, int min) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        if (Build.VERSION.SDK_INT >= 24 && !nm.areNotificationsEnabled()) return;
        int delta = min;
        try {
            String[] tm = time.split(":");
            int hm = Integer.parseInt(tm[0].trim()) * 60 + Integer.parseInt(tm[1].trim());
            Calendar now = Calendar.getInstance();
            delta = hm - (now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE));
        } catch (Exception ignored) { }
        if (delta < 0) delta = 0;
        String when = (delta == 0) ? "починається зараз" : ("через " + delta + " хв");
        Notification.Builder b = (Build.VERSION.SDK_INT >= 26)
                ? new Notification.Builder(c, CH)
                : new Notification.Builder(c);
        b.setSmallIcon(R.drawable.ic_notif)
         .setContentTitle("🔔 Скоро почнеться урок")
         .setContentText(name + " о " + time + " — " + when)
         .setStyle(new Notification.BigTextStyle().bigText(
                 name + " починається о " + time + "\n" + when + " ⏰"))
         .setAutoCancel(true);
        Intent i = new Intent(c, MainActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        b.setContentIntent(PendingIntent.getActivity(c, 7, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
        try { nm.notify(NID, b.build()); } catch (Exception ignored) { }
        logNotif(c, name, time);   // журнал: інтерфейс покаже «прийшло о HH:MM»
    }

    // ================================================= журнал сповіщень
    /** додає запис у журнал (SharedPreferences, останні 30) — JS читає через
     *  AndroidHost.getNotifLog() і показує у застосунку з часом отримання. */
    private static void logNotif(Context c, String name, String time) {
        try {
            org.json.JSONArray arr = new org.json.JSONArray(p(c).getString("notiflog", "[]"));
            org.json.JSONObject o = new org.json.JSONObject();
            o.put("ts", System.currentTimeMillis());
            o.put("n", name == null || name.length() == 0 ? "Урок" : name);
            o.put("s", time == null ? "" : time);
            org.json.JSONArray out = new org.json.JSONArray();
            out.put(o);
            for (int i = 0; i < arr.length() && i < 29; i++) out.put(arr.get(i));
            p(c).edit().putString("notiflog", out.toString()).apply();
        } catch (Exception ignored) { }
    }

    /** увесь журнал для JS */
    public static String getLog(Context c) {
        return p(c).getString("notiflog", "[]");
    }

    /**
     * Тестове сповіщення з режиму розробника: показуємо СРАЗУ довільний
     * заголовок/текст — той самий канал, що й для звичайних сповіщень.
     */
    public static void showNow(Context c, String title, String text) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        if (Build.VERSION.SDK_INT >= 24 && !nm.areNotificationsEnabled()) return;
        Notification.Builder b = (Build.VERSION.SDK_INT >= 26)
                ? new Notification.Builder(c, CH)
                : new Notification.Builder(c);
        b.setSmallIcon(R.drawable.ic_notif)
         .setContentTitle(title == null || title.length() == 0 ? "FluxHelper" : title)
         .setContentText(text == null ? "" : text)
         .setStyle(new Notification.BigTextStyle().bigText(text == null ? "" : text))
         .setAutoCancel(true);
        Intent i = new Intent(c, MainActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        b.setContentIntent(PendingIntent.getActivity(c, 7, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
        try { nm.notify(NID + 1, b.build()); } catch (Exception ignored) { }
    }
}
