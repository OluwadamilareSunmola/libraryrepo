import unittest
from datetime import timedelta

class TestLoan(unittest.TestCase):

    def test_fine_no_overdue(self):
        loan = Loan(1, 10, Book(1, "1984", "Orwell", "123", "Fiction"))
        loan.return_date = loan.borrow_date + timedelta(days=10)
        self.assertEqual(loan.compute_fine(), 0.0)

    def test_fine_overdue(self):
        loan = Loan(1, 10, Book(1, "1984", "Orwell", "123", "Fiction"))
        loan.return_date = loan.borrow_date + timedelta(days=30)
        self.assertGreater(loan.compute_fine(), 0.0)

    def test_fine_max_cap(self):
        loan = Loan(1, 10, Book(1, "1984", "Orwell", "123", "Fiction"))
        loan.return_date = loan.borrow_date + timedelta(days=300)
        self.assertEqual(loan.compute_fine(), Loan.MAX_FINE)
