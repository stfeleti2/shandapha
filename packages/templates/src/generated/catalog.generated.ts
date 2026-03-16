import {
  assertTemplateManifest,
  type FrameworkAdapterId,
  type TemplateManifest,
} from "@shandapha/contracts";
import AuthForgotManifest from "../../catalog/auth/forgot/template.json";
import AuthResetManifest from "../../catalog/auth/reset/template.json";
import AuthSignInManifest from "../../catalog/auth/sign-in/template.json";
import AuthSignUpManifest from "../../catalog/auth/sign-up/template.json";
import BillingPlansStarterManifest from "../../catalog/billing-plans-starter/template.json";
import BlogArticleManifest from "../../catalog/blog-article/template.json";
import BlogIndexManifest from "../../catalog/blog-index/template.json";
import ChangelogManifest from "../../catalog/changelog/template.json";
import ContactManifest from "../../catalog/contact/template.json";
import DashboardHomeManifest from "../../catalog/dashboard-home/template.json";
import DetailTabsTimelineManifest from "../../catalog/detail-tabs-timeline/template.json";
import DocsArticleManifest from "../../catalog/docs-article/template.json";
import DocsHomeManifest from "../../catalog/docs-home/template.json";
import FaqManifest from "../../catalog/faq/template.json";
import FormCreateEditManifest from "../../catalog/form-create-edit/template.json";
import LandingSectionBasedManifest from "../../catalog/landing-section-based/template.json";
import LegalLayoutManifest from "../../catalog/legal-layout/template.json";
import ListFiltersManifest from "../../catalog/list-filters/template.json";
import Onboarding3StepManifest from "../../catalog/onboarding-3-step/template.json";
import PricingBasicManifest from "../../catalog/pricing-basic/template.json";
import SettingsSectionedManifest from "../../catalog/settings-sectioned/template.json";
import TeamRolesStarterManifest from "../../catalog/team-roles-starter/template.json";

export interface TemplateAssetBundle {
  slug: string;
  manifest: TemplateManifest;
  rootDir: string;
  readmePath: string;
  previewPath: string;
  files: Record<FrameworkAdapterId, string[]>;
  states: string[];
  variants: string[];
  samples: string[];
}

export const templateCatalog: TemplateAssetBundle[] = [
  {
    slug: "dashboard-home",
    manifest: assertTemplateManifest(DashboardHomeManifest),
    rootDir: "catalog/dashboard-home",
    readmePath: "catalog/dashboard-home/README.md",
    previewPath: "catalog/dashboard-home/preview.md",
    files: {
      "react-vite": ["catalog/dashboard-home/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/dashboard-home/files/next-app-router/page.tsx",
      ],
      "wc-universal": ["catalog/dashboard-home/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/dashboard-home/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/dashboard-home/states/loading.json",
      "catalog/dashboard-home/states/empty.json",
      "catalog/dashboard-home/states/error.json",
      "catalog/dashboard-home/states/success.json",
      "catalog/dashboard-home/states/no-access.json",
    ],
    variants: [
      "catalog/dashboard-home/variants/executive.json",
      "catalog/dashboard-home/variants/ops.json",
      "catalog/dashboard-home/variants/support.json",
    ],
    samples: [
      "catalog/dashboard-home/samples/workspace-summary.json",
      "catalog/dashboard-home/samples/usage-timeseries.json",
    ],
  },
  {
    slug: "list-filters",
    manifest: assertTemplateManifest(ListFiltersManifest),
    rootDir: "catalog/list-filters",
    readmePath: "catalog/list-filters/README.md",
    previewPath: "catalog/list-filters/preview.md",
    files: {
      "react-vite": ["catalog/list-filters/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/list-filters/files/next-app-router/page.tsx",
      ],
      "wc-universal": ["catalog/list-filters/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/list-filters/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/list-filters/states/loading.json",
      "catalog/list-filters/states/empty.json",
      "catalog/list-filters/states/error.json",
      "catalog/list-filters/states/success.json",
      "catalog/list-filters/states/no-access.json",
    ],
    variants: [
      "catalog/list-filters/variants/simple.json",
      "catalog/list-filters/variants/advanced.json",
    ],
    samples: [
      "catalog/list-filters/samples/records.json",
      "catalog/list-filters/samples/filters.json",
    ],
  },
  {
    slug: "detail-tabs-timeline",
    manifest: assertTemplateManifest(DetailTabsTimelineManifest),
    rootDir: "catalog/detail-tabs-timeline",
    readmePath: "catalog/detail-tabs-timeline/README.md",
    previewPath: "catalog/detail-tabs-timeline/preview.md",
    files: {
      "react-vite": ["catalog/detail-tabs-timeline/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/detail-tabs-timeline/files/next-app-router/page.tsx",
      ],
      "wc-universal": [
        "catalog/detail-tabs-timeline/files/wc-universal/template.ts",
      ],
      "blazor-wc": [
        "catalog/detail-tabs-timeline/files/blazor-wc/Template.razor",
      ],
    },
    states: [
      "catalog/detail-tabs-timeline/states/loading.json",
      "catalog/detail-tabs-timeline/states/empty.json",
      "catalog/detail-tabs-timeline/states/error.json",
      "catalog/detail-tabs-timeline/states/success.json",
      "catalog/detail-tabs-timeline/states/no-access.json",
    ],
    variants: [
      "catalog/detail-tabs-timeline/variants/client-service.json",
      "catalog/detail-tabs-timeline/variants/b2b-account.json",
    ],
    samples: [
      "catalog/detail-tabs-timeline/samples/account.json",
      "catalog/detail-tabs-timeline/samples/events.json",
    ],
  },
  {
    slug: "form-create-edit",
    manifest: assertTemplateManifest(FormCreateEditManifest),
    rootDir: "catalog/form-create-edit",
    readmePath: "catalog/form-create-edit/README.md",
    previewPath: "catalog/form-create-edit/preview.md",
    files: {
      "react-vite": ["catalog/form-create-edit/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/form-create-edit/files/next-app-router/page.tsx",
      ],
      "wc-universal": [
        "catalog/form-create-edit/files/wc-universal/template.ts",
      ],
      "blazor-wc": ["catalog/form-create-edit/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/form-create-edit/states/loading.json",
      "catalog/form-create-edit/states/empty.json",
      "catalog/form-create-edit/states/error.json",
      "catalog/form-create-edit/states/success.json",
      "catalog/form-create-edit/states/no-access.json",
    ],
    variants: [
      "catalog/form-create-edit/variants/single-column.json",
      "catalog/form-create-edit/variants/sectioned.json",
    ],
    samples: [
      "catalog/form-create-edit/samples/form-draft.json",
      "catalog/form-create-edit/samples/form-schema.json",
    ],
  },
  {
    slug: "settings-sectioned",
    manifest: assertTemplateManifest(SettingsSectionedManifest),
    rootDir: "catalog/settings-sectioned",
    readmePath: "catalog/settings-sectioned/README.md",
    previewPath: "catalog/settings-sectioned/preview.md",
    files: {
      "react-vite": ["catalog/settings-sectioned/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/settings-sectioned/files/next-app-router/page.tsx",
      ],
      "wc-universal": [
        "catalog/settings-sectioned/files/wc-universal/template.ts",
      ],
      "blazor-wc": [
        "catalog/settings-sectioned/files/blazor-wc/Template.razor",
      ],
    },
    states: [
      "catalog/settings-sectioned/states/loading.json",
      "catalog/settings-sectioned/states/empty.json",
      "catalog/settings-sectioned/states/error.json",
      "catalog/settings-sectioned/states/success.json",
      "catalog/settings-sectioned/states/no-access.json",
    ],
    variants: [
      "catalog/settings-sectioned/variants/workspace.json",
      "catalog/settings-sectioned/variants/account.json",
    ],
    samples: [
      "catalog/settings-sectioned/samples/settings.json",
      "catalog/settings-sectioned/samples/policies.json",
    ],
  },
  {
    slug: "team-roles-starter",
    manifest: assertTemplateManifest(TeamRolesStarterManifest),
    rootDir: "catalog/team-roles-starter",
    readmePath: "catalog/team-roles-starter/README.md",
    previewPath: "catalog/team-roles-starter/preview.md",
    files: {
      "react-vite": ["catalog/team-roles-starter/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/team-roles-starter/files/next-app-router/page.tsx",
      ],
      "wc-universal": [
        "catalog/team-roles-starter/files/wc-universal/template.ts",
      ],
      "blazor-wc": [
        "catalog/team-roles-starter/files/blazor-wc/Template.razor",
      ],
    },
    states: [
      "catalog/team-roles-starter/states/loading.json",
      "catalog/team-roles-starter/states/empty.json",
      "catalog/team-roles-starter/states/error.json",
      "catalog/team-roles-starter/states/success.json",
      "catalog/team-roles-starter/states/no-access.json",
    ],
    variants: [
      "catalog/team-roles-starter/variants/internal-team.json",
      "catalog/team-roles-starter/variants/customer-admin.json",
    ],
    samples: [
      "catalog/team-roles-starter/samples/members.json",
      "catalog/team-roles-starter/samples/roles.json",
    ],
  },
  {
    slug: "billing-plans-starter",
    manifest: assertTemplateManifest(BillingPlansStarterManifest),
    rootDir: "catalog/billing-plans-starter",
    readmePath: "catalog/billing-plans-starter/README.md",
    previewPath: "catalog/billing-plans-starter/preview.md",
    files: {
      "react-vite": [
        "catalog/billing-plans-starter/files/react-vite/index.tsx",
      ],
      "next-app-router": [
        "catalog/billing-plans-starter/files/next-app-router/page.tsx",
      ],
      "wc-universal": [
        "catalog/billing-plans-starter/files/wc-universal/template.ts",
      ],
      "blazor-wc": [
        "catalog/billing-plans-starter/files/blazor-wc/Template.razor",
      ],
    },
    states: [
      "catalog/billing-plans-starter/states/loading.json",
      "catalog/billing-plans-starter/states/empty.json",
      "catalog/billing-plans-starter/states/error.json",
      "catalog/billing-plans-starter/states/success.json",
      "catalog/billing-plans-starter/states/no-access.json",
    ],
    variants: [
      "catalog/billing-plans-starter/variants/founder.json",
      "catalog/billing-plans-starter/variants/enterprise.json",
    ],
    samples: [
      "catalog/billing-plans-starter/samples/plans.json",
      "catalog/billing-plans-starter/samples/usage.json",
    ],
  },
  {
    slug: "onboarding-3-step",
    manifest: assertTemplateManifest(Onboarding3StepManifest),
    rootDir: "catalog/onboarding-3-step",
    readmePath: "catalog/onboarding-3-step/README.md",
    previewPath: "catalog/onboarding-3-step/preview.md",
    files: {
      "react-vite": ["catalog/onboarding-3-step/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/onboarding-3-step/files/next-app-router/page.tsx",
      ],
      "wc-universal": [
        "catalog/onboarding-3-step/files/wc-universal/template.ts",
      ],
      "blazor-wc": ["catalog/onboarding-3-step/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/onboarding-3-step/states/loading.json",
      "catalog/onboarding-3-step/states/empty.json",
      "catalog/onboarding-3-step/states/error.json",
      "catalog/onboarding-3-step/states/success.json",
      "catalog/onboarding-3-step/states/no-access.json",
    ],
    variants: [
      "catalog/onboarding-3-step/variants/self-serve.json",
      "catalog/onboarding-3-step/variants/team.json",
    ],
    samples: [
      "catalog/onboarding-3-step/samples/steps.json",
      "catalog/onboarding-3-step/samples/checks.json",
    ],
  },
  {
    slug: "auth/sign-in",
    manifest: assertTemplateManifest(AuthSignInManifest),
    rootDir: "catalog/auth/sign-in",
    readmePath: "catalog/auth/sign-in/README.md",
    previewPath: "catalog/auth/sign-in/preview.md",
    files: {
      "react-vite": ["catalog/auth/sign-in/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/auth/sign-in/files/next-app-router/page.tsx",
      ],
      "wc-universal": ["catalog/auth/sign-in/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/auth/sign-in/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/auth/sign-in/states/loading.json",
      "catalog/auth/sign-in/states/empty.json",
      "catalog/auth/sign-in/states/error.json",
      "catalog/auth/sign-in/states/success.json",
      "catalog/auth/sign-in/states/no-access.json",
    ],
    variants: ["catalog/auth/sign-in/variants/email-first.json"],
    samples: ["catalog/auth/sign-in/samples/sign-in.json"],
  },
  {
    slug: "auth/sign-up",
    manifest: assertTemplateManifest(AuthSignUpManifest),
    rootDir: "catalog/auth/sign-up",
    readmePath: "catalog/auth/sign-up/README.md",
    previewPath: "catalog/auth/sign-up/preview.md",
    files: {
      "react-vite": ["catalog/auth/sign-up/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/auth/sign-up/files/next-app-router/page.tsx",
      ],
      "wc-universal": ["catalog/auth/sign-up/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/auth/sign-up/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/auth/sign-up/states/loading.json",
      "catalog/auth/sign-up/states/empty.json",
      "catalog/auth/sign-up/states/error.json",
      "catalog/auth/sign-up/states/success.json",
      "catalog/auth/sign-up/states/no-access.json",
    ],
    variants: [
      "catalog/auth/sign-up/variants/invite.json",
      "catalog/auth/sign-up/variants/self-serve.json",
    ],
    samples: ["catalog/auth/sign-up/samples/sign-up.json"],
  },
  {
    slug: "auth/forgot",
    manifest: assertTemplateManifest(AuthForgotManifest),
    rootDir: "catalog/auth/forgot",
    readmePath: "catalog/auth/forgot/README.md",
    previewPath: "catalog/auth/forgot/preview.md",
    files: {
      "react-vite": ["catalog/auth/forgot/files/react-vite/index.tsx"],
      "next-app-router": ["catalog/auth/forgot/files/next-app-router/page.tsx"],
      "wc-universal": ["catalog/auth/forgot/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/auth/forgot/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/auth/forgot/states/loading.json",
      "catalog/auth/forgot/states/empty.json",
      "catalog/auth/forgot/states/error.json",
      "catalog/auth/forgot/states/success.json",
      "catalog/auth/forgot/states/no-access.json",
    ],
    variants: ["catalog/auth/forgot/variants/email-only.json"],
    samples: ["catalog/auth/forgot/samples/forgot-password.json"],
  },
  {
    slug: "auth/reset",
    manifest: assertTemplateManifest(AuthResetManifest),
    rootDir: "catalog/auth/reset",
    readmePath: "catalog/auth/reset/README.md",
    previewPath: "catalog/auth/reset/preview.md",
    files: {
      "react-vite": ["catalog/auth/reset/files/react-vite/index.tsx"],
      "next-app-router": ["catalog/auth/reset/files/next-app-router/page.tsx"],
      "wc-universal": ["catalog/auth/reset/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/auth/reset/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/auth/reset/states/loading.json",
      "catalog/auth/reset/states/empty.json",
      "catalog/auth/reset/states/error.json",
      "catalog/auth/reset/states/success.json",
      "catalog/auth/reset/states/no-access.json",
    ],
    variants: ["catalog/auth/reset/variants/single-step.json"],
    samples: ["catalog/auth/reset/samples/reset-password.json"],
  },
  {
    slug: "landing-section-based",
    manifest: assertTemplateManifest(LandingSectionBasedManifest),
    rootDir: "catalog/landing-section-based",
    readmePath: "catalog/landing-section-based/README.md",
    previewPath: "catalog/landing-section-based/preview.md",
    files: {
      "react-vite": [
        "catalog/landing-section-based/files/react-vite/index.tsx",
      ],
      "next-app-router": [
        "catalog/landing-section-based/files/next-app-router/page.tsx",
      ],
      "wc-universal": [
        "catalog/landing-section-based/files/wc-universal/template.ts",
      ],
      "blazor-wc": [
        "catalog/landing-section-based/files/blazor-wc/Template.razor",
      ],
    },
    states: [
      "catalog/landing-section-based/states/loading.json",
      "catalog/landing-section-based/states/empty.json",
      "catalog/landing-section-based/states/error.json",
      "catalog/landing-section-based/states/success.json",
      "catalog/landing-section-based/states/no-access.json",
    ],
    variants: [
      "catalog/landing-section-based/variants/product-launch.json",
      "catalog/landing-section-based/variants/enterprise.json",
    ],
    samples: ["catalog/landing-section-based/samples/landing-content.json"],
  },
  {
    slug: "pricing-basic",
    manifest: assertTemplateManifest(PricingBasicManifest),
    rootDir: "catalog/pricing-basic",
    readmePath: "catalog/pricing-basic/README.md",
    previewPath: "catalog/pricing-basic/preview.md",
    files: {
      "react-vite": ["catalog/pricing-basic/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/pricing-basic/files/next-app-router/page.tsx",
      ],
      "wc-universal": ["catalog/pricing-basic/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/pricing-basic/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/pricing-basic/states/loading.json",
      "catalog/pricing-basic/states/empty.json",
      "catalog/pricing-basic/states/error.json",
      "catalog/pricing-basic/states/success.json",
      "catalog/pricing-basic/states/no-access.json",
    ],
    variants: [
      "catalog/pricing-basic/variants/self-serve.json",
      "catalog/pricing-basic/variants/hybrid.json",
    ],
    samples: [
      "catalog/pricing-basic/samples/pricing.json",
      "catalog/pricing-basic/samples/faq.json",
    ],
  },
  {
    slug: "faq",
    manifest: assertTemplateManifest(FaqManifest),
    rootDir: "catalog/faq",
    readmePath: "catalog/faq/README.md",
    previewPath: "catalog/faq/preview.md",
    files: {
      "react-vite": ["catalog/faq/files/react-vite/index.tsx"],
      "next-app-router": ["catalog/faq/files/next-app-router/page.tsx"],
      "wc-universal": ["catalog/faq/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/faq/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/faq/states/loading.json",
      "catalog/faq/states/empty.json",
      "catalog/faq/states/error.json",
      "catalog/faq/states/success.json",
      "catalog/faq/states/no-access.json",
    ],
    variants: [
      "catalog/faq/variants/product.json",
      "catalog/faq/variants/security.json",
    ],
    samples: ["catalog/faq/samples/faq.json"],
  },
  {
    slug: "contact",
    manifest: assertTemplateManifest(ContactManifest),
    rootDir: "catalog/contact",
    readmePath: "catalog/contact/README.md",
    previewPath: "catalog/contact/preview.md",
    files: {
      "react-vite": ["catalog/contact/files/react-vite/index.tsx"],
      "next-app-router": ["catalog/contact/files/next-app-router/page.tsx"],
      "wc-universal": ["catalog/contact/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/contact/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/contact/states/loading.json",
      "catalog/contact/states/empty.json",
      "catalog/contact/states/error.json",
      "catalog/contact/states/success.json",
      "catalog/contact/states/no-access.json",
    ],
    variants: [
      "catalog/contact/variants/sales.json",
      "catalog/contact/variants/support.json",
    ],
    samples: ["catalog/contact/samples/contact.json"],
  },
  {
    slug: "legal-layout",
    manifest: assertTemplateManifest(LegalLayoutManifest),
    rootDir: "catalog/legal-layout",
    readmePath: "catalog/legal-layout/README.md",
    previewPath: "catalog/legal-layout/preview.md",
    files: {
      "react-vite": ["catalog/legal-layout/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/legal-layout/files/next-app-router/page.tsx",
      ],
      "wc-universal": ["catalog/legal-layout/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/legal-layout/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/legal-layout/states/loading.json",
      "catalog/legal-layout/states/empty.json",
      "catalog/legal-layout/states/error.json",
      "catalog/legal-layout/states/success.json",
      "catalog/legal-layout/states/no-access.json",
    ],
    variants: [
      "catalog/legal-layout/variants/privacy.json",
      "catalog/legal-layout/variants/terms.json",
      "catalog/legal-layout/variants/security.json",
    ],
    samples: ["catalog/legal-layout/samples/policy-sections.json"],
  },
  {
    slug: "docs-home",
    manifest: assertTemplateManifest(DocsHomeManifest),
    rootDir: "catalog/docs-home",
    readmePath: "catalog/docs-home/README.md",
    previewPath: "catalog/docs-home/preview.md",
    files: {
      "react-vite": ["catalog/docs-home/files/react-vite/index.tsx"],
      "next-app-router": ["catalog/docs-home/files/next-app-router/page.tsx"],
      "wc-universal": ["catalog/docs-home/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/docs-home/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/docs-home/states/loading.json",
      "catalog/docs-home/states/empty.json",
      "catalog/docs-home/states/error.json",
      "catalog/docs-home/states/success.json",
      "catalog/docs-home/states/no-access.json",
    ],
    variants: [
      "catalog/docs-home/variants/product.json",
      "catalog/docs-home/variants/developer.json",
    ],
    samples: ["catalog/docs-home/samples/docs-home.json"],
  },
  {
    slug: "docs-article",
    manifest: assertTemplateManifest(DocsArticleManifest),
    rootDir: "catalog/docs-article",
    readmePath: "catalog/docs-article/README.md",
    previewPath: "catalog/docs-article/preview.md",
    files: {
      "react-vite": ["catalog/docs-article/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/docs-article/files/next-app-router/page.tsx",
      ],
      "wc-universal": ["catalog/docs-article/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/docs-article/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/docs-article/states/loading.json",
      "catalog/docs-article/states/empty.json",
      "catalog/docs-article/states/error.json",
      "catalog/docs-article/states/success.json",
      "catalog/docs-article/states/no-access.json",
    ],
    variants: [
      "catalog/docs-article/variants/api.json",
      "catalog/docs-article/variants/concept.json",
    ],
    samples: ["catalog/docs-article/samples/article.mdx"],
  },
  {
    slug: "blog-index",
    manifest: assertTemplateManifest(BlogIndexManifest),
    rootDir: "catalog/blog-index",
    readmePath: "catalog/blog-index/README.md",
    previewPath: "catalog/blog-index/preview.md",
    files: {
      "react-vite": ["catalog/blog-index/files/react-vite/index.tsx"],
      "next-app-router": ["catalog/blog-index/files/next-app-router/page.tsx"],
      "wc-universal": ["catalog/blog-index/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/blog-index/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/blog-index/states/loading.json",
      "catalog/blog-index/states/empty.json",
      "catalog/blog-index/states/error.json",
      "catalog/blog-index/states/success.json",
      "catalog/blog-index/states/no-access.json",
    ],
    variants: [
      "catalog/blog-index/variants/product.json",
      "catalog/blog-index/variants/culture.json",
    ],
    samples: ["catalog/blog-index/samples/posts.json"],
  },
  {
    slug: "blog-article",
    manifest: assertTemplateManifest(BlogArticleManifest),
    rootDir: "catalog/blog-article",
    readmePath: "catalog/blog-article/README.md",
    previewPath: "catalog/blog-article/preview.md",
    files: {
      "react-vite": ["catalog/blog-article/files/react-vite/index.tsx"],
      "next-app-router": [
        "catalog/blog-article/files/next-app-router/page.tsx",
      ],
      "wc-universal": ["catalog/blog-article/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/blog-article/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/blog-article/states/loading.json",
      "catalog/blog-article/states/empty.json",
      "catalog/blog-article/states/error.json",
      "catalog/blog-article/states/success.json",
      "catalog/blog-article/states/no-access.json",
    ],
    variants: [
      "catalog/blog-article/variants/announcement.json",
      "catalog/blog-article/variants/essay.json",
    ],
    samples: ["catalog/blog-article/samples/post.mdx"],
  },
  {
    slug: "changelog",
    manifest: assertTemplateManifest(ChangelogManifest),
    rootDir: "catalog/changelog",
    readmePath: "catalog/changelog/README.md",
    previewPath: "catalog/changelog/preview.md",
    files: {
      "react-vite": ["catalog/changelog/files/react-vite/index.tsx"],
      "next-app-router": ["catalog/changelog/files/next-app-router/page.tsx"],
      "wc-universal": ["catalog/changelog/files/wc-universal/template.ts"],
      "blazor-wc": ["catalog/changelog/files/blazor-wc/Template.razor"],
    },
    states: [
      "catalog/changelog/states/loading.json",
      "catalog/changelog/states/empty.json",
      "catalog/changelog/states/error.json",
      "catalog/changelog/states/success.json",
      "catalog/changelog/states/no-access.json",
    ],
    variants: [
      "catalog/changelog/variants/product.json",
      "catalog/changelog/variants/package.json",
    ],
    samples: ["catalog/changelog/samples/releases.json"],
  },
];
