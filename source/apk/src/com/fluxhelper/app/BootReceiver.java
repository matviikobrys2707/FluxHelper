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
        if (a != null && a.equals(Intent.ACTION_BOOT_COMPLETED)) {
            Notifs.ensureChannel(context);
            Notifs.reschedule(context);
        }
    }
}
