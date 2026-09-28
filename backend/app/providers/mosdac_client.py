"""Official ISRO MOSDAC Download API Client."""
import os
import time
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
try:
    import requests
except ImportError:
    requests = None

logger = logging.getLogger("mosdac_client")

class MosdacClient:
    """Client implementing official MOSDAC download and dataset discovery APIs."""

    TOKEN_URL = "https://mosdac.gov.in/download_api/gettoken"
    REFRESH_URL = "https://mosdac.gov.in/download_api/refresh-token"
    SEARCH_URL = "https://mosdac.gov.in/apios/datasets.json"
    DOWNLOAD_URL = "https://mosdac.gov.in/download_api/download"
    LOGOUT_URL = "https://mosdac.gov.in/download_api/logout"

    def __init__(self, username: Optional[str] = None, password: Optional[str] = None, cache_dir: Optional[str] = None):
        from app.config import settings
        self.username = username or settings.MOSDAC_USERNAME or os.getenv("MOSDAC_USERNAME", "")
        self.password = password or settings.MOSDAC_PASSWORD or os.getenv("MOSDAC_PASSWORD", "")
        
        # Cache directory
        if cache_dir:
            self.cache_dir = cache_dir
        else:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "mosdac"))
            self.cache_dir = base_dir
        
        os.makedirs(self.cache_dir, exist_ok=True)

        self._access_token: Optional[str] = None
        self._refresh_token: Optional[str] = None
        self._token_expiry_epoch: float = 0.0

    def is_configured(self) -> bool:
        return bool(self.username and self.password)

    def authenticate(self, force_refresh: bool = False) -> str:
        """Authenticates against MOSDAC gettoken or refreshes token."""
        now = time.time()
        if not force_refresh and self._access_token and now < self._token_expiry_epoch:
            return self._access_token

        if not self.is_configured():
            raise ValueError("MOSDAC credentials (MOSDAC_USERNAME, MOSDAC_PASSWORD) are not configured.")

        # If refresh token available and near expiry, try refresh
        if self._refresh_token and not force_refresh:
            try:
                resp = requests.post(
                    self.REFRESH_URL,
                    json={"refresh_token": self._refresh_token},
                    timeout=10
                )
                if resp.status_code == 200:
                    data = resp.json()
                    self._access_token = data.get("access_token")
                    if data.get("refresh_token"):
                        self._refresh_token = data.get("refresh_token")
                    self._token_expiry_epoch = now + 1800  # 30 min buffer
                    return self._access_token
            except Exception as e:
                logger.warning(f"MOSDAC token refresh failed, falling back to full re-auth: {e}")

        # Full re-authentication
        payload = {"username": self.username, "password": self.password}
        try:
            resp = requests.post(self.TOKEN_URL, json=payload, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                self._access_token = data.get("access_token")
                self._refresh_token = data.get("refresh_token")
                self._token_expiry_epoch = now + 1800
                logger.info("MOSDAC authentication successful")
                return self._access_token
            elif resp.status_code == 401:
                raise PermissionError("MOSDAC authentication rejected: Invalid username or password.")
            else:
                raise RuntimeError(f"MOSDAC authentication endpoint returned HTTP {resp.status_code}: {resp.text[:200]}")
        except requests.exceptions.RequestException as e:
            raise ConnectionError(f"MOSDAC authentication connection failed: {e}")

    def search_dataset(
        self,
        dataset_id: str,
        count: int = 5,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        bounding_box: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Searches for dataset entries using official MOSDAC Search API."""
        params = {"datasetId": dataset_id, "count": count}
        if start_time:
            params["startTime"] = start_time
        if end_time:
            params["endTime"] = end_time
        if bounding_box:
            params["boundingBox"] = bounding_box

        try:
            resp = requests.get(self.SEARCH_URL, params=params, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                entries = data.get("entries", [])
                logger.info(f"Found {len(entries)} files for dataset {dataset_id} (total available: {data.get('totalResults', 0)})")
                return entries
            elif resp.status_code == 500:
                # MOSDAC returns 500 when no records match parameters
                logger.warning(f"No data currently available on MOSDAC for dataset {dataset_id}")
                return []
            else:
                logger.error(f"MOSDAC search failed for {dataset_id} with status {resp.status_code}: {resp.text[:150]}")
                return []
        except requests.exceptions.RequestException as e:
            logger.error(f"MOSDAC search network exception for {dataset_id}: {e}")
            return []

    def download_file(self, record_id: str, filename: str, expected_size: Optional[int] = None) -> Optional[str]:
        """Downloads a file by record ID with disk caching and resume protection."""
        target_path = os.path.join(self.cache_dir, filename)
        part_path = target_path + ".part"

        # Check if already cached and non-empty
        if os.path.exists(target_path) and os.path.getsize(target_path) > 0:
            if expected_size is None or os.path.getsize(target_path) == expected_size:
                logger.debug(f"File {filename} is already cached ({os.path.getsize(target_path)} bytes)")
                return target_path

        token = self.authenticate()
        headers = {"Authorization": f"Bearer {token}"}
        params = {"id": record_id}

        try:
            # Delete stale incomplete download if any
            if os.path.exists(part_path):
                try:
                    os.remove(part_path)
                except OSError:
                    pass

            with requests.get(self.DOWNLOAD_URL, headers=headers, params=params, stream=True, timeout=25) as r:
                if r.status_code == 401:
                    # Token expired; refresh and retry once
                    token = self.authenticate(force_refresh=True)
                    headers = {"Authorization": f"Bearer {token}"}
                    r = requests.get(self.DOWNLOAD_URL, headers=headers, params=params, stream=True, timeout=25)

                if r.status_code != 200:
                    logger.error(f"MOSDAC download failed for {filename} (ID {record_id}): HTTP {r.status_code}")
                    return None

                with open(part_path, "wb") as f:
                    for chunk in r.iter_content(chunk_size=1024 * 1024):
                        if chunk:
                            f.write(chunk)

            # Atomic move from .part to final destination
            if os.path.exists(part_path):
                if os.path.exists(target_path):
                    os.remove(target_path)
                os.rename(part_path, target_path)

            logger.info(f"Successfully downloaded {filename} ({os.path.getsize(target_path)} bytes)")
            return target_path

        except Exception as e:
            logger.error(f"Exception downloading MOSDAC file {filename}: {e}")
            if os.path.exists(part_path):
                try:
                    os.remove(part_path)
                except OSError:
                    pass
            return None
