"""Potential Fishing Zone (PFZ) Intelligence Agent."""
from typing import List
from app.schemas.marine import Coordinates, PFZZone

class PFZIntelligenceAgent:
    def __init__(self, provider):
        self.provider = provider

    async def get_ranked_pfzs(
        self,
        coords: Coordinates,
        sort_by: str = "distance", # 'distance' | 'suitability' | 'safety' | 'combined'
        radius_km: float = 10.0
    ) -> List[PFZZone]:
        pfzs = await self.provider.get_pfz_advisories(coords, min(radius_km, 10.0))

        if sort_by == "distance":
            pfzs.sort(key=lambda x: x.distance_km)
        elif sort_by == "suitability":
            pfzs.sort(key=lambda x: x.suitability_score, reverse=True)
        elif sort_by == "safety":
            safety_rank = {"SAFE": 1, "CAUTION": 2, "AVOID": 3}
            pfzs.sort(key=lambda x: safety_rank.get(x.safety_rating, 9))
        elif sort_by == "combined":
            # Combined score = 60% suitability + 40% proximity (closer to 0-10 km is better)
            pfzs.sort(key=lambda x: (0.6 * x.suitability_score + 0.4 * max(0.0, 100.0 - (x.distance_km / 10.0) * 100.0)), reverse=True)

        return pfzs
