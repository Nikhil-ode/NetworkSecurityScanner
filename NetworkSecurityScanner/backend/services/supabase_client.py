"""Supabase client service"""
import logging
import os

logger = logging.getLogger(__name__)

class SupabaseClient:
    """Handles Supabase database operations"""

    def __init__(self):
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_KEY')
        self.client = None

        if self.url and self.key:
            try:
                # Initialize Supabase client
                # from supabase import create_client
                # self.client = create_client(self.url, self.key)
                logger.info("Supabase client initialized")
            except Exception as e:
                logger.error(f"Error initializing Supabase: {str(e)}")

    def insert(self, table, data):
        """Insert data into Supabase table"""
        try:
            if self.client:
                result = self.client.table(table).insert(data).execute()
                return result.data
            logger.warning("Supabase client not initialized")
            return None
        except Exception as e:
            logger.error(f"Error inserting data: {str(e)}")
            return None

    def select(self, table, filters=None):
        """Select data from Supabase table"""
        try:
            if self.client:
                query = self.client.table(table).select("*")
                if filters:
                    for key, value in filters.items():
                        query = query.eq(key, value)
                result = query.execute()
                return result.data
            logger.warning("Supabase client not initialized")
            return []
        except Exception as e:
            logger.error(f"Error selecting data: {str(e)}")
            return []

    def update(self, table, data, filters):
        """Update data in Supabase table"""
        try:
            if self.client:
                query = self.client.table(table).update(data)
                for key, value in filters.items():
                    query = query.eq(key, value)
                result = query.execute()
                return result.data
            logger.warning("Supabase client not initialized")
            return None
        except Exception as e:
            logger.error(f"Error updating data: {str(e)}")
            return None

    def delete(self, table, filters):
        """Delete data from Supabase table"""
        try:
            if self.client:
                query = self.client.table(table).delete()
                for key, value in filters.items():
                    query = query.eq(key, value)
                query.execute()
                return True
            logger.warning("Supabase client not initialized")
            return False
        except Exception as e:
            logger.error(f"Error deleting data: {str(e)}")
            return False
