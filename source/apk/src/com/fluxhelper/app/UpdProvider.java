package com.fluxhelper.app;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;

import java.io.File;
import java.io.FileNotFoundException;

/**
 * Видає завантажений APK-оновлення системному інсталятору.
 * Без androidx FileProvider — мінімальний власний ContentProvider:
 *   content://com.fluxhelper.app.upd/apk -> files/update/update.apk
 * Той самий механізм, що і FileProvider, але без зовнішніх бібліотек.
 */
public class UpdProvider extends ContentProvider {
    public static final String AUTHORITY = "com.fluxhelper.app.upd";

    @Override
    public boolean onCreate() {
        return true;
    }

    private File apkFile() {
        return new File(getContext().getExternalFilesDir(null), "update/update.apk");
    }

    @Override
    public String getType(Uri uri) {
        return "application/vnd.android.package-archive";
    }

    @Override
    public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        File f = apkFile();
        if (!f.exists()) throw new FileNotFoundException("update apk not ready");
        return ParcelFileDescriptor.open(f, ParcelFileDescriptor.MODE_READ_ONLY);
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String sel, String[] args, String sort) {
        if (projection == null) {
            projection = new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE};
        }
        MatrixCursor c = new MatrixCursor(projection);
        File f = apkFile();
        Object[] row = new Object[projection.length];
        for (int i = 0; i < projection.length; i++) {
            if (OpenableColumns.DISPLAY_NAME.equals(projection[i])) row[i] = "FluxHelper-update.apk";
            else if (OpenableColumns.SIZE.equals(projection[i])) row[i] = f.exists() ? f.length() : 0L;
            else row[i] = null;
        }
        c.addRow(row);
        return c;
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) { return null; }

    @Override
    public int delete(Uri uri, String sel, String[] args) { return 0; }

    @Override
    public int update(Uri uri, ContentValues values, String sel, String[] args) { return 0; }
}
