from celery import Celery
from core.config import settings

celery_app = Celery(
    "worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.task_routes = {"worker.tasks.*": "main-queue"}
celery_app.conf.update(task_track_started=True)
