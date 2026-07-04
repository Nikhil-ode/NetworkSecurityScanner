"""Django project initialization"""

def __getattr__(name):
    if name == 'celery_app':
        from .celery import app
        return app
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

__all__ = ('celery_app',)
