from django.db import models
from django.conf import settings

class Task(models.Model):
    title = models.CharField('Название', max_length=200)
    description = models.TextField('Описание')
    budget = models.DecimalField('Бюджет', max_digits=10, decimal_places=2)
    deadline = models.DateField('Срок выполнения')
    skills = models.JSONField('Навыки', default=list)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name='Автор'
    )

    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']
        verbose_name = 'Задание'
        verbose_name_plural = 'Задания'

    def __str__(self):
        return self.title