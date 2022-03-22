# Cards

- DONE GET all cards /cards
- DONE POST create a card /cards
- DONE GET all claimed cards /cards/claimed
- DONE GET all requested cards /cards/requested
- DONE GET all unapproved cards /cards/unapproved
- DONE GET all approved cards /cards/approved
- DONE PATCH accept a card /cards/[cardID]/accept
- DONE PATCH deny a card /cards/[cardID]/deny
- DONE POST edit a card /cards/[cardID]/edit
- DONE PATCH update a card with an image /cards/[cardID]/image
- DONE PATCH claim a card /cards/[cardID]/claim/[uid]

- GET owners of a single card /cards/[cardID]

# Collections

- DONE GET all of a users cards /collections/[uid]
- GET the cards a user pulled from their last pack /collection/[uid]/last-pack

# Packs

- DONE GET all of the user's unopened packs /packs/[uid]
- DONE POST purchase a pack for a user /packs/[pack_type]/[uid]
- DONE POST open a pack /packs/[packID]

# Settings

- DONE GET single user's settings /settings/[uid]
- DONE POST insert or update a user's settings /settings/subscription/[uid]

# Users

- DONE GET all user /users
- DONE GET single users /users/[uid]
