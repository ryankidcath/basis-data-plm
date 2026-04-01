# Handoff

Folder ini menyimpan handoff antar agent dalam format file `.md`.

## Naming Convention

```
{from}-to-{to}-{nnn}.md
```

Contoh:
- `ceo-to-pm-001.md`
- `pm-to-architect-001.md`
- `pm-to-backend-001.md`
- `architect-to-backend-001.md`
- `pm-to-frontend-001.md`

Jika ada lebih dari satu handoff dari agent yang sama ke agent yang sama, naikkan nomor: `ceo-to-pm-002.md`

## Lokasi

- **Workspace root**: `handoff/` — untuk proyek umum atau saat belum punya folder proyek
- **Per proyek**: `projects/{nama-proyek}/handoff/` — untuk handoff spesifik proyek

## Workflow

1. Agent menghasilkan handoff (di jawaban atau langsung ke file)
2. Jika mode Agent: simpan ke file di folder ini
3. Jika mode Ask/Plan: user copy handoff dari jawaban, lalu simpan manual ke file
4. User antarkan file handoff ke agent berikutnya: Add to Chat atau "Baca handoff di handoff/xxx.md"
