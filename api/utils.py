from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Custom cookie session authentication to remove csrf requirement
    """

    def enforce_csrf(self, request):
        return
