#!/bin/bash
# Add packs to users based on subscription amount
subscribed_users=$(mysql admin_cards -u admin_cards csv_import -CTRFcardMaster99! -e "SELECT userID, subscription FROM admin_cards.settings WHERE subscription > 0;")
echo subscribed_users

# Cancel subscriptions for users who don't have enough money

# Notfiy users of their cancelled subscriptions