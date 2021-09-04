# Generated by Django 3.2.6 on 2021-08-23 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentik_core", "0027_bootstrap_token"),
    ]

    operations = [
        migrations.AlterField(
            model_name="token",
            name="intent",
            field=models.TextField(
                choices=[
                    ("verification", "Intent Verification"),
                    ("api", "Intent Api"),
                    ("recovery", "Intent Recovery"),
                    ("app_password", "Intent App Password"),
                ],
                default="verification",
            ),
        ),
    ]
