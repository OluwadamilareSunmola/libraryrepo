from datetime import datetime, timedelta

class Loan:
    DAILY_FINE = 0.50
    GRACE_DAYS = 2
    MAX_FINE = 20.00

    def __init__(self, loan_id, user_id, book, borrow_date=None):
        self.loan_id = loan_id
        self.user_id = user_id
        self.book = book
        self.borrow_date = borrow_date or datetime.now()
        self.return_date = None

    def mark_returned(self):
        self.return_date = datetime.now()
        self.book.mark_as_returned()

    def compute_fine(self):
        due_date = self.borrow_date + timedelta(days=14 + self.GRACE_DAYS)
        if not self.return_date or self.return_date <= due_date:
            return 0.0
        overdue_days = (self.return_date - due_date).days
        return min(overdue_days * self.DAILY_FINE, self.MAX_FINE)
