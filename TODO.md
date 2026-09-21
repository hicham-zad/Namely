# TODO — before bringing the web dashboard back

matchbabynames.com is currently a **landing page for the mobile app only**. The dashboard
code is still in the repo (`app/(dashboard)/`, `app/login/`, `app/onboarding/`, `app/upgrade/`,
`components/dashboard/`, `hooks/`) but every web-app route redirects to `/`.

## Fix first

- [ ] **Google auth is broken**
  - Start at: `app/login/page.tsx`, `app/auth/callback/route.ts`, `hooks/useAuth.tsx`
  - Also check the Google provider config in Supabase (redirect URLs must include
    `<origin>/auth/callback`) and the Google Cloud OAuth client's authorised redirect URIs.
  - Done when: a new Google user lands in `/onboarding`, and a returning one lands in `/discover`.

- [ ] **Generated names list gets lost after generation**
  - Start at: `components/dashboard/GenerateNamesModal.tsx`, `hooks/useCouplePool.tsx`,
    `app/api/generate-names/route.ts`, `lib/name-generator.ts`
  - Done when: after generating, the new names are still in the queue after closing the modal
    and after a page refresh.

## Re-enable the dashboard

1. Set `WEB_DASHBOARD_ENABLED = true` in `proxy.ts`.
2. Restore the web CTAs that were removed from the marketing site: the "Start Matching" links in
   `components/layout/Header.tsx`, `components/layout/LandingPage.tsx` and `app/(marketing)/page.tsx`
   (`git log -p` on those files shows the old markup).
3. Swap `app/join/[code]/page.tsx` back to rendering `JoinClient` (still in that folder).
4. Update `public/llms.txt` and `public/llms-full.txt`, which now describe the site as landing-page only.
