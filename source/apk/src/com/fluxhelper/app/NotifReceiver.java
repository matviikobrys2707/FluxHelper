package com.fluxhelper.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Будильник спрацював -> показуємо сповіщення і плануємо наступне. */
public class NotifReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Notifs.ensureChannel(context);
        Notifs.show(context,
                intent.getStringExtra("name"),
                intent.getStringExtra("time"),
                intent.getIntExtra("min", 5));
        Notifs.reschedule(context);
    }
}
