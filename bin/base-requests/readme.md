# Base Requests

This script creates new card requests for the provided season and inserts them into the database. Requests are only created if a card does not already exist with the same playerID, teamID, player_name and equal or higher card_rarity.

## Arguments

- dryRun: boolean - Created requests will only be inserted into the database if this is true

- season: number - The season to pull users from and create requests for

`ts-node ./bin/create-card-requests/create-card-requests.ts --dryRun=true --season=69`

## Attribute Formulas

### Forwards

Overall (OV) = Sum of all attributes + 2

Skating (SK) = acceleration + agility + balance + speed + stamina / 5

Shooting (SHT) = screening + getting open + shooting accuracy / 3

Hands (HND) = passing + pack handling + offensive read / 3

Checking (CHK) = checking + hitting + strength / 3

Defense (DEF) = positioning + stickchecking + defensive read / 3

### Defense

Overall (OV) = Sum of all attributes + 2

Skating (SK) = acceleration + agility + balance + speed + stamina / 5

Shooting (SHT) = shooting range + getting open / 2

Hands (HND) = passing + puck handling + offensive read / 3

Checking (CHK) = checking + hitting + strength / 3

Defense (DEF) = positioning + stickchecking + shotblocking + defensive read / 4

### Goalie

Overall (OV) = sum of all

High Shots (HGH) = blocker + glove / 2

Low Shots (LOW) = low shots + pokecheck /2

Quickness (QCK) = reflexes + skating /2

Control (CTL) = puckhandling + rebound + positioning / 3

Conditioning (CON) = recovery + mental toughness + goalie stamina / 3

## Rarity Formulas

### Skaters

- Diamond >= 88

- 88 > Ruby >= 85

- 85 > Gold >= 80

- 80 > Silver >= 70

- 70 > Bronze

### Goalies

- Diamond >= 89

- 89 > Ruby >= 86

- 86 > Gold >= 81

- 81 > Silver >= 76

- 76 > Bronze
