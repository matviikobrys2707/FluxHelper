package com.fluxhelper.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Після перезавантаження телефону відновлюємо будильник сповіщень. */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String a = intent.getAction();
        // перезавантаження, зміна часу/таймзони, оновлення застосунку —
        // в усіх цих випадках плануємо наступний будильник заново
        boolean hit = Intent.ACTION_BOOT_COMPLETED.equals(a)
                || "android.intent.action.TIME_SET".equals(a)
                || "android.intent.action.TIMEZONE_CHANGED".equals(a)
                || "android.intent.action.MY_PACKAGE_REPLACED".equals(a);
        if (hit) {
            Notifs.ensureChannel(context);
            Notifs.reschedule(context);
        }
    }
}
