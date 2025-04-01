export type CardStatus =
  | 'NeedsAuthor'
  | 'NeedsImage'
  | 'NeedsApproval'
  | 'NeedsAuthorPaid'
  | 'Done'

class CardService {
  /**
   * NOTE TO DEVS: The order of these if statements matter, e.g. it is implicitly accepted that if
   *  a card is in NeedsApproval status then it also has an author_userID and an image_url. DO NOT
   *  CHANGE THIS FUNCTION UNLESS YOU ACCOUNT FOR THAT IN YOUR CHANGES.
   */
  calculateStatus(card: Card): CardStatus {
    if (!card.author_userID) return 'NeedsAuthor'
    if (!card.image_url) return 'NeedsImage'
    if (card.approved !== 1) return 'NeedsApproval'
    if (card.author_paid !== 1) return 'NeedsAuthorPaid'
    return 'Done'
  }
}

export const cardService = new CardService()
