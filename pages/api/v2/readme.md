# Cards

- GET all cards /cards
- POST create a card /cards
- GET all claimed cards /cards/claimed
- GET all requested cards /cards/requested
- GET all unapproved cards /cards/unapproved
- GET all approved cards /cards/approved
- GET owners of a single card /cards/[cardID]
- PATCH accept a card /cards/[cardID]/accept
- PATCH deny a card /cards/[cardID]/deny
- POST edit a card /cards/[cardID]/edit
- PATCH update a card with an image /cards/[cardID]/image
- PATCH claim a card /cards/[cardID]/claim/[uid]

# Collections

- GET all of a users cards /collections/[uid]
- GET the cards a user pulled from their last pack /collection/[uid]/last-pack

# Packs

- GET all of the users unopened packs /packs/[uid]
- POST purchase a pack for a user /packs/[pack_type]/[uid]
- POST open a pack /packs/[packID]

# Settings

- DONE GET single user's settings /settings/[uid]
- DONE POST insert or update a user's settings /settings/subscription/[uid]

# Users

- DONE POST single user /users
- DONE GET all users /users/[uid]
