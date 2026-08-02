-- =============================================================================
-- 芳仁牙醫診所部落格 — Supabase 瀏覽計數器
-- 在 Supabase 後台 → SQL Editor → New query，整段貼上後按 Run，執行一次即可。
-- =============================================================================

-- 1. 計數表：每個網頁一列（slug = 文章代碼，首頁固定用 'home'）
create table if not exists public.page_views (
  slug       text primary key,
  views      bigint      not null default 0,
  updated_at timestamptz not null default now()
);

-- 2. 開啟 RLS。開了之後預設全部禁止，再逐條開放我們要的權限。
alter table public.page_views enable row level security;

-- 3. 任何人（含未登入的 anon key）可以「讀」計數 —— 首頁卡片要靠這個顯示數字
drop policy if exists "public can read view counts" on public.page_views;
create policy "public can read view counts"
  on public.page_views
  for select
  to anon, authenticated
  using (true);

--    注意：這裡刻意「不」開放 insert / update / delete。
--    寫入一律只能透過下面那個 security definer 函式，前端無法直接改數字。

-- 4. 加一的函式：不存在就建立、存在就 +1，回傳加完之後的數值
create or replace function public.increment_view(page_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  -- 基本防呆：擋掉空值與異常長度的 slug
  if page_slug is null or length(page_slug) = 0 or length(page_slug) > 128 then
    raise exception 'invalid slug';
  end if;

  insert into public.page_views as p (slug, views, updated_at)
  values (page_slug, 1, now())
  on conflict (slug) do update
    set views = p.views + 1,
        updated_at = now()
  returning p.views into new_count;

  return new_count;
end;
$$;

-- 5. 只把執行權給前端會用到的角色
revoke all on function public.increment_view(text) from public;
grant execute on function public.increment_view(text) to anon, authenticated;

-- =============================================================================
-- 完成後，到 Project Settings → API 複製這兩個值，填進 assets/supabase-config.js：
--   Project URL        → url
--   anon public key    → anonKey
-- =============================================================================
