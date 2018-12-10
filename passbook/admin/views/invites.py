"""passbook Invite administration"""
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse_lazy
from django.utils.translation import ugettext as _
from django.views.generic import CreateView, DeleteView, ListView, UpdateView

from passbook.admin.mixins import AdminRequiredMixin
from passbook.core.forms.invites import InviteForm
from passbook.core.models import Invite


class InviteListView(AdminRequiredMixin, ListView):
    """Show list of all invites"""

    model = Invite
    template_name = 'administration/invite/list.html'


class InviteCreateView(SuccessMessageMixin, AdminRequiredMixin, CreateView):
    """Create new Invite"""

    template_name = 'generic/create.html'
    success_url = reverse_lazy('passbook_admin:invites')
    success_message = _('Successfully created Invite')
    form_class = InviteForm


class InviteUpdateView(SuccessMessageMixin, AdminRequiredMixin, UpdateView):
    """Update invite"""

    model = Invite
    template_name = 'generic/update.html'
    success_url = reverse_lazy('passbook_admin:invites')
    success_message = _('Successfully updated Invite')
    form_class = InviteForm

class InviteDeleteView(SuccessMessageMixin, AdminRequiredMixin, DeleteView):
    """Delete invite"""

    model = Invite
    template_name = 'generic/delete.html'
    success_url = reverse_lazy('passbook_admin:invites')
    success_message = _('Successfully updated Invite')
