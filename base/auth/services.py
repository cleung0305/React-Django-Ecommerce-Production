from typing import Tuple

from django.db import transaction
from django.conf import settings
from django.core.exceptions import ValidationError

from django.contrib.auth.models import User

def google_validate_aud(aud) -> bool:
    if aud != settings.GOOGLE_AUTH_CLIENT_ID:
        raise ValidationError('Invalid audience')
    return True

#return the user if user exist, otherwise create new user
def user_get_or_create(*, email: str, **extra_data) -> Tuple[User, bool]:
    user = User.objects.filter(email=email).first()

    if user:
        return user, False
    else:
        user = User(email=email, **extra_data)
        user.set_unusable_password()
        user.save()
        return user, True