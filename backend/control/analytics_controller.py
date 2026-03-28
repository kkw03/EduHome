"""
AnalyticsController — valuation, trend, heatmap, and risk analytics.

FR2: Hidden Gems (Valuation Gap)
FR3: Market Trend & Momentum
FR4: Affordability Heatmap
FR5: Balloting Risk Simulator
"""

from datetime import date, timedelta

from sqlalchemy import func

from backend.entity import db
from backend.entity.hdb_block import HDBBlock
from backend.entity.transaction import Transaction
from backend.entity.primary_school import PrimarySchool
from backend.entity.priority_zone import PriorityZone


class AnalyticsController:

    # ------------------------------------------------------------------
    # FR2 — Hidden Gems / Valuation Gap
    # ------------------------------------------------------------------

    @staticmethod
    def calculate_zone_average_psf(block_ids):
        """Compute mean PSF across the most recent transaction of each block."""
        if not block_ids:
            return 0.0

        psf_values = []
        for bid in block_ids:
            latest = (
                Transaction.query
                .filter_by(block_id=bid)
                .order_by(Transaction.transaction_date.desc())
                .first()
            )
            if latest and latest.floor_area_sqm and latest.floor_area_sqm > 0:
                psf_values.append(latest.calculate_psf())

        return sum(psf_values) / len(psf_values) if psf_values else 0.0

    @staticmethod
    def calculate_valuation_gap(block_dicts):
        """Identify Hidden Gem blocks — those with PSF significantly below
        the zone average.

        Args:
            block_dicts: List of block dicts (with 'block_id' and 'avg_psf').

        Returns list of block dicts flagged as hidden gems (PSF > 10% below avg).
        """
        psf_values = [b["avg_psf"] for b in block_dicts if b.get("avg_psf")]
        if not psf_values:
            return []

        zone_avg = sum(psf_values) / len(psf_values)
        threshold = zone_avg * 0.90  # 10% below average

        gems = []
        for block in block_dicts:
            if block.get("avg_psf") and block["avg_psf"] < threshold:
                gems.append({
                    **block,
                    "zone_avg_psf": round(zone_avg, 2),
                    "savings_psf": round(zone_avg - block["avg_psf"], 2),
                })

        return gems

    # ------------------------------------------------------------------
    # FR3 — Market Trend & Momentum
    # ------------------------------------------------------------------

    @staticmethod
    def generate_market_trend(block_id, months=12):
        """Compute monthly average PSF and 3-month moving average for a block.

        Returns:
            {
                "labels": ["Jan 25", ...],
                "prices": [580.0, ...],
                "moving_avg": [null, null, 575.0, ...],
                "momentum": "Heating Up" | "Cooling Off" | "Stable"
            }
            or None if insufficient data.
        """
        cutoff = date.today() - timedelta(days=months * 31)
        transactions = (
            Transaction.query
            .filter(
                Transaction.block_id == block_id,
                Transaction.transaction_date >= cutoff,
            )
            .order_by(Transaction.transaction_date)
            .all()
        )

        if len(transactions) < 3:
            return None

        # Group by month and average PSF
        monthly = {}
        for tx in transactions:
            key = tx.transaction_date.strftime("%Y-%m")
            psf = tx.calculate_psf()
            if key not in monthly:
                monthly[key] = []
            monthly[key].append(psf)

        sorted_months = sorted(monthly.keys())
        labels = []
        prices = []
        for m in sorted_months:
            dt = date(int(m[:4]), int(m[5:7]), 1)
            labels.append(dt.strftime("%b %y"))
            prices.append(round(sum(monthly[m]) / len(monthly[m]), 2))

        # 3-month moving average
        moving_avg = [None, None]
        for i in range(2, len(prices)):
            avg = round(sum(prices[i - 2 : i + 1]) / 3, 2)
            moving_avg.append(avg)

        # Momentum: compare last 3 months vs previous 3 months
        momentum = "Stable"
        if len(prices) >= 6:
            recent = sum(prices[-3:]) / 3
            earlier = sum(prices[-6:-3]) / 3
            change_pct = (recent - earlier) / earlier * 100 if earlier else 0
            if change_pct > 2:
                momentum = "Heating Up"
            elif change_pct < -2:
                momentum = "Cooling Off"

        return {
            "labels": labels,
            "prices": prices,
            "moving_avg": moving_avg,
            "momentum": momentum,
        }

    # ------------------------------------------------------------------
    # FR4 — Affordability Heatmap
    # ------------------------------------------------------------------

    @staticmethod
    def generate_affordability_heatmap(block_dicts):
        """Assign a colour bucket to each block based on its PSF.

        Buckets:
            < $400  → green
            $400-500 → lime
            $500-600 → amber
            $600-700 → orange
            > $700  → red

        Returns list of block dicts with 'heatmap_color' added.
        """
        buckets = [
            (400, "#16a34a"),
            (500, "#65a30d"),
            (600, "#d97706"),
            (700, "#ea580c"),
            (float("inf"), "#dc2626"),
        ]

        result = []
        for block in block_dicts:
            psf = block.get("avg_psf")
            color = "#9ca3af"  # default grey for no data
            if psf is not None:
                for limit, c in buckets:
                    if psf < limit:
                        color = c
                        break
            result.append({**block, "heatmap_color": color})

        return result

    # ------------------------------------------------------------------
    # FR5 — Balloting Risk Simulator
    # ------------------------------------------------------------------

    @staticmethod
    def calculate_balloting_risk(school_id):
        """Estimate overcrowding risk for a school zone.

        Compares total residential units within 1km against Phase 2C vacancies.

        Returns:
            {
                "risk": "Low" | "Medium" | "High",
                "score": 0-100,
                "units_1km": int,
                "vacancies": int,
                "ratio": float
            }
            or None if school not found.
        """
        school = PrimarySchool.query.get(school_id)
        if school is None:
            return None

        # Sum total_units of blocks within 1km
        blocks_1km = (
            HDBBlock.query
            .filter(
                func.ST_DWithin(HDBBlock.location, school.location, 1000)
            )
            .all()
        )
        units_1km = sum(b.total_units or 0 for b in blocks_1km)
        vacancies = school.vacancies or 1  # avoid div-by-zero

        ratio = round(units_1km / vacancies, 1)

        if ratio >= 30:
            risk, score = "High", min(100, int(50 + ratio))
        elif ratio >= 15:
            risk, score = "Medium", int(30 + ratio)
        else:
            risk, score = "Low", int(ratio * 2)

        return {
            "risk": risk,
            "score": min(score, 100),
            "units_1km": units_1km,
            "vacancies": vacancies,
            "ratio": ratio,
        }
