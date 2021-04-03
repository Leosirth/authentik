import { gettext } from "django";
import { customElement, html, property, TemplateResult } from "lit-element";
import { AKResponse } from "../../api/Client";
import { Table, TableColumn } from "../../elements/table/Table";
import { PoliciesApi, PolicyBinding } from "authentik-api";

import "../../elements/forms/DeleteForm";
import "../../elements/Tabs";
import "../../elements/forms/ProxyForm";
import "../../elements/buttons/SpinnerButton";
import "../../elements/buttons/Dropdown";
import { until } from "lit-html/directives/until";
import { PAGE_SIZE } from "../../constants";
import { DEFAULT_CONFIG } from "../../api/Config";

import "../../elements/forms/ModalForm";
import "../groups/GroupForm";
import "../users/UserForm";
import "./PolicyBindingForm";
import { ifDefined } from "lit-html/directives/if-defined";

@customElement("ak-bound-policies-list")
export class BoundPoliciesList extends Table<PolicyBinding> {
    @property()
    target?: string;

    apiEndpoint(page: number): Promise<AKResponse<PolicyBinding>> {
        return new PoliciesApi(DEFAULT_CONFIG).policiesBindingsList({
            target: this.target || "",
            ordering: "order",
            page: page,
            pageSize: PAGE_SIZE,
        });
    }

    columns(): TableColumn[] {
        return [
            new TableColumn("Policy / User / Group"),
            new TableColumn("Enabled", "enabled"),
            new TableColumn("Order", "order"),
            new TableColumn("Timeout", "timeout"),
            new TableColumn(""),
        ];
    }

    getPolicyUserGroupRow(item: PolicyBinding): string {
        if (item.policy) {
            return gettext(`Policy ${item.policyObj?.name}`);
        } else if (item.group) {
            return gettext(`Group ${item.groupObj?.name}`);
        } else if (item.user) {
            return gettext(`User ${item.userObj?.name}`);
        } else {
            return gettext("");
        }
    }

    getObjectEditButton(item: PolicyBinding): TemplateResult {
        if (item.policy) {
            return html`
            <ak-forms-modal>
                <span slot="submit">
                    ${gettext("Update")}
                </span>
                <span slot="header">
                    ${gettext(`Update ${item.policyObj?.name}`)}
                </span>
                <ak-proxy-form
                    slot="form"
                    .args=${{
                        "policyUUID": item.pk
                    }}
                    type=${ifDefined(item.policyObj?.component)}>
                </ak-proxy-form>
                <button slot="trigger" class="pf-c-button pf-m-secondary">
                    ${gettext("Edit")}
                </button>
            </ak-forms-modal>`;
        } else if (item.group) {
            return html`<ak-forms-modal>
                <span slot="submit">
                    ${gettext("Update")}
                </span>
                <span slot="header">
                    ${gettext("Update Group")}
                </span>
                <ak-group-form slot="form" .group=${item.groupObj}>
                </ak-group-form>
                <button slot="trigger" class="pf-c-button pf-m-primary">
                    ${gettext("Edit Group")}
                </button>
            </ak-forms-modal>`;
        } else if (item.user) {
            return html`<ak-forms-modal>
                <span slot="submit">
                    ${gettext("Update")}
                </span>
                <span slot="header">
                    ${gettext("Update User")}
                </span>
                <ak-user-form slot="form" .user=${item.userObj}>
                </ak-user-form>
                <button slot="trigger" class="pf-m-secondary pf-c-button">
                    ${gettext("Edit")}
                </button>
            </ak-forms-modal>`;
        } else {
            return html``;
        }
    }

    row(item: PolicyBinding): TemplateResult[] {
        return [
            html`${this.getPolicyUserGroupRow(item)}`,
            html`${item.enabled ? "Yes" : "No"}`,
            html`${item.order}`,
            html`${item.timeout}`,
            html`
            ${this.getObjectEditButton(item)}
            <ak-forms-modal>
                <span slot="submit">
                    ${gettext("Update")}
                </span>
                <span slot="header">
                    ${gettext("Update Binding")}
                </span>
                <ak-policy-binding-form slot="form" .binding=${item} targetPk=${ifDefined(this.target)}>
                </ak-policy-binding-form>
                <button slot="trigger" class="pf-c-button pf-m-secondary">
                    ${gettext("Edit Binding")}
                </button>
            </ak-forms-modal>
            <ak-forms-delete
                .obj=${item}
                objectLabel=${gettext("Policy binding")}
                .delete=${() => {
                    return new PoliciesApi(DEFAULT_CONFIG).policiesBindingsDelete({
                        policyBindingUuid: item.pk || "",
                    });
                }}>
                <button slot="trigger" class="pf-c-button pf-m-danger">
                    ${gettext("Delete Binding")}
                </button>
            </ak-forms-delete>`,
        ];
    }

    renderEmpty(): TemplateResult {
        return super.renderEmpty(html`<ak-empty-state header=${gettext("No Policies bound.")} icon="pf-icon-module">
            <div slot="body">
                ${gettext("No policies are currently bound to this object.")}
            </div>
            <div slot="primary">
                <ak-forms-modal>
                    <span slot="submit">
                        ${gettext("Create")}
                    </span>
                    <span slot="header">
                        ${gettext("Create Binding")}
                    </span>
                    <ak-policy-binding-form slot="form" targetPk=${ifDefined(this.target)}>
                    </ak-policy-binding-form>
                    <button slot="trigger" class="pf-c-button pf-m-primary">
                        ${gettext("Create Binding")}
                    </button>
                </ak-forms-modal>
            </div>
        </ak-empty-state>`);
    }

    renderToolbar(): TemplateResult {
        return html`
        <ak-dropdown class="pf-c-dropdown">
            <button class="pf-m-primary pf-c-dropdown__toggle" type="button">
                <span class="pf-c-dropdown__toggle-text">${gettext("Create Policy")}</span>
                <i class="fas fa-caret-down pf-c-dropdown__toggle-icon" aria-hidden="true"></i>
            </button>
            <ul class="pf-c-dropdown__menu" hidden>
                ${until(new PoliciesApi(DEFAULT_CONFIG).policiesAllTypes().then((types) => {
                    return types.map((type) => {
                        return html`<li>
                            <ak-forms-modal>
                                <span slot="submit">
                                    ${gettext("Create")}
                                </span>
                                <span slot="header">
                                    ${gettext(`Create ${type.name}`)}
                                </span>
                                <ak-proxy-form
                                    slot="form"
                                    type=${type.component}>
                                </ak-proxy-form>
                                <button slot="trigger" class="pf-c-dropdown__menu-item">
                                    ${type.name}<br>
                                    <small>${type.description}</small>
                                </button>
                            </ak-forms-modal>
                        </li>`;
                    });
                }), html`<ak-spinner></ak-spinner>`)}
            </ul>
        </ak-dropdown>
        <ak-forms-modal>
            <span slot="submit">
                ${gettext("Create")}
            </span>
            <span slot="header">
                ${gettext("Create Binding")}
            </span>
            <ak-policy-binding-form slot="form" targetPk=${ifDefined(this.target)}>
            </ak-policy-binding-form>
            <button slot="trigger" class="pf-c-button pf-m-primary">
                ${gettext("Create Binding")}
            </button>
        </ak-forms-modal>
        ${super.renderToolbar()}
        `;
    }
}