# Delete Duplicate Cards

This script deletes duplicate cards from the card table a long as they have not been approved and no user owns one. Duplicates are defined as having identical player_name, teamID, playerID, card_rarity, position, and season.

When duplicates exist the card to be kept will be decided in the following order:

- image_url exists
- author_userID exists
- higher overall

Instances where duplicates are approved and exist within a user's collection should all duplicates to:

- card_rarity Misprint
- pullable 0

`ts-node ./bin/delete-duplicate-cards/exec.ts`
