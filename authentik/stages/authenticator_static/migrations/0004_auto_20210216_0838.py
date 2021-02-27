# Generated by Django 3.1.6 on 2021-02-16 08:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("authentik_flows", "0016_auto_20201202_1307"),
        ("authentik_stages_authenticator_static", "0003_default_setup_flow"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="OTPStaticStage",
            new_name="AuthenticatorStaticStage",
        ),
        migrations.AlterModelOptions(
            name="authenticatorstaticstage",
            options={
                "verbose_name": "Static Authenticator Stage",
                "verbose_name_plural": "Static Authenticator Stages",
            },
        ),
    ]