"""Collision-resistant string IDs for new rows.

Prisma generates `cuid()` values client-side (the columns have no DB default),
so Django must supply an `id` on insert. Any unique string works as a PK; we use
the `cuid` library to stay shape-compatible with the rows Prisma created.
"""

import cuid


def generate_cuid() -> str:
    return cuid.cuid()
