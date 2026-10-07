// ============================================================
//  FluxHelper — єдине джерело версії (exe-ресурси + інтерфейс).
//  Змінюєш ТІЛЬКИ ТУТ і перезбираєш: app.rc (VERSIONINFO у
//  властивостях файлу Windows) і APP_VER в інтерфейсі беруться звідси.
//  Build.bat читає звідси поточну версію і пропонує наступну.
//  УВАГА: Blazix — це ім'я АВТОРА (видавець), а не програми!
// ============================================================
#ifndef FH_VERSION_H
#define FH_VERSION_H

#define FH_VER_MAJ 1
#define FH_VER_MIN 9
#define FH_VER_PAT 0

#define FH_STRINGIFY_(x) #x
#define FH_STRINGIFY(x)  FH_STRINGIFY_(x)
#define FH_VER_STR FH_STRINGIFY(FH_VER_MAJ) "." FH_STRINGIFY(FH_VER_MIN) "." FH_STRINGIFY(FH_VER_PAT)

// видавець (автор), який показує Windows у властивостях файлу
#define FH_PUBLISHER "Blazix"
// назва програми БЕЗ пробілів (ім'я exe, ProductName, InternalName)
#define FH_PRODUCT   "FluxHelper"
// FileDescription у властивостях файлу (ASCII — llvm-rc добре його переносить)
#define FH_DESC      "FluxHelper"

#endif
