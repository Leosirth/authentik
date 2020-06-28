"""passbook flow signals"""
from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver
from structlog import get_logger

LOGGER = get_logger()


def delete_cache_prefix(prefix: str) -> int:
    """Delete keys prefixed with `prefix` and return count of deleted keys."""
    keys = cache.keys(prefix)
    cache.delete_many(keys)
    return len(keys)

@receiver(post_save)
# pylint: disable=unused-argument
def invalidate_flow_cache(sender, instance, **_):
    """Invalidate flow cache when flow is updated"""
    from passbook.flows.models import Flow, FlowStageBinding, Stage
    from passbook.flows.planner import cache_key

    if isinstance(instance, Flow):
        total = delete_cache_prefix(f"{cache_key(instance)}*")
        LOGGER.debug("Invalidating Flow cache", flow=instance, len=total)
    if isinstance(instance, FlowStageBinding):
        total = delete_cache_prefix(f"{cache_key(instance.flow)}*")
        LOGGER.debug("Invalidating Flow cache from FlowStageBinding", binding=instance, len=total)
    if isinstance(instance, Stage):
        total = 0
        for binding in FlowStageBinding.objects.filter(stage=instance):
            prefix = cache_key(binding.flow)
            total += delete_cache_prefix(f"{prefix}*")
        LOGGER.debug("Invalidating Flow cache from Stage", stage=instance, len=total)
