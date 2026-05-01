# KLAFSTORE Dashboard2 — Context File

## ÇáÑÇÈØ
https://dashboard2-sand.vercel.app

## Infrastructure
- Frontend: Next.js 15 Úáì Vercel
- Backend: Cloudflare Workers + Hono — api.klafstore.com
- DB: Cloudflare D1 — aks-db
- Storage: R2 — cdn.klafstore.com
- Cache: Upstash Redis (2FA codes)
- Email: Resend — noreply@klafstore.com

## Auth
- Admin: /login ? 2FA (email code via Resend + Upstash Redis)
- Seller: /seller/login
- Affiliate: /affiliate/login
- Cookie: accessToken (httpOnly)

## åíßá ÇáãáİÇÊ

### Pages
- /admin — áæÍÉ ÇáÊÍßã ÇáÑÆíÓíÉ
- /admin/customers — ÇáÚãáÇÁ
- /admin/customers/sellers — ÇáÈÇÆÚæä
- /admin/customers/affiliate — ÇáÚãæáÉ
- /admin/customers/staff — ÇáãæÙİæä
- /admin/customers/new — ÅÖÇİÉ ÍÓÇÈ
- /admin/customers/[id] — ÊİÇÕíá ãÓÊÎÏã
- /admin/products — ÇáãäÊÌÇÊ (ßáÇİ)
- /admin/products/sellers — ãäÊÌÇÊ ÇáÈÇÆÚíä
- /admin/products/affiliate — ãäÊÌÇÊ ÇáÚãæáÉ
- /admin/products/view/[id] — ÊİÇÕíá ãäÊÌ
- /admin/products/view/[id]/edit — ÊÚÏíá ãäÊÌ
- /admin/ads — ÇáÅÚáÇäÇÊ
- /admin/ads/new — ÅÚáÇä ÌÏíÏ
- /admin/brands — ÇáÈÑÇäÏÇÊ
- /admin/brands/new — ÈÑÇäÏ ÌÏíÏ
- /admin/brands/[username] — ÊÚÏíá ÈÑÇäÏ
- /admin/trash — ÓáÉ ÇáãåãáÇÊ
- /admin/trash/products — ãäÊÌÇÊ ãÍĞæİÉ
- /admin/trash/users — ãÓÊÎÏãæä ãÍĞæİæä

### API Routes
- /api/auth/login — ÊÓÌíá ÏÎæá + ÅÑÓÇá ßæÏ
- /api/auth/verify — ÇáÊÍŞŞ ãä ÇáßæÏ
- /api/auth/logout — ÊÓÌíá ÎÑæÌ
- /api/admin/users — ÅÏÇÑÉ ÇáãÓÊÎÏãíä
- /api/admin/users/[id] — ÍĞİ ãÓÊÎÏã
- /api/admin/users/[id]/ban — ÍÙÑ
- /api/admin/users/[id]/toggle — ÊİÚíá/ÊÚØíá
- /api/admin/products — ÇáãäÊÌÇÊ
- /api/admin/products/[id]/toggle — ÊİÚíá/ÊÚØíá ãäÊÌ
- /api/admin/products-list — ŞÇÆãÉ ßá ÇáãäÊÌÇÊ
- /api/admin/ads — ÇáÅÚáÇäÇÊ
- /api/admin/brands — ÇáÈÑÇäÏÇÊ
- /api/admin/brands/[username] — ÊÚÏíá ÈÑÇäÏ
- /api/admin/upload — ÑİÚ ÕæÑ R2
- /api/admin/trash — ÓáÉ ÇáãåãáÇÊ
- /api/admin/trash/restore — ÇÓÊÚÇÏÉ
- /api/account/delete — ÍĞİ ÍÓÇÈ

## ÇáãÊÈŞí
- [ ] ÑÈØ dashboard.klafstore.com ÈÜ Vercel
- [ ] ÕİÍÇÊ orders
- [ ] ÕİÍÇÊ stats
- [ ] ÕİÍÇÊ categories
- [ ] ÊØÈíŞ RBAC İí middleware
- [ ] ÊŞÓíã ÓáÉ ÇáãåãáÇÊ ÈİÆÇÊ
