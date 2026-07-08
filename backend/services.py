import os
import uuid
import random
import logging
import json
from pathlib import Path
import razorpay

logger = logging.getLogger("uvicorn")

# Load environment keys
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "rzp_test_dummyKey")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "dummySecret")

try:
    if RAZORPAY_KEY_ID.startswith("rzp_test_dummy"):
        logger.info("Using mock credentials for Razorpay initialization.")
        razorpay_client = None
    else:
        razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        logger.info("Razorpay Client successfully initialized in backend.")
except Exception as e:
    logger.error(f"Failed to initialize Razorpay Client: {e}")
    razorpay_client = None


class RazorpayService:
    @staticmethod
    def create_order(amount_paise: int, receipt: str):
        """
        Creates an official Razorpay Order.
        amount_paise is in INR Paise (e.g. ₹1179.00 = 117900 paise)
        """
        if not razorpay_client:
            # Mock fallback for offline / test configs
            mock_order_id = f"order_mock_{uuid.uuid4().hex[:14].upper()}"
            logger.info(f"Creating mock Razorpay order: {mock_order_id} for amount: {amount_paise} paise")
            return {
                "order_id": mock_order_id,
                "amount": amount_paise,
                "currency": "INR",
                "key_id": RAZORPAY_KEY_ID,
                "is_mock": True
            }
        
        try:
            order_data = {
                "amount": amount_paise,
                "currency": "INR",
                "receipt": receipt,
                "payment_capture": 1
            }
            order = razorpay_client.order.create(data=order_data)
            logger.info(f"Created real Razorpay order: {order['id']}")
            return {
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "key_id": RAZORPAY_KEY_ID,
                "is_mock": False
            }
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}. Falling back to mock.")
            # Fallback to mock order so the app remains operational if Razorpay API drops
            mock_order_id = f"order_mock_{uuid.uuid4().hex[:14].upper()}"
            return {
                "order_id": mock_order_id,
                "amount": amount_paise,
                "currency": currency,
                "key_id": RAZORPAY_KEY_ID,
                "is_mock": True
            }

    @staticmethod
    def verify_payment(order_id: str, payment_id: str, signature: str) -> bool:
        """
        Verifies the authenticity of Razorpay payment credentials.
        """
        if order_id.startswith("order_mock_") or not razorpay_client:
            logger.info(f"Bypassing real signature verification for mock order: {order_id}")
            return True
            
        try:
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
            logger.info(f"Razorpay payment signature verified successfully for order: {order_id}")
            return True
        except Exception as e:
            logger.error(f"Razorpay signature verification failed: {e}")
            return False


class BookingService:
    @staticmethod
    async def is_slot_available(date_str: str, slot_str: str, use_local_db: bool, db) -> bool:
        """
        Checks slot availability against confirmed bookings to prevent duplicate schedules.
        """
        if not use_local_db and db is not None:
            try:
                existing = await db.bookings.find_one({
                    "date": date_str,
                    "slot": slot_str,
                    "status": "confirmed"
                })
                return existing is None
            except Exception as e:
                logger.error(f"MongoDB slot availability check failed: {e}. Falling back to local file.")
                
        # Read from local db.json fallback
        db_file = Path("db.json")
        if db_file.exists():
            try:
                with open(db_file, "r") as f:
                    data = json.load(f)
                    bookings = data.get("bookings", [])
                    for b in bookings:
                        if b.get("date") == date_str and b.get("slot") == slot_str and b.get("status") == "confirmed":
                            return False
            except Exception as e:
                logger.error(f"Local slot availability check failed: {e}")
        return True

    @staticmethod
    async def save_booking(booking_details: dict, use_local_db: bool, db) -> dict:
        """
        Registers the booking into database and returns details with Generated Booking ID.
        """
        booking_id = f"AP-2026-{random.randint(10000, 99999)}"
        booking_details["bookingId"] = booking_id
        booking_details["status"] = "confirmed"
        
        # Save to DB
        saved_success = False
        if not use_local_db and db is not None:
            try:
                await db.bookings.insert_one(booking_details.copy())
                saved_success = True
                logger.info(f"Booking {booking_id} successfully saved to MongoDB.")
            except Exception as e:
                logger.error(f"MongoDB booking insert failed: {e}. Falling back to local DB.")
                
        if not saved_success:
            # Fallback to local JSON persistence
            db_file = Path("db.json")
            data = {"status_checks": [], "blogs": [], "horoscope_reports": [], "bookings": []}
            if db_file.exists():
                try:
                    with open(db_file, "r") as f:
                        data = json.load(f)
                except Exception as e:
                    logger.error(f"Failed to read local DB: {e}")
            
            if "bookings" not in data:
                data["bookings"] = []
                
            # Strip MongoDB ObjectId reference if present
            booking_details.pop("_id", None)
            data["bookings"].append(booking_details)
            
            try:
                with open(db_file, "w") as f:
                    json.dump(data, f, indent=2)
                logger.info(f"Booking {booking_id} saved to local fallback DB.")
            except Exception as e:
                logger.error(f"Error writing to local DB: {e}")
                
        return booking_details


class PaymentService:
    @staticmethod
    async def process_and_confirm(
        booking_info: dict, 
        payment_info: dict, 
        use_local_db: bool, 
        db
    ) -> dict:
        """
        Coordinates payment verification and booking creation.
        """
        order_id = payment_info.get("razorpay_order_id")
        payment_id = payment_info.get("razorpay_payment_id")
        signature = payment_info.get("razorpay_signature")
        
        # 1. Double-check signature verification
        is_verified = RazorpayService.verify_payment(order_id, payment_id, signature)
        if not is_verified:
            raise Exception("Payment verification failed. Invalid transaction signature.")
            
        # 2. Check for duplicate payment check / double click prevention
        # Check if this order_id was already confirmed and has a booking
        if not use_local_db and db is not None:
            try:
                already_booked = await db.bookings.find_one({"payment_info.razorpay_order_id": order_id})
                if already_booked:
                    logger.warning(f"Duplicate booking attempt detected for Razorpay order: {order_id}")
                    # Return existing confirmed booking
                    already_booked.pop("_id", None)
                    return already_booked
            except Exception as e:
                logger.error(f"MongoDB duplicate check failed: {e}")
        else:
            db_file = Path("db.json")
            if db_file.exists():
                try:
                    with open(db_file, "r") as f:
                        data = json.load(f)
                        for b in data.get("bookings", []):
                            if b.get("payment_info", {}).get("razorpay_order_id") == order_id:
                                logger.warning(f"Duplicate booking found in local DB for Razorpay order: {order_id}")
                                return b
                except Exception as e:
                    logger.error(f"Local duplicate check failed: {e}")

        # 3. Double-check slot availability before writing
        is_avail = await BookingService.is_slot_available(
            booking_info.get("date"), 
            booking_info.get("slot"), 
            use_local_db, 
            db
        )
        if not is_avail:
            raise Exception("The selected time slot is already reserved. Payment will be refunded.")
            
        # 4. Save confirmed booking
        booking_info["payment_info"] = {
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
            "gateway": "razorpay"
        }
        
        confirmed_booking = await BookingService.save_booking(booking_info, use_local_db, db)
        return confirmed_booking
