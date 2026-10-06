// Мінімальна заглушка EventToken.h (є у Windows SDK, відсутня у MinGW)
#pragma once

typedef struct EventRegistrationToken {
    __int64 value;
} EventRegistrationToken;
